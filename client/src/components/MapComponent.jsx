import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
// import AppButton form "./AppButton";

const MapComponent = () => {
    // store the clicked locations
const [selectedLoction, setSelectedLocation] = useState({});
// store list of all locations selected
const [listOfLocations, setListOfLocations] = useState([]);
//store marker locations
//show marker on austin by default
const [markerLocation, setMarkerLocation] = useState({
    lat: 30.2672,
    lng:-97.7431,
});
// store show dialog state to add location
const [showDialog, setShowDialog] = useState(false);
//store dialog location
const [dialogLocation, setDialogLocation] = useState("");

// handleclick on MapComponent
const handleMapClick = (mapProps) => {
    // checks if location is clicked and valid
    if (mapProps.detail.placeID) {
        const lat = mapProps.detail.latLng.lat;
        const lng = mapProps.detail.latLng.lng;
        setShowDialog(true);
        setDialogLocation({ lat, lng });
        setSelectedLocation({ lat, lng });
    } else {
        //show alert message
        alert("Please select the specific location");
    }
}
};

// add locartion to show in list
const onAddLocation = () => {
    //create a google maps Geocode instance
    const geoCoder = new window.google.maps.Geocoder();

    // Reverse geocode the coordinates to get the place name 
    geoCoder.geocode({ location: selectedLocation }, (results, status) => {
        if ( status === "OK") {
            if (results[0]) {
                setListOfLocations([
                    ...listOfLocations,
                    { name: results[0].formatted_adress, location: selectedLocation },
                ]);
                setShowDialog(false);
            }
        } else {
            console.error("Geocoder failed due to: " + status);
        }
    });
};

// displays marker on the map for selected location
const onViewLocaton = (loc) => {
    setMarkerLocation({ lat: loc.lat, lng: loc.lng });
};

//deletes selected location from the list
const onDeleteLocation = (loc) => {
    let updatedList = listOfLocations.filter(
        (l) => loc.lat !== l.location.lat && loc.lng !== l.location.lng
    );
    setListOfLocations(updatedList);
};

//Function to export location list as JSON
const exportLocations = () => {
    const dat = JSON.stringify(lostOfLocations);
    const blog = new Blob([data], {type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "locations.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// Function to import location list from JSON
const importLocations = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const importedData = JSON.parse(e.target.result);
        console.log (
            "importedData",
            importedData,
            "listOfLocations",
            listOfLocations
        );
        setListOfLocations([...listOfLocations, ...importedData]);
    };
    reader.readAsText(file);
};

return (
    <>
    <div className="map-container">
        <GoogleMap
        style={{ borderRadius: "20px" }}
        defaultZoom={13}
        defaultCenter={markerLocation}
        gestureHandling={"greedy"}
        disableDefaulUI
        onClick={(mapProps) => handleMapClick(mapProps)}
        >
            {showDialog && (
                // display a dialog to add click location
                <InfoWindow position={dialogLocation}>
                    <button className="app-button" onClick={onAddLocation}>
                        Add this location
                    </button>
                </InfoWindow>
            )}
            <Marker position={markerLocation} />
        </GoogleMap>
    </div>
    <div className="list-container">
        {/* checks the location of list is not empty */}
        {listOfLocations.length > 0 ? (
            <div>
                <p className="list-heading"> List of Selected Locations</p>
                {/* //display stored locations */}
                {listOfLocations.map((loc) => {
                    return (
                        <div 
                        key={loc.location.lat + loc.location.lng}
                        className="list-item"
                        >
                            <p className="latLng-text"> {loc.name}</p>
                            <div style={{ display: "flex" }}>
                                <AppButton handleClick={() => onViewLocaton(loc.location)}>
                                    View
                                </AppButton>
                                <AppButton 
                                handleClick={() => onDeleteLocation(loc.location)}
                                >
                                    Delete
                                </AppButton>
                            </div>
                            </div>
                    );
                })}
                {/* display export and import options*/}
                <div className="list-footer">
                    <AppButton handleClick={esportLocations}>
                        Export Locations
                    </AppButton>
                    <input
                    className="app-button"
                    type="file"
                    accept=".json"
                    onChange={importLocations}
                    />
                </div>
                </div>
        ) : (
            // display text message to select location
            <div>
                <p className="list-heading">
                    Select a location from map to show in a list or import JSON file
                </p>
                <div className="list-footer">
                    <input
                    className="app-button"
                    type="file"
                    accept=".json"
                    onChange={importLocations}
                    />
            </div>
            </div>
        )}
    </div>
    </>
);

export default MapComponent