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

// icons8 "3D Fluency airplane" — despite the glossy 3D shading, the
// silhouette itself is top-down with the nose resting at due west (pointing
// left), not north. AnimatedPlane's rotation adds a +90deg baseline offset
// to compensate, so a computed bearing of 0 (north) still displays nose-up.
const PLANE_IMG_URL = "https://img.icons8.com/3d-fluency/94/airplane-1.png";

const PLANE_ICON = L.divIcon({
  className: "journey-plane-icon",
  html: `<div class="journey-plane-rotate" style="width:32px;height:32px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4));">
    <img src="${PLANE_IMG_URL}" alt="" width="32" height="32" style="display:block;width:100%;height:100%;" />
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

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

function buildRoutePath(points) {
  const path = [];
  for (let i = 0; i < points.length - 1; i++) {
    const segment = curvedSegment(points[i], points[i + 1], i % 2 === 0 ? 1 : -1);
    path.push(...(i === 0 ? segment : segment.slice(1)));
  }
  return path;
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

function AnimatedPlane({ path }) {
  const map = useMap();

  useEffect(() => {
    if (!path || path.length < 2) return undefined;

    const marker = L.marker(path[0], {
      icon: PLANE_ICON,
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

      // Compass-style bearing: 0deg = north (increasing lat), 90deg = east
      // (increasing lng). PLANE_ICON's artwork rests nose-west (-90deg), so
      // +90 brings it to nose-north before the bearing rotation is applied.
      const bearing = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI;
      const el = marker.getElement();
      const rotor = el?.querySelector(".journey-plane-rotate");
      if (rotor) {
        rotor.style.transform = `rotate(${bearing}deg)`;
      }

      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      marker.remove();
    };
  }, [map, path]);

  return null;
}

export default function JourneyMap({ markers, activeDay }) {
  const markerRefs = useRef({});

  const points = useMemo(() => markers.map((m) => [m.lat, m.lon]), [markers]);
  const path = useMemo(() => buildRoutePath(points), [points]);

  useEffect(() => {
    if (activeDay == null) return;
    const marker = markers.find((m) => m.days.some((d) => d.day === activeDay));
    if (!marker) return;
    const ref = markerRefs.current[marker.id];
    ref?.openPopup();
  }, [activeDay, markers]);

  return (
    <>
      <style jsx global>{`
        .journey-route-ant {
          stroke-dasharray: 10 8;
          animation: journey-route-dash 1.1s linear infinite;
        }
        @keyframes journey-route-dash {
          to {
            stroke-dashoffset: -18;
          }
        }
      `}</style>
      <MapContainer
        center={points[0] || [20, 0]}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />
        <FitToMarkers positions={points} />
        <Polyline
          positions={path}
          pathOptions={{
            color: "#1A1A1A",
            weight: 2,
            className: "journey-route-ant",
          }}
          interactive={false}
        />
        <AnimatedPlane path={path} />
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
