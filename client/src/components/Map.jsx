

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = () => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const defaultCenter = {
    lat: 30.2672, // Austin latitude
    lng: -97.7431, // Austin longitude
  };

  const onMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCfzg5rgZRzJOZ6JdhXDkukRLz0F1WEwvg">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={10}
        center={defaultCenter}
        onClick={onMapClick}
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;


