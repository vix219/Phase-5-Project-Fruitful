// components/MapComponent.js

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import TreeListComponent from "./TreeListComponent";
import "./Map.css";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "20px",
};

const center = {
  lat: 30.2672,
  lng: -97.7431,
};

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCfzg5rgZRzJOZ6JdhXDkukRLz0F1WEwvg", 
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [dialogLocation, setDialogLocation] = useState(null);
  const [listOfTrees, setListOfTrees] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [treeTypeInput, setTreeTypeInput] = useState("");
  const [fruitTypes, setFruitTypes] = useState([]);
  const [selectedFruitTypeId, setSelectedFruitTypeId] = useState("");

  // Fetch trees and fruit types on load
  useEffect(() => {
    fetch("http://localhost:5555/trees")
      .then((res) => res.json())
      .then((data) => setListOfTrees(data))
      .catch((err) => console.error("Error fetching trees:", err));

    fetch("http://localhost:5555/fruit-type")
      .then((res) => res.json())
      .then((data) => setFruitTypes(data))
      .catch((err) => console.error("Error fetching fruit types:", err));
  }, []);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const location = { lat, lng };

    setSelectedLocation(location);
    setDialogLocation(location);
    setShowDialog(true);
  };

  const onAddTree = async () => {
    if (!selectedFruitTypeId) {
      alert("Please select a fruit type.");
      return;
    }

    const geoCoder = new window.google.maps.Geocoder();
    geoCoder.geocode({ location: selectedLocation }, async (results, status) => {
      if (status === "OK" && results[0]) {
       

        const newTree = {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          user_id: 1, // Replace with user ID
          fruit_type_id: parseInt(selectedFruitTypeId),
          notes: treeTypeInput,
        };

        try {
          const response = await fetch("http://localhost:5555/trees", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTree),
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to add tree: " + JSON.stringify(errorData));
            return;
          }

          const responseData = await response.json();
          setListOfTrees([...listOfTrees, { ...newTree, id: responseData.id }]);
          setShowDialog(false);
          setTreeTypeInput("");
          setSelectedFruitTypeId("");
        } catch (err) {
          console.error("Error adding tree:", err);
        }
      } else {
        alert("Geocoding failed.");
      }
    });
  };

  return isLoaded ? (
    <>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={{
            gestureHandling: "greedy",
            disableDefaultUI: true,
          }}
          onClick={handleMapClick}
        >
          {showDialog && (
            <InfoWindow
              position={dialogLocation}
              onCloseClick={() => setShowDialog(false)}
            >
              <div style={{ maxWidth: "200px" }}>
                <input
                  type="text"
                  className="map-input"
                  placeholder="Add notes"
                  value={treeTypeInput}
                  onChange={(e) => setTreeTypeInput(e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />

                <select
                  className="map-input"
                  value={selectedFruitTypeId}
                  onChange={(e) => setSelectedFruitTypeId(e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                >
                  <option value="">Select fruit type</option>
                  {fruitTypes.map((fruit) => (
                    <option key={fruit.id} value={fruit.id}>
                      {fruit.fruit_name}
                    </option>
                  ))}
                </select>

                <button className="app-button" onClick={onAddTree}>
                  Add this tree
                </button>
              </div>
            </InfoWindow>
          )}

          {listOfTrees.map((tree, idx) => (
            <Marker
              key={idx}
              position={{ lat: tree.lat, lng: tree.lng }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}
        </GoogleMap>
      </div>

      <div className="list-container">
        <TreeListComponent trees={listOfTrees} />
      </div>
    </>
  ) : (
    <p>Loading Map...</p>
  );
};

export default MapComponent;
