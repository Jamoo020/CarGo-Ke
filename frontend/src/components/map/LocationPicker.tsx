import React, { useState, useRef, useEffect } from "react";
import Map from "./Map";
import { loadGoogleMaps } from "../../lib/google";
import { geocodeDevLocation, getDevelopmentLocationMarkers } from "../../lib/devGeocoder";
import styles from "./LocationPicker.module.css";
import { isKenyanCoordinate } from "../../lib/routeLocation";
import { MAP_PROVIDER } from "../../lib/mapProvider";

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  isApproximate?: boolean;
}

interface LocationPickerProps {
  label: string;
  placeholder?: string;
  onSelect: (location: Location | null) => void;
  initialValue?: Location;
  disabled?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  placeholder = "Search location...",
  onSelect,
  initialValue,
  disabled = false,
}) => {
  const [searchInput, setSearchInput] = useState(initialValue?.address || "");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialValue || null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 }); // Nairobi, Kenya
  const [googleMapsAvailable, setGoogleMapsAvailable] = useState<boolean | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(MAP_PROVIDER === "development");
  const [devMessage, setDevMessage] = useState<string | null>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);

  useEffect(() => {
    if (MAP_PROVIDER === "development") {
      setGoogleMapsAvailable(false);
      setIsDevelopmentMode(true);
      return;
    }

    const initAutocomplete = async () => {
      try {
        const result = await loadGoogleMaps();
        
        setGoogleMapsAvailable(result.isAvailable);
        setIsDevelopmentMode(result.isDevelopmentMode);

        if (!result.isAvailable) {
          if (result.isDevelopmentMode) {
            console.log(
              "[LocationPicker] Google Maps not available. Development fallback mode enabled. " +
              "Enter Kenyan city names to select locations."
            );
          }
          return;
        }

        if (result.google?.maps?.places?.AutocompleteService) {
          autocompleteServiceRef.current = new result.google.maps.places.AutocompleteService();
          sessionTokenRef.current = new result.google.maps.places.AutocompleteSessionToken();
          console.log("[LocationPicker] Google Places Autocomplete initialized");
        }
      } catch (error) {
        console.error("[LocationPicker] Failed to initialize autocomplete:", error);
        setGoogleMapsAvailable(false);
      }
    };

    initAutocomplete();
  }, []);

  const handleSearch = async (value: string) => {
    setSearchInput(value);
    setDevMessage(null);
    if (selectedLocation && value.trim() !== selectedLocation.address) {
      setSelectedLocation(null);
      onSelect(null);
    }

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Try Google Places first if available
    if (autocompleteServiceRef.current) {
      try {
        const response = await autocompleteServiceRef.current.getPlacePredictions({
          input: value,
          sessionToken: sessionTokenRef.current,
          componentRestrictions: { country: "ke" }, // Restrict to Kenya
        });

        setSuggestions((response.predictions || []).map((prediction: any) => ({
          ...prediction,
          main_text: prediction.structured_formatting?.main_text || prediction.description,
          secondary_text: prediction.structured_formatting?.secondary_text || "",
        })));
        setShowSuggestions(true);
        return;
      } catch (error) {
        console.error("[LocationPicker] Autocomplete error:", error);
        setSuggestions([]);
      }
    }

    if (MAP_PROVIDER === "development") {
      const devResult = geocodeDevLocation(value);
      
      if (devResult) {
        setSuggestions([
          {
            place_id: "dev_" + value.toLowerCase(),
            main_text: devResult.address,
            secondary_text: `${devResult.latitude.toFixed(4)}, ${devResult.longitude.toFixed(4)}`,
            isDeveloped: true,
            location: devResult,
          },
        ]);
        setShowSuggestions(true);
        setDevMessage("Choose a named fixed reference point for this local test request.");
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setDevMessage(
          `Development mode: "${value}" not recognized. Try: Nairobi, Mombasa, Kisumu, Nakuru, etc.`
        );
      }
      return;
    }

    setSuggestions([]);
    setShowSuggestions(false);
    setDevMessage("Google Maps is selected but unavailable. Configure its browser key or switch to the free development provider.");
  };

  const handleSuggestionClick = async (suggestion: any) => {
    // Handle development geocoder result
    if (suggestion.isDeveloped && suggestion.location) {
      const location: Location = {
        ...suggestion.location,
        isApproximate: false,
      };
      setSelectedLocation(location);
      setSearchInput(location.address);
      setSuggestions([]);
      setShowSuggestions(false);
      setMapCenter({ lat: location.latitude, lng: location.longitude });
      setDevMessage(null);
      onSelect(location);
      console.log(
        "[LocationPicker] Development location selected:",
        location.address,
        `(${location.latitude}, ${location.longitude})`
      );
      return;
    }

    // Handle Google Places result
    try {
      const result = await loadGoogleMaps();
      
      if (!result.isAvailable || !result.google?.maps?.places?.PlacesService) {
        console.warn("[LocationPicker] Cannot get place details: Google Maps unavailable");
        return;
      }

      // Get place details - create a hidden div for PlacesService
      const hiddenDiv = document.createElement("div");
      const placesService = new result.google.maps.places.PlacesService(hiddenDiv);

      placesService.getDetails(
        { placeId: suggestion.place_id, sessionToken: sessionTokenRef.current, fields: ["name", "formatted_address", "geometry"] },
        (place: any, status: string) => {
          if (status === result.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
            if (!isKenyanCoordinate(latitude, longitude)) {
              setDevMessage("Choose a pickup or destination within Kenya.");
              return;
            }
            const location: Location = {
              address: place.formatted_address || place.name || suggestion.main_text,
              latitude,
              longitude,
            };

            setSelectedLocation(location);
            setSearchInput(location.address);
            setSuggestions([]);
            setShowSuggestions(false);
            setMapCenter({ lat: location.latitude, lng: location.longitude });
            setDevMessage(null);
            onSelect(location);

            // Reset session token for next search
            if (result.google?.maps?.places?.AutocompleteSessionToken) {
              sessionTokenRef.current = new result.google.maps.places.AutocompleteSessionToken();
            }
          } else {
            setDevMessage("The selected place could not be verified. Choose another suggestion.");
          }
        }
      );
    } catch (error) {
      console.error("[LocationPicker] Failed to get place details:", error);
      setDevMessage("The selected place could not be verified. Choose another suggestion.");
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!isKenyanCoordinate(latitude, longitude)) {
          setDevMessage("Choose a pickup or destination within Kenya.");
          return;
        }
        setMapCenter({ lat: latitude, lng: longitude });

        // Try to get address from coordinates (reverse geocoding)
        const maps = (window as any).google?.maps;
        if (maps && googleMapsAvailable) {
          const geocoder = new maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any[], status: string) => {
            const address = status === "OK" ? results[0]?.formatted_address : null;
            const location: Location = { address: address || "Pinned location", latitude, longitude };
            setSelectedLocation(location);
            setSearchInput(location.address);
            setDevMessage(null);
            onSelect(location);
          });
        } else {
          // Coordinate-only selections are clearly identified rather than presented as addresses.
          const location: Location = {
            address: "Pinned location",
            latitude,
            longitude,
          };
          setSelectedLocation(location);
          setSearchInput(location.address);
          setDevMessage(null);
          onSelect(location);
        }
      },
      (error) => {
        console.error("[LocationPicker] Geolocation error:", error);
        alert("Failed to get your location");
      }
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!isKenyanCoordinate(lat, lng)) {
      setDevMessage("Choose a pickup or destination within Kenya.");
      return;
    }
    const location: Location = {
      address: "Pinned location",
      latitude: lat,
      longitude: lng,
    };
    setSelectedLocation(location);
    setSearchInput(location.address);
    setMapCenter({ lat, lng });
    setDevMessage(null);
    onSelect(location);
    const maps = (window as any).google?.maps;
    if (maps?.Geocoder) {
      new maps.Geocoder().geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status === "OK" && results[0]?.formatted_address) {
          const resolvedLocation = { ...location, address: results[0].formatted_address };
          setSelectedLocation(resolvedLocation);
          setSearchInput(resolvedLocation.address);
          onSelect(resolvedLocation);
        }
      });
    }
  };

  const handleDevelopmentMarkerClick = (marker: { address?: string; title?: string; lat: number; lng: number }) => {
    const location: Location = {
      address: marker.address ?? marker.title ?? "Selected Kenyan reference point",
      latitude: marker.lat,
      longitude: marker.lng,
    };
    setSelectedLocation(location);
    setSearchInput(location.address);
    setMapCenter({ lat: location.latitude, lng: location.longitude });
    setSuggestions([]);
    setShowSuggestions(false);
    setDevMessage(null);
    onSelect(location);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchInput.trim() && !disabled) {
      e.preventDefault();
      
      // If dev mode and we have a dev suggestion, use it
      if (isDevelopmentMode && suggestions.length > 0 && suggestions[0].isDeveloped) {
        handleSuggestionClick(suggestions[0]);
      } else if (isDevelopmentMode && !suggestions.length) {
        // Try to geocode the input directly
        const devResult = geocodeDevLocation(searchInput);
        if (devResult) {
          handleSuggestionClick({
            isDeveloped: true,
            location: devResult,
          });
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchInput && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={disabled}
          className={styles.locationBtn}
          title="Use current location"
        >
          📍
        </button>
      </div>

      {devMessage && isDevelopmentMode && (
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            backgroundColor: "#f9f3cd",
            padding: "8px",
            borderRadius: "4px",
            marginTop: "4px",
            marginBottom: "4px",
            border: "1px solid #ffc107",
          }}
        >
          ℹ️ {devMessage}
        </div>
      )}
      {selectedLocation?.isApproximate ? (
        <div role="alert" style={{ color: "#8a5200", fontSize: 12, marginTop: 6 }}>
          This location is approximate and cannot be used for a transport request. Select a confirmed point instead.
        </div>
      ) : null}
      {MAP_PROVIDER === "development" ? (
        <p style={{ margin: "6px 0", fontSize: 12, color: "#52635a" }}>
          Free local mode: select a named reference point below or on the coordinate plot. These are test points, not street-level addresses; no Google API is used.
        </p>
      ) : null}

      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, idx) => (
            <li key={suggestion.place_id || idx}>
              <button type="button" className={styles.suggestionButton} onClick={() => handleSuggestionClick(suggestion)}>
                <span className={styles.suggestionText}>
                  {MAP_PROVIDER === "development" ? "Use " : ""}{suggestion.main_text}
                </span>
                  <div className={styles.suggestionSecondary}>{suggestion.secondary_text}</div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Map
        center={mapCenter}
        zoom={15}
        markers={selectedLocation ? [{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }] : []}
        selectableMarkers={MAP_PROVIDER === "development" ? getDevelopmentLocationMarkers() : []}
        onMarkerClick={handleDevelopmentMarkerClick}
        onClick={MAP_PROVIDER === "google" ? handleMapClick : undefined}
        style={{ width: "100%", height: "300px", marginTop: "10px", borderRadius: "4px" }}
      />

      {selectedLocation && (
        <div className={styles.selectedInfo}>
          <strong>Selected:</strong> {selectedLocation.address}
          <br />
          <small>
            Coordinates: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </small>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
