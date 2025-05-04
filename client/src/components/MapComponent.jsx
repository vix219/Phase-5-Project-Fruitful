import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Loader } from "@googlemaps/js-api-loader";
import TreeListComponent from "./TreeListComponent";
import { useUser } from './UserContext'; 
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
  const { user } = useUser(); 
  const userId = user?.id;

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [dialogLocation, setDialogLocation] = useState(null);
  const [listOfTrees, setListOfTrees] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [treeTypeInput, setTreeTypeInput] = useState("");
  const [fruitTypes, setFruitTypes] = useState([]);
  const [selectedFruitTypeId, setSelectedFruitTypeId] = useState("");

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_API_KEY || "",
      version: "weekly",
    });

    loader.load().then(() => {
      setIsMapLoaded(true);
    }).catch(err => {
      console.error("Google Maps failed to load:", err);
    });
  }, []);

  useEffect(() => {
    fetch("/trees", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setListOfTrees(data))
      .catch((err) => console.error("Error fetching trees:", err));

    fetch("/fruit-type", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setFruitTypes(data))
      .catch((err) => console.error("Error fetching fruit types:", err));
  }, []);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedLocation({ lat, lng });
    setDialogLocation({ lat, lng });
    setShowDialog(true);
  };

  const onAddTree = async () => {
    if (!selectedFruitTypeId || !userId || !selectedLocation) {
      alert("Please select a fruit type and ensure you're logged in.");
      return;
    }

    const geoCoder = new window.google.maps.Geocoder();
    geoCoder.geocode({ location: selectedLocation }, async (results, status) => {
      if (status === "OK" && results[0]) {
        const newTree = {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          user_id: userId,
          fruit_type_id: parseInt(selectedFruitTypeId),
          notes: treeTypeInput,
        };

        try {
          const response = await fetch("http://localhost:5555/trees", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newTree),
          });

          const responseData = await response.json();

          if (!response.ok) {
            alert("Failed to add tree: " + JSON.stringify(responseData));
            return;
          }

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

  return isMapLoaded ? (
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
            <InfoWindow position={dialogLocation} onCloseClick={() => setShowDialog(false)}>
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
