"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Plane, Car, TrainFront, Ship } from "lucide-react";

// Classic map-pin silhouette (Material "place" glyph geometry — a plain
// teardrop + punched-out circle, both closed sub-paths with opposing
// winding so the hole renders correctly under the default nonzero fill
// rule). The tip sits at the bottom of the 24x24 viewBox, so iconAnchor is
// pinned there rather than at the icon's visual center.
function hubIcon(active) {
  const size = active ? 30 : 24;
  const color = active ? "#C0392B" : "#E4572E";
  return L.divIcon({
    className: "",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4));transition:all .2s ease;">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
        fill="${color}" stroke="#fff" stroke-width="0.8"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, Math.round(size * (22 / 24))],
    popupAnchor: [0, -size * 0.8],
  });
}

// Line colour per "Mode of Transport" taxonomy term (Drupal vocabulary
// mode_of_transport: Air/Road/Train/Water — see each itinerary day's
// field_mode_of_transport).
const ROUTE_COLORS = { Air: "#39396D", Road: "#343434", Train: "#343434", Water: "#078A99" };
const TRANSPORT_LABELS = {
  Air: { Icon: Plane, label: "Flight" },
  Road: { Icon: Car, label: "Drive" },
  Train: { Icon: TrainFront, label: "Train" },
  Water: { Icon: Ship, label: "Ferry" },
};

// Google-Maps-style highlight for the leg the user clicked.
const SELECTED_COLOR = "#3D1DF3";
const SELECTED_BORDER = "#1E0FB0";

function normalizeTransport(mode) {
  const value = String(mode || "").trim().toLowerCase();
  if (/road|ground|car|bus|coach/.test(value)) return "Road";
  if (/rail|train/.test(value)) return "Train";
  if (/water|ship|boat|ferry|cruise|sea/.test(value)) return "Water";
  return "Air";
}

// Great-circle distance between the two stops. The itinerary data has no
// real route/flight distance or duration, so the label shows this as
// approximate.
function distanceKm(from, to) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(to[0] - from[0]);
  const dLng = toRad(to[1] - from[1]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from[0])) * Math.cos(toRad(to[0])) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function TransportLeg({ positions, mode, km, selected, dimmed, onSelect, onDeselect }) {
  const color = ROUTE_COLORS[mode];
  const { Icon, label } = TRANSPORT_LABELS[mode];
  const opacity = dimmed ? 0.35 : 0.9;

  return (
    <>
      {selected ? (
        <>
          <Polyline positions={positions} pathOptions={{ color: SELECTED_BORDER, weight: 10, lineCap: "round", lineJoin: "round" }} interactive={false} />
          <Polyline positions={positions} pathOptions={{ color: SELECTED_COLOR, weight: 7, lineCap: "round", lineJoin: "round" }} interactive={false}>
            <Tooltip permanent direction="top" offset={[0, -10]} opacity={1} className="journey-leg-chip">
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, lineHeight: "16px" }}>
                <Icon size={15} color="#fff" strokeWidth={2.5} />
                {label}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, lineHeight: "15px" }}>
                ≈ {Math.round(km).toLocaleString("en-US")} km
              </div>
            </Tooltip>
          </Polyline>
        </>
      ) : mode === "Train" ? (
        <>
          <Polyline positions={positions} pathOptions={{ color, weight: 9, dashArray: "2 10", lineCap: "butt", opacity }} interactive={false} />
          <Polyline positions={positions} pathOptions={{ color, weight: 5, opacity }} interactive={false} />
          <Polyline positions={positions} pathOptions={{ color: "#FFFFFF", weight: 2, opacity }} interactive={false} />
        </>
      ) : (
        <Polyline positions={positions} pathOptions={{ color, weight: mode === "Air" ? 3 : 3.5, dashArray: mode === "Air" ? "1 9" : undefined, lineCap: "round", opacity }} interactive={false} />
      )}
      {/* Invisible, wider hit area so the thin dotted lines are easy to
          click. Click highlights the leg; moving the mouse off it restores
          the normal style. */}
      <Polyline
        positions={positions}
        pathOptions={{ color: "#000", weight: 18, opacity: 0 }}
        eventHandlers={{ click: onSelect, mouseout: onDeselect }}
      />
    </>
  );
}

// Samples a quadratic-bezier arc between two points so the route reads as a
// curved flight path rather than a straight line, alternating the bulge
// direction segment-to-segment for visual variety.
function curvedSegment(from, to, bend) {
  const latMid = (from[0] + to[0]) / 2;
  const lngMid = (from[1] + to[1]) / 2;
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  const dist = Math.sqrt(dLat * dLat + dLng * dLng) || 0.0001;
  const normLat = -dLng / dist;
  const normLng = dLat / dist;
  const offset = dist * 0.18 * bend;
  const control = [latMid + normLat * offset, lngMid + normLng * offset];

  const steps = 48;
  const points = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const oneMinusT = 1 - t;
    const lat =
      oneMinusT * oneMinusT * from[0] +
      2 * oneMinusT * t * control[0] +
      t * t * to[0];
    const lng =
      oneMinusT * oneMinusT * from[1] +
      2 * oneMinusT * t * control[1] +
      t * t * to[1];
    points.push([lat, lng]);
  }
  return points;
}

function FitToMarkers({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (!positions || positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 6);
    } else {
      map.fitBounds(L.latLngBounds(positions), { padding: [32, 32], maxZoom: 5 });
    }
  }, [positions, map]);
  return null;
}

export default function JourneyMap({ markers, activeDay }) {
  const markerRefs = useRef({});
  const [selectedLeg, setSelectedLeg] = useState(null);

  const points = useMemo(() => markers.map((m) => [m.lat, m.lon]), [markers]);
  // `markers[i].mode` is how the traveller arrives AT marker i (from the day
  // whose stay is marker i) — so leg (marker i -> marker i+1) is travelled by
  // markers[i + 1]'s mode, same logic as "how did we get to today's city".
  const legs = useMemo(() => points.slice(1).map((point, index) => ({
    positions: curvedSegment(points[index], point, index % 2 === 0 ? 1 : -1),
    mode: normalizeTransport(markers[index + 1]?.mode),
    km: distanceKm(points[index], point),
  })), [points, markers]);

  useEffect(() => {
    if (activeDay == null) return;
    const marker = markers.find((m) => m.days.some((d) => d.day === activeDay));
    if (!marker) return;
    const ref = markerRefs.current[marker.id];
    ref?.openPopup();
  }, [activeDay, markers]);

  return (
    <>
      <MapContainer
        center={points[0] || [20, 0]}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${process.env.NEXT_PUBLIC_CARTO_API_KEY}`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />
        <FitToMarkers positions={points} />
        {legs.map((leg, index) => (
          <TransportLeg
            key={index}
            positions={leg.positions}
            mode={leg.mode}
            km={leg.km}
            selected={index === selectedLeg}
            dimmed={selectedLeg != null && index !== selectedLeg}
            onSelect={() => setSelectedLeg(index)}
            onDeselect={() => setSelectedLeg((current) => (current === index ? null : current))}
          />
        ))}
        {markers.map((marker) => {
          const isActive = marker.days.some((d) => d.day === activeDay);
          return (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lon]}
              icon={hubIcon(isActive)}
              ref={(ref) => {
                if (ref) markerRefs.current[marker.id] = ref;
              }}
            >
              <Popup>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {marker.stayName}
                </div>
                {marker.days.map((d) => (
                  <div key={d.day} style={{ fontSize: 12 }}>
                    Day {d.day}: {d.title}
                  </div>
                ))}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
