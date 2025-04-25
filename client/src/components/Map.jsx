import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const initialCenter = {
  lat: 30.2672, // Austin latitude
  lng: -97.7431, // Austin longitude
};

const Map = () => {
  const [markerPosition, setMarkerPosition] = useState(initialCenter);
  const [submittedPosition, setSubmittedPosition] = useState(null);
  const mapRef = useRef(null); // mapRef can be useful if you plan to interact with the map directly

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  const handleSubmit = () => {
    setSubmittedPosition(markerPosition);
    alert("Location submitted: " + JSON.stringify(markerPosition));
  };

  return (
    <div className="map">
      <LoadScript
        googleMapsApiKey="AIzaSyCfzg5rgZRzJOZ6JdhXDkukRLz0F1WEwvg"
        libraries={["marker"]}
        version="beta"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition}
          zoom={10}
          onClick={handleMapClick}
          ref={mapRef}
        >
          <AdvancedMarker position={markerPosition} />
        </GoogleMap>
      </LoadScript>
      <button className="map button" onClick={handleSubmit}>Submit Location</button>
      {submittedPosition && (
        <div>
          <h3>Submitted Location:</h3>
          <pre>{JSON.stringify(submittedPosition, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const AdvancedMarker = ({ position }) => {
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.marker) {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position,
      });
    } else {
      console.error("Google Maps or AdvancedMarkerElement is not loaded.");
    }
  }, [position]);

  return null; // No UI is needed for the marker
};

export default Map;
