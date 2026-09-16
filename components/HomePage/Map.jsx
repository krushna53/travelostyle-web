"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import Image from "next/image";
import destinations from "@/lib/travelostyle_destinations_FRONTEND.json";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// The card sits to the right of the pin, not centered on it, so its
// on-screen footprint (relative to the pin's lat/lng point) is a rectangle,
// not a circle — matching the pin+card markup's own dimensions (card is
// ~34px tall, 125px wide, offset 28px right of the pin) plus a small
// safety margin so cards never render edge-to-edge.
const CARD_BOX = { left: -16, right: 150, top: -20, bottom: 20 };

// Every pin's small round icon is always visible, whether or not its card
// is shown — so a shown card must also avoid every *other* pin's icon, not
// just other shown cards.
const PIN_BOX = { left: -12, right: 12, top: -12, bottom: 12 };

const rectsOverlap = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

// Greedily show as many cards as possible without overlap: walk the pins in
// order and show a card whenever it doesn't collide with an already-shown
// card OR with any other pin's own (always-visible) icon, instead of hiding
// a card just because some other, itself-hidden, pin happens to be nearby.
// Uses the live map's own projection (not a guessed zoom level) so it stays
// correct however far the view is zoomed.
const getIsolatedFlags = (map, items) => {
  const points = items.map((item) => map.latLngToContainerPoint(item.position));

  const cardBoxes = points.map((p) => ({
    left: p.x + CARD_BOX.left,
    right: p.x + CARD_BOX.right,
    top: p.y + CARD_BOX.top,
    bottom: p.y + CARD_BOX.bottom,
  }));

  const pinBoxes = points.map((p) => ({
    left: p.x + PIN_BOX.left,
    right: p.x + PIN_BOX.right,
    top: p.y + PIN_BOX.top,
    bottom: p.y + PIN_BOX.bottom,
  }));

  const shown = new Array(items.length).fill(false);

  cardBoxes.forEach((box, i) => {
    const hitsOtherPin = pinBoxes.some(
      (pinBox, j) => j !== i && rectsOverlap(box, pinBox),
    );
    const hitsShownCard = cardBoxes.some(
      (other, j) => shown[j] && rectsOverlap(box, other),
    );
    shown[i] = !hitsOtherPin && !hitsShownCard;
  });

  return shown;
};

