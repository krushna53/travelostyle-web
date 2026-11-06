"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";

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

// One 3D icon per "Mode of Transport" taxonomy term (Drupal vocabulary
// mode_of_transport: Air/Road/Train/Water — see each itinerary day's
// field_mode_of_transport). Microsoft Fluent Emoji 3D (MIT), self-hosted in
// /public rather than hotlinked, which is what broke the old plane icon when
// its icons8.com URL 404'd.
const TRANSPORT_ICONS = {
  Air: "/transport-3d/air.png",
  Road: "/transport-3d/road.png",
  Train: "/transport-3d/train.png",
  Water: "/transport-3d/water.png",
};
const TRANSPORT_ICON_SIZE = 34;

// Compass-style bearing: 0deg = north (increasing lat), 90deg = east
// (increasing lng).
function bearingBetween(p0, p1) {
  return (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI;
}

// The plane artwork points north-east, so it rotates freely with a -45deg
// offset. The car/train/ship are side views facing west — rotating those
// would turn them upside down, so they only mirror when heading east.
function transportTransform(mode, bearing) {
  if (mode === "Air") return `rotate(${bearing - 45}deg)`;
  return bearing > 0 && bearing < 180 ? "scaleX(-1)" : "none";
}

function normalizeTransport(mode) {
  const value = String(mode || "").trim().toLowerCase();
  if (/road|ground|car|bus|coach/.test(value)) return "Road";
  if (/rail|train/.test(value)) return "Train";
  if (/water|ship|boat|ferry|cruise|sea/.test(value)) return "Water";
  return "Air";
}

const ROUTE_COLORS = { Air: "#39396D", Road: "#343434", Train: "#343434", Water: "#078A99" };

function TransportLeg({ positions, mode }) {
  const color = ROUTE_COLORS[mode];
  const midIndex = Math.floor(positions.length / 2);
  const midpoint = positions[midIndex];
  const bearing = bearingBetween(positions[midIndex - 1] || midpoint, positions[midIndex + 1] || midpoint);
  return (
    <>
      {mode === "Train" ? (
        <>
          <Polyline positions={positions} pathOptions={{ color, weight: 9, dashArray: "2 10", lineCap: "butt", opacity: 0.9 }} interactive={false} />
          <Polyline positions={positions} pathOptions={{ color, weight: 5 }} interactive={false} />
          <Polyline positions={positions} pathOptions={{ color: "#FFFFFF", weight: 2 }} interactive={false} />
        </>
      ) : (
        <Polyline positions={positions} pathOptions={{ color, weight: mode === "Air" ? 3 : 3.5, dashArray: mode === "Air" ? "1 9" : undefined, lineCap: "round", opacity: 0.9 }} interactive={false} />
      )}
      <Marker position={midpoint} icon={transportIcon(mode, bearing)} keyboard={false} zIndexOffset={500}>
        <Popup>{mode === "Road" ? "Ground transfer" : mode === "Train" ? "Rail transfer" : mode === "Water" ? "Water transfer" : "Air transfer"}</Popup>
      </Marker>
    </>
  );
}
function transportIcon(mode, bearing = 90) {
  const src = TRANSPORT_ICONS[mode] || TRANSPORT_ICONS.Air;
  const size = TRANSPORT_ICON_SIZE;
  return L.divIcon({
    className: "journey-plane-icon",
    html: `<div class="journey-plane-rotate" style="width:${size}px;height:${size}px;transform:${transportTransform(mode, bearing)};filter:drop-shadow(0 3px 3px rgba(0,0,0,0.35));">
      <img src="${src}" alt="" width="${size}" height="${size}" draggable="false" style="display:block;width:${size}px;height:${size}px;" />
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
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

// Builds the sampled curve AND, in parallel, which original leg (marker
// pair index) each sampled point belongs to — so the animated icon can look
// up "which Mode of Transport applies right here" as it moves, not just
// its raw lat/lon.
function buildRoutePath(points) {
  const path = [];
  const legIndexes = [];
  for (let i = 0; i < points.length - 1; i++) {
    const segment = curvedSegment(points[i], points[i + 1], i % 2 === 0 ? 1 : -1);
    const slice = i === 0 ? segment : segment.slice(1);
    path.push(...slice);
    for (let s = 0; s < slice.length; s++) legIndexes.push(i);
  }
  return { path, legIndexes };
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

// `markers[i].mode` is how the traveller arrives AT marker i (from the day
// whose stay is marker i) — so leg (marker i -> marker i+1) is travelled by
// markers[i + 1]'s mode, same logic as "how did we get to today's city".
function AnimatedTransport({ path, legIndexes, markers }) {
  const map = useMap();

  useEffect(() => {
    if (!path || path.length < 2) return undefined;

    let currentMode = normalizeTransport(markers[1]?.mode);
    const marker = L.marker(path[0], {
      icon: transportIcon(currentMode),
      interactive: false,
      zIndexOffset: 1000,
      keyboard: false,
    });
    marker.addTo(map);

    const totalPoints = path.length;
    const durationPerLoop = Math.max(24000, totalPoints * 240);
    let frameId;
    let startTime = null;

    function step(time) {
      if (startTime === null) startTime = time;
      const elapsed = (time - startTime) % durationPerLoop;
      const progress = elapsed / durationPerLoop;

      const idx = progress * (totalPoints - 1);
      const i0 = Math.floor(idx);
      const i1 = Math.min(i0 + 1, totalPoints - 1);
      const t = idx - i0;

      const p0 = path[i0];
      const p1 = path[i1];
      const lat = p0[0] + (p1[0] - p0[0]) * t;
      const lng = p0[1] + (p1[1] - p0[1]) * t;
      marker.setLatLng([lat, lng]);

      // Swap the icon the moment the marker crosses into a new leg, rather
      // than on every frame — setIcon() replaces the DOM node, so calling
      // it unconditionally would also reset the rotation transform below.
      const legIndex = legIndexes[i0] ?? 0;
      const legMode = normalizeTransport(markers[legIndex + 1]?.mode);
      if (legMode !== currentMode) {
        currentMode = legMode;
        marker.setIcon(transportIcon(currentMode));
      }

      const el = marker.getElement();
      const rotor = el?.querySelector(".journey-plane-rotate");
      if (rotor) {
        rotor.style.transform = transportTransform(currentMode, bearingBetween(p0, p1));
      }

      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      marker.remove();
    };
  }, [map, path, legIndexes, markers]);

  return null;
}

export default function JourneyMap({ markers, activeDay }) {
  const markerRefs = useRef({});

  const points = useMemo(() => markers.map((m) => [m.lat, m.lon]), [markers]);
  const { path, legIndexes } = useMemo(() => buildRoutePath(points), [points]);
  const legs = useMemo(() => points.slice(1).map((point, index) => ({
    positions: curvedSegment(points[index], point, index % 2 === 0 ? 1 : -1),
    mode: normalizeTransport(markers[index + 1]?.mode),
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
        {legs.map((leg, index) => <TransportLeg key={index} positions={leg.positions} mode={leg.mode} />)}
        <AnimatedTransport path={path} legIndexes={legIndexes} markers={markers} />
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
