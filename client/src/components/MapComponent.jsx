import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Loader } from "@googlemaps/js-api-loader";
import TreeListComponent from "./TreeListComponent";
import { useUser } from './UserContext';
import "./Map.css";
import FruitType from "./FruitType"; 

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
  const [newTreeAddress, setNewTreeAddress] = useState(""); // Add state for the address

  // New Fruit Inputs
  const [newFruitName, setNewFruitName] = useState("");
  const [newFruitImageUrl, setNewFruitImageUrl] = useState("");
  const [newFruitInfo, setNewFruitInfo] = useState("");
  const [newFruitSeason, setNewFruitSeason] = useState("");

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_API_KEY || "",
      version: "weekly",
    });

    loader
      .load()
      .then(() => setIsMapLoaded(true))
      .catch(err => console.error("Google Maps failed to load:", err));
  }, []);

  useEffect(() => {
    fetch("/trees", { credentials: "include" })
      .then(res => res.json())
      .then(data => setListOfTrees(data))
      .catch(err => console.error("Error fetching trees:", err));

    fetch("/fruit-type", { credentials: "include" })
      .then(res => res.json())
      .then(data => setFruitTypes(data))
      .catch(err => console.error("Error fetching fruit types:", err));
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
        const address = results[0].formatted_address; // Get the address
        setNewTreeAddress(address); // Store the address

        const newTree = {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          user_id: userId,
          fruit_type_id: parseInt(selectedFruitTypeId),
          notes: treeTypeInput,
          address: address, // Add address to the tree data
        };

        try {
          const response = await fetch("/trees", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newTree),
          });
          if (!response.ok) {
            const errorText = await response.text(); // Get the error text response (HTML or JSON)
            console.error("Error adding tree:", errorText);
            alert("Failed to add tree: " + errorText);
            return;
          }

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

  const handleAddFruitType = async () => {
    const newFruit = {
      fruit_name: newFruitName,
      image_url: newFruitImageUrl,
      info: newFruitInfo,
      season: newFruitSeason,
    };

    try {
      const response = await fetch("/fruit-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFruit),
      });

      const result = await response.json();
      if (!response.ok) {
        alert("Error creating fruit type: " + result.error);
      } else {
        setFruitTypes([...fruitTypes, result]);
        setSelectedFruitTypeId(result.id); // Pre-select the new fruit type
        // Clear inputs
        setNewFruitName("");
        setNewFruitImageUrl("");
        setNewFruitInfo("");
        setNewFruitSeason("");
      }
    } catch (err) {
      console.error("Error creating fruit type:", err);
    }
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
              <div style={{ maxWidth: "250px" }}>
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

                <hr style={{ margin: "10px 0" }} />
                <h5>Add New Fruit Type</h5>
                <input
                  className="map-input"
                  placeholder="Fruit Name"
                  value={newFruitName}
                  onChange={(e) => setNewFruitName(e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <input
                  className="map-input"
                  placeholder="Image URL"
                  value={newFruitImageUrl}
                  onChange={(e) => setNewFruitImageUrl(e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <input
                  className="map-input"
                  placeholder="Season"
                  value={newFruitSeason}
                  onChange={(e) => setNewFruitSeason(e.target.value)}
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <textarea
                  className="map-input"
                  placeholder="Fruit Info"
                  value={newFruitInfo}
                  onChange={(e) => setNewFruitInfo(e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                  rows={3}
                />
                <button className="app-button" onClick={handleAddFruitType}>
                  Add New Fruit Type
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

      <div className="fruit-list-container">
        <FruitType />
      </div>

    </>
  ) : (
    <p>Loading Map...</p>
  );
};

export default MapComponent;
