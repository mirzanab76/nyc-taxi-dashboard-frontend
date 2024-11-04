// client/src/components/Map/index.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom icon
const createCustomIcon = (color = '#3B82F6') => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: white;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        position: relative;
      ">
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid ${color};
        "></div>
      </div>
    `,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32]
  });
};

const Map = ({ trips, isLoading }) => {
  const defaultCenter = [40.7128, -74.0060]; // NYC coordinates
  const customIcon = createCustomIcon();

  if (isLoading) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Trip Map</h2>
      <div className="h-[500px] relative rounded-lg overflow-hidden">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {trips.map((trip, index) => {
            const position = [
              parseFloat(trip.pickup_latitude),
              parseFloat(trip.pickup_longitude)
            ];
            
            // Skip invalid coordinates
            if (isNaN(position[0]) || isNaN(position[1])) {
              return null;
            }

            return (
              <Marker
                key={index}
                position={position}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold border-b pb-1 mb-2">Trip Details</p>
                    <div className="space-y-1">
                      <p><span className="font-medium">Fare:</span> ${parseFloat(trip.fare_amount).toFixed(2)}</p>
                      <p><span className="font-medium">Distance:</span> {parseFloat(trip.trip_distance).toFixed(1)} miles</p>
                      <p><span className="font-medium">Payment:</span> {trip.payment_type}</p>
                      <p><span className="font-medium">Time:</span> {new Date(trip.pickup_datetime).toLocaleString()}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;