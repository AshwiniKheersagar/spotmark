import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom icons
import "leaflet/dist/leaflet.css";
import "./Map.css";

// Custom Icon
const customIcon = new L.Icon({
  iconUrl: require("./location.png"), // Add your marker image in assets
  iconSize: [40, 40], // Icon size
  iconAnchor: [20, 40], // Positioning
  popupAnchor: [0, -35], // Popup positioning
});

const Map = (props) => {
  return (
    <MapContainer
      key={`${props.lat}-${props.lng}`} // Forces re-render when lat/lng changes
      center={[props.lat, props.lng]}
      zoom={15}
      className={`map ${props.className}`}
      style={{
        height: "500px", // Increased height for better visibility
        width: "100%",
        borderRadius: "10px", // Rounded corners
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Shadow effect
        ...props.style,
      }}
    >
      {/* OpenStreetMap Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Custom Marker at the given location */}
      <Marker position={[props.lat, props.lng]} icon={customIcon}>
        <Popup className="custom-popup">
          <h3 style={{ margin: "0", color: "#007bff" }}>{props.address}</h3>
          📍 Latitude: {props.lat}
          <br />
          📍 Longitude: {props.lng}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
