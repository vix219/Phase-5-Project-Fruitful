import React from "react";

const MapButton = ({ handleClick, children }) => {
    return (
        < button onClick={ handleClick } className="map-button">
            {children}
        </button>
    );
};

export default MapButton