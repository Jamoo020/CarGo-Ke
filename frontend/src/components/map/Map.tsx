import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../lib/google";
import { MAP_PROVIDER } from "../../lib/mapProvider";

type MapPoint = { lat: number; lng: number };
type MapMarker = MapPoint & { title?: string; address?: string; label?: string };
type MapRoute = { origin: MapPoint; destination: MapPoint };
type RouteResult = { distanceMeters: number; durationSeconds: number; polyline: MapPoint[]; encodedPolyline: string };

interface MapProps {
  center?: MapPoint;
  zoom?: number;
  markers?: MapMarker[];
  selectableMarkers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  polyline?: MapPoint[];
  route?: MapRoute | null;
  onRouteResult?: (result: RouteResult | null, error?: string) => void;
  onMapReady?: (map: any) => void;
  onClick?: (lat: number, lng: number) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Map: React.FC<MapProps> = ({
  center = { lat: -1.2921, lng: 36.8219 },
  zoom = 13,
  markers = [],
  selectableMarkers = [],
  onMarkerClick,
  polyline,
  route,
  onRouteResult,
  onMapReady,
  onClick,
  style = { width: "100%", height: "400px" },
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const onClickRef = useRef(onClick);
  const onMapReadyRef = useRef(onMapReady);
  const onRouteResultRef = useRef(onRouteResult);
  const onMarkerClickRef = useRef(onMarkerClick);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [googleMapsAvailable, setGoogleMapsAvailable] = useState<boolean | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const [routeMessage, setRouteMessage] = useState<string | null>(null);

  useEffect(() => {
    onClickRef.current = onClick;
    onMapReadyRef.current = onMapReady;
    onRouteResultRef.current = onRouteResult;
    onMarkerClickRef.current = onMarkerClick;
  }, [onClick, onMapReady, onRouteResult, onMarkerClick]);

  useEffect(() => {
    const initMap = async () => {
      if (MAP_PROVIDER === "development") {
        setGoogleMapsAvailable(false);
        setIsDevelopmentMode(true);
        return;
      }
      try {
        const result = await loadGoogleMaps();
        setGoogleMapsAvailable(result.isAvailable);
        setIsDevelopmentMode(result.isDevelopmentMode);

        if (!result.isAvailable) {
          console.warn("[Map] Google Maps not available - explicit development fallback mode");
          return;
        }

        if (!result.google?.maps) throw new Error("Google Maps library not loaded");
        if (!mapRef.current) return;

        const map = new result.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: true,
          fullscreenControl: true,
        });
        mapInstanceRef.current = map;
        setMapInstance(map);
        map.addListener("click", (event: any) => {
          if (event.latLng) onClickRef.current?.(event.latLng.lat(), event.latLng.lng());
        });
        onMapReadyRef.current?.(map);
      } catch (error) {
        console.error("[Map] Failed to load map:", error);
        setGoogleMapsAvailable(false);
      }
    };

    void initMap();
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      polylineRef.current?.setMap(null);
      directionsRendererRef.current?.setMap(null);
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.setCenter(center);
  }, [center, mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;
    const maps = (window as any).google?.maps;
    if (!maps) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = markers.map((data) => new maps.Marker({
      position: { lat: data.lat, lng: data.lng },
      map: mapInstance,
      title: data.title,
      label: data.label,
    }));
  }, [mapInstance, markers]);

  useEffect(() => {
    if (!mapInstance) return;
    const maps = (window as any).google?.maps;
    if (!maps) return;

    polylineRef.current?.setMap(null);
    polylineRef.current = polyline?.length
      ? new maps.Polyline({
        path: polyline.map((point) => ({ lat: point.lat, lng: point.lng })),
        geodesic: true,
        strokeColor: "#4285F4",
        strokeOpacity: 0.7,
        strokeWeight: 4,
        map: mapInstance,
      })
      : null;
  }, [mapInstance, polyline]);

  useEffect(() => {
    onRouteResultRef.current?.(null);
    setRouteMessage(null);
    if (MAP_PROVIDER === "development") return;
    if (!mapInstance || !route) return;
    const maps = (window as any).google?.maps;
    if (!maps?.DirectionsService || !maps?.DirectionsRenderer) {
      const message = "Driving directions are unavailable from Google Maps.";
      setRouteMessage(message);
      onRouteResultRef.current?.(null, message);
      return;
    }

    if (route.origin.lat === route.destination.lat && route.origin.lng === route.destination.lng) {
      const message = "Pickup and destination are the same location.";
      setRouteMessage(message);
      onRouteResultRef.current?.(null, message);
      return;
    }

    let active = true;
    setRouteMessage("Calculating driving route…");
    const renderer = new maps.DirectionsRenderer({ map: mapInstance, suppressMarkers: true });
    directionsRendererRef.current = renderer;
    new maps.DirectionsService().route(
      { origin: route.origin, destination: route.destination, travelMode: maps.TravelMode.DRIVING },
      (result: any, status: string) => {
        const leg = result?.routes?.[0]?.legs?.[0];
        const path = result?.routes?.[0]?.overview_path;
        const encodedPolyline = result?.routes?.[0]?.overview_polyline?.points;
        if (status !== "OK" || !leg?.distance?.value || !leg?.duration?.value || !path?.length || !encodedPolyline) {
          const message = status === "ZERO_RESULTS"
            ? "No driving route could be found for these locations."
            : `Driving route could not be calculated (${status}).`;
          if (active) {
            setRouteMessage(message);
            onRouteResultRef.current?.(null, message);
          }
          return;
        }

        if (!active) return;
        renderer.setDirections(result);
        setRouteMessage(null);
        onRouteResultRef.current?.({
          distanceMeters: leg.distance.value,
          durationSeconds: leg.duration.value,
          polyline: path.map((point: any) => ({ lat: point.lat(), lng: point.lng() })),
          encodedPolyline,
        });
      },
    );

    return () => {
      active = false;
      renderer.setMap(null);
      if (directionsRendererRef.current === renderer) directionsRendererRef.current = null;
    };
  }, [mapInstance, route?.origin.lat, route?.origin.lng, route?.destination.lat, route?.destination.lng]);

  if (MAP_PROVIDER === "development") {
    const plot = (point: MapPoint) => ({
      x: 6 + ((point.lng - 33.5) / 9) * 88,
      y: 8 + ((5.2 - point.lat) / 10.4) * 84,
    });
    const plotMarkerMap = new globalThis.Map<string, MapMarker>();
    selectableMarkers.forEach((marker) => plotMarkerMap.set(`${marker.lat}:${marker.lng}`, marker));
    markers.forEach((marker) => plotMarkerMap.set(`${marker.lat}:${marker.lng}`, marker));
    const plotMarkers = [...plotMarkerMap.values()];
    const plottedRoute = route
      ? { origin: plot(route.origin), destination: plot(route.destination) }
      : null;

    return (
      <div className={className} style={{ position: "relative", ...style }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="group"
          aria-label="Free development coordinate plot within the Kenya location bounds"
          onClick={(event) => {
            if (!onClick || event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            const longitude = 33.5 + ((event.clientX - bounds.left) / bounds.width) * 9;
            const latitude = 5.2 - ((event.clientY - bounds.top) / bounds.height) * 10.4;
            onClick(latitude, longitude);
          }}
          style={{ display: "block", width: "100%", height: "100%", background: "#e9f2ec", borderRadius: style.borderRadius, cursor: onClick ? "crosshair" : "default" }}
        >
          {[20, 40, 60, 80].map((position) => (
            <React.Fragment key={position}>
              <line x1={position} y1="0" x2={position} y2="100" stroke="#c8d9cf" strokeWidth="0.3" />
              <line x1="0" y1={position} x2="100" y2={position} stroke="#c8d9cf" strokeWidth="0.3" />
            </React.Fragment>
          ))}
          {plottedRoute ? (
            <line
              x1={plottedRoute.origin.x}
              y1={plottedRoute.origin.y}
              x2={plottedRoute.destination.x}
              y2={plottedRoute.destination.y}
              stroke="#526f9c"
              strokeWidth="0.9"
              strokeDasharray="2 1.4"
            />
          ) : null}
          {plotMarkers.map((marker, index) => {
            const point = plot(marker);
            const isSelectable = selectableMarkers.some((candidate) =>
              candidate.lat === marker.lat && candidate.lng === marker.lng,
            );
            const selectedMarker = markers.some((candidate) =>
              candidate.lat === marker.lat && candidate.lng === marker.lng,
            );
            const label = selectedMarker
              ? markers.find((candidate) => candidate.lat === marker.lat && candidate.lng === marker.lng)?.label
              : marker.label;
            return (
              <g
                key={`${marker.lat}:${marker.lng}:${index}`}
                role={isSelectable && onMarkerClick ? "button" : undefined}
                tabIndex={isSelectable && onMarkerClick ? 0 : undefined}
                aria-label={isSelectable ? `Select ${marker.address ?? marker.title ?? "location"}` : undefined}
                onClick={() => {
                  if (isSelectable) onMarkerClick?.(marker);
                }}
                onKeyDown={(event) => {
                  if (isSelectable && onMarkerClick && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onMarkerClick(marker);
                  }
                }}
                style={{ cursor: isSelectable && onMarkerClick ? "pointer" : "default" }}
              >
                <circle cx={point.x} cy={point.y} r={selectedMarker ? 2.2 : 1.7} fill={selectedMarker ? "#174ea6" : "#c44832"} stroke="white" strokeWidth="0.6" />
                {label ? <text x={point.x} y={point.y + 0.45} textAnchor="middle" fill="white" fontSize="1.7" fontWeight="bold">{label}</text> : null}
              </g>
            );
          })}
          <text x="5" y="96" fill="#385147" fontSize="2.6">33.5°E</text>
          <text x="78" y="96" fill="#385147" fontSize="2.6">42.5°E</text>
          <text x="2" y="6" fill="#385147" fontSize="2.6">5.2°N</text>
          <text x="2" y="93" fill="#385147" fontSize="2.6">5.2°S</text>
        </svg>
        <div role="status" style={{ position: "absolute", left: 12, right: 12, bottom: 12, padding: "8px 12px", background: "#ffffffed", borderRadius: 8, boxShadow: "0 1px 5px #0003", fontSize: 12 }}>
          Free local development coordinate plot · not a geographic basemap. Any dashed connector is illustrative; road routes, distance and duration are not calculated.
        </div>
      </div>
    );
  }

  if (googleMapsAvailable === false) {
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "4px",
          color: "#666",
          fontSize: "14px",
          flexDirection: "column",
          gap: "8px",
        }}
        className={className}
      >
        <div style={{ textAlign: "center" }}>
          {isDevelopmentMode ? (
            <>
              <div style={{ fontWeight: "600" }}>Development fallback — map unavailable</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Configure VITE_GOOGLE_MAPS_BROWSER_KEY to load the interactive map and driving routes. This fallback does not calculate routes.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: "600" }}>Google Maps Unavailable</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Map preview and driving routes are unavailable. Location details remain visible separately.
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", ...style }} className={className}>
      <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: style.borderRadius }} />
      {routeMessage ? (
        <div role="status" style={{ position: "absolute", left: 12, bottom: 12, padding: "8px 12px", background: "#fff", borderRadius: 8, boxShadow: "0 1px 5px #0003", fontSize: 13 }}>
          {routeMessage}
        </div>
      ) : null}
    </div>
  );
};

export default Map;