const createMarker = (item, alwaysShow) =>
  L.divIcon({
    className: "map-marker-icon",
    html: `
      <div style="position:relative; width:24px; height:24px;">
        <div style="display:flex; align-items:center; justify-content:center; width:24px; height:24px; box-sizing:border-box; background:white; padding:3px; border-radius:50%; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#4A4E69"/>
          </svg>
        </div>
        <div class="map-marker-card${alwaysShow ? " map-marker-card-static" : ""}" style="
          position:absolute;
          top:50%;
          left:28px;
          transform:translateY(-50%);
          width:125px;
          background:white;
          display:flex;
          align-items:center;
          gap:5px;
          padding:3px;
          border-radius:3px;
          box-shadow:0 2px 6px rgba(0,0,0,.15);
        ">
          <img
            src="${item.image}"
            alt="${item.title}"
            style="
              width:28px;
              height:28px;
              object-fit:cover;
              border-radius:2px;
            "
          />
          <div style="overflow:hidden; font-family: sans-serif;">
            <div style="
              font-size:8px;
              font-weight:600;
              line-height:1.1;
              color:#222;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            ">
              ${item.title}
            </div>
            <div style="
              font-size:7px;
              color:#777;
              margin-top:1px;
            ">
              ${item.subtitle}
            </div>
            <div style="
              font-size:7px;
              font-weight:600;
              color:#2f2d89;
              text-decoration:underline;
              margin-top:2px;
            ">
              Browse Journeys
            </div>
          </div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

function MapZoomController({ destinations, onIsolationChange }) {
  const map = useMap();

  useEffect(() => {
    if (destinations.length === 1) {
      map.setView(destinations[0].position, 2, { animate: true });
    } else if (destinations.length > 1) {
      const bounds = L.latLngBounds(destinations.map((d) => d.position));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 2, animate: true });
    } else {
      map.setView([20, 40], 2, { animate: true });
    }
  }, [map, destinations]);

  // Recompute which cards can show without overlap once the view actually
  // settles (fitBounds/setView above are animated, so the map's real zoom
  // and center aren't final until "moveend" fires).
  useEffect(() => {
    const recompute = () => onIsolationChange(getIsolatedFlags(map, destinations));
    recompute();
    map.on("moveend", recompute);
    return () => map.off("moveend", recompute);
  }, [map, destinations, onIsolationChange]);

  return null;
}

export default function TravelDestinationWidget() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [isMobile, setIsMobile] = useState(false);
  const [isolatedFlags, setIsolatedFlags] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredDestinations = useMemo(
    () => destinations.filter((item) => item.months.includes(selectedMonth)),
    [selectedMonth],
  );

  return (
    // Figma gives this card 1705 on the 1920 board, not 1200 — the same
    // content width the rest of the board uses (1704 at left 108). figma-scale
    // supplies --fig-u, so it holds that width at 1920 and steps down with
    // every other section instead of sitting at a flat 1200. The horizontal
    // padding goes to 0 so 1705 is the card itself, not the box around it; on
    // mobile the unit resolves to ~0.2 and gives the 342 the phone board wants.
    <div
      className="figma-scale"
      style={{
        width: "100%",
        maxWidth: "calc(1705 * var(--fig-u))",
        margin: "0 auto",
        padding: "20px 0",
      }}
    >
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {months.map((month) => {
            const isExpanded = month === selectedMonth;
            const monthDestinations = destinations.filter((item) =>
              item.months.includes(month),
            );

            return (
              <div
                key={month}
                style={{
                  border: "2px solid #1A1A1A",
                  borderRadius: "5px",
                  background: isExpanded ? "#F2E2DA" : "#EFF3CF",
                  overflow: "hidden",
                  transition: "background-color 0.2s ease",
                }}
              >
                <div
                  onClick={() => setSelectedMonth(isExpanded ? "" : month)}
                  style={{
                    height: "64px",
                    padding: "0 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "21px",
                      lineHeight: "36px",
                      letterSpacing: "0.05em",
                      fontWeight: "600",
                      color: "#1A1A1A",
                    }}
                  >
                    {month}
                  </span>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    {isExpanded ? (
                      <Image
                        src="/CircleSub.svg"
                        alt="Next"
                        height={24}
                        width={48}
                        className="w-[32px] h-auto"
                      />
                    ) : (
                      <Image
                        src="/CircleAdd.svg"
                        alt="Next"
                        height={24}
                        width={48}
                        className="w-[32px] h-auto"
                      />
                    )}
                  </div>
                </div>

                {/* Accordion Dropdown Content list */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: "2px solid #1A1A1A",
                      background: "#F2E2DA",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {monthDestinations.length > 0 ? (
                      monthDestinations.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            borderBottom:
                              idx !== monthDestinations.length - 1
                                ? "2px solid #1A1A1A"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "2px",
                              }}
                            />
                            <div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  letterSpacing: "0.05em",
                                  color: "#1A1A1A",
                                }}
                              >
                                {item.title}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#555555",
                                  letterSpacing: "0.05em",
                                  marginTop: "2px",
                                }}
                              >
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                        
                          <button
                            onClick={() => {
                              if (item.countryCode) {
                                router.push(
                                  `/itinerary?country=${item.countryCode}`,
                                );
                              }
                            }}
                            className="shrink-0 cursor-pointer active:scale-95 transition"
                          >
                            <Image
                              src="/arrow.png"
                              alt="Next"
                              height={24}
                              width={56}
                              className="w-[48px] h-auto"
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "16px",
                          fontSize: "12px",
                          color: "#666",
                          fontStyle: "italic",
                          textAlign: "center",
                        }}
                      >
                        No journeys available for this month.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div
            style={{
              border: "2px solid #333333",
              borderRadius: "6px",
              padding: "24px 20px 20px 20px",
              background: "#ffffff",
              display: "flex",
              gap: "20px",
              minHeight: "520px",
            }}
          >
            <div
              style={{
                width: "140px",
                background: "#eef2da",
                borderRadius: "6px",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                zIndex: 10,
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
              }}
            >
              {months.map((month) => {
                const isSelected = month === selectedMonth;
                return (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      borderRadius: isSelected ? "4px" : "0px",
                      background: isSelected ? "#2d3675" : "transparent",
                      color: isSelected ? "#ffffff" : "#444444",
                      fontSize: "11px",
                      fontWeight: isSelected ? "600" : "400",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                flex: 1,
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <style jsx global>{`
                .screenshot-exact-tiles {
                  filter: invert(0.08) sepia(0.22) saturate(1.3)
                    hue-rotate(335deg) brightness(1.08) contrast(0.96);
                }
                .map-marker-icon {
                  overflow: visible !important;
                  cursor: pointer;
                }
                .map-marker-card {
                  opacity: 0;
                  visibility: hidden;
                  pointer-events: none;
                  transition: opacity 0.15s ease;
                }
                .map-marker-icon:hover {
                  z-index: 10000 !important;
                }
                .map-marker-icon:hover .map-marker-card {
                  opacity: 1;
                  visibility: visible;
                  pointer-events: auto;
                }
                .map-marker-card-static {
                  opacity: 1;
                  visibility: visible;
                  pointer-events: auto;
                }
              `}</style>

              <MapContainer
                center={[20, 40]}
                zoom={2}
                zoomControl={false}
                attributionControl={false}
                style={{
                  height: "100%",
                  width: "100%",
                  background: "#fdfbf7",
                  zIndex: 0,
                }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                  className="screenshot-exact-tiles"
                />
                <MapZoomController
                  destinations={filteredDestinations}
                  onIsolationChange={setIsolatedFlags}
                />
                {filteredDestinations.map((item, index) => (
                  <Marker
                    key={index}
                    position={item.position}
                    icon={createMarker(item, isolatedFlags[index])}
                    eventHandlers={{
                      click: () => {
                        if (item.countryCode) {
                          router.push(`/itinerary?country=${item.countryCode}`);
                        }
                      },
                    }}
                  />
                ))}
              </MapContainer>

              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "15px",
                  zIndex: 1000,
                  fontSize: "11px",
                  color: "#7e7e7e",
                  fontFamily: "sans-serif",
                  pointerEvents: "none",
                  letterSpacing: "0.2px",
                }}
              >
                select a month to see the best travel destinations
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
