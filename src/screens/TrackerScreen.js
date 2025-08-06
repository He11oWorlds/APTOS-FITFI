
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapStyles.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const currentPositionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const startPositionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endPositionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapAutoCenter({ position, autoFollow }) {
  const map = useMap();
  useEffect(() => {
    if (position && autoFollow) {
      map.flyTo(position, 17, { animate: true });
    }
  }, [position, autoFollow, map]);
  return null;
}

export default function TrackerScreen() {
  const [duration, setDuration] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [accuracy, setAccuracy] = useState(null);

  const user = JSON.parse(localStorage.getItem('fitfi_user'));
  const user_id = user?.user_id || null;
  const quest_id = 1;

  const [path, setPath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const lastPositionRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const mapRef = useRef(null);

  const averagePace = distance > 0 ? (duration / 60) / (distance / 1000) : 0;

  useEffect(() => {
    if (isTracking && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 300);
    }
  }, [isTracking]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateCalories = (speed_m_s, duration_sec, weight_kg = 60) => {
    const speed_kph = speed_m_s * 3.6;
    let met = 2;
    if (speed_kph >= 3 && speed_kph < 5) met = 2.5;
    else if (speed_kph >= 5 && speed_kph < 6.5) met = 3.5;
    else if (speed_kph >= 6.5) met = 5;

    const minutes = duration_sec / 60;
    return (met * 3.5 * weight_kg / 200) * minutes;
  };

  useEffect(() => {
    let intervalId;
    let watchId;

    if (isTracking && !isPaused) {
      intervalId = setInterval(() => {
        setDuration(prev => {
          const next = prev + 1;
          if (speed > 0.5) {
            setCalories(calculateCalories(speed, next));
          }
          return next;
        });
      }, 1000);
    }

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy: posAccuracy } = pos.coords;
          const latlng = [latitude, longitude];
          const timestamp = pos.timestamp;

          setAccuracy(posAccuracy);
          setCurrentPosition(latlng);

          if (!startPosition && path.length === 0) {
            setStartPosition(latlng);
          }

          if (lastPositionRef.current && lastTimestampRef.current) {
            const [prevLat, prevLng] = lastPositionRef.current;
            const timeDiff = (timestamp - lastTimestampRef.current) / 1000;

            if (timeDiff > 0) {
              const segmentDistance = calculateDistance(prevLat, prevLng, latitude, longitude);
              if (segmentDistance > 0.5 && segmentDistance < 50) {
                setDistance(prev => prev + segmentDistance);
                setSpeed(segmentDistance / timeDiff);
                setSteps(prev => prev + Math.floor(segmentDistance / 0.7));
              }
            }
          }

          lastPositionRef.current = latlng;
          lastTimestampRef.current = timestamp;

          if (
            path.length === 0 ||
            calculateDistance(path[path.length - 1][0], path[path.length - 1][1], latitude, longitude) > 2
          ) {
            setPath(prev => [...prev, latlng]);
            console.log("📍 Position update:", latlng);
          }
        },
        (err) => console.error('🧭 Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    return () => {
      clearInterval(intervalId);
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, isPaused, path, startPosition, steps, duration, speed]);

  const handleReset = () => {
    setIsTracking(false);
    setIsPaused(false);
    setDuration(0);
    setSteps(0);
    setDistance(0);
    setSpeed(0);
    setCalories(0);
    setPath([]);
    setCurrentPosition(null);
    setStartPosition(null);
    lastPositionRef.current = null;
    lastTimestampRef.current = null;
  };

  const handleSave = async () => {
    const now = new Date();
    const startedAt = new Date(now.getTime() - duration * 1000);
    const payload = {
      user_id,
      quest_id,
      started_at: startedAt.toISOString(),
      ended_at: now.toISOString(),
      gpx_data: {
        path,
        totalPoints: path.length,
        totalDistance: distance,
        totalSteps: steps,
        totalCalories: calories
      },
      notes: `Session lasted ${duration}s with ${path.length} GPS points, ${steps} steps, and ${distance.toFixed(1)}m distance`,
    };

    try {
      console.log("📦 Payload to backend:", payload);
      await axios.post('http://localhost:3000/track-session', payload);
      alert('✅ Session saved!');
      handleReset();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save session');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <div className="w-full max-w-sm bg-green-100 min-h-screen px-4 pb-32 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 pt-6 text-center">🏃 FitFi Tracker</h1>

        <div className="relative w-40 h-40 mx-auto rounded-full border-[10px] border-green-500 flex items-center justify-center text-2xl font-bold text-green-600 mb-6 shadow-md">
          {steps}
          <span className="absolute bottom-2 text-sm text-gray-500 font-medium">steps</span>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">⏱ Time</div>
            <div className="text-lg font-bold text-gray-700">{formatDuration(duration)}</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">📏 Distance</div>
            <div className="text-lg font-bold text-gray-700">{(distance / 1000).toFixed(2)} km</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xs text-gray-500">🔥 Calories</div>
            <div className="text-lg font-bold text-gray-700">{calories.toFixed(1)} kcal</div>
          </div>
        </div>

        <div className="w-full h-64 rounded-xl overflow-hidden mb-6 relative map-container">
          <MapContainer
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
            center={currentPosition || [14.5995, 120.9842]}
            zoom={17}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            attributionControl={true}
            className="leaflet-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {startPosition && <Marker position={startPosition} icon={startPositionIcon} />}
            {currentPosition && (
              <>
                <Marker position={currentPosition} icon={currentPositionIcon} />
                <MapAutoCenter position={currentPosition} autoFollow={isTracking && !isPaused} />
              </>
            )}
            {path.length > 1 && <Polyline positions={path} color="blue" weight={4} opacity={0.7} />}
            {path.length > 2 && !isTracking && <Marker position={path[path.length - 1]} icon={endPositionIcon} />}
          </MapContainer>

          {accuracy && (
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 px-2 py-1 rounded text-xs">
              GPS: {accuracy < 10 ? '🟢' : accuracy < 30 ? '🟡' : '🔴'} {accuracy.toFixed(0)}m
            </div>
          )}
          {isTracking && !isPaused && (
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 px-2 py-1 rounded text-xs">
              Speed: {(speed * 3.6).toFixed(1)} km/h | Pace: {averagePace.toFixed(1)} min/km
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          {!isTracking && (
            <button onClick={() => { setIsTracking(true); setIsPaused(false); }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-base font-semibold shadow">
              ▶ Start
            </button>
          )}
          {isTracking && !isPaused && (
            <>
              <button onClick={() => setIsPaused(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg text-base font-semibold shadow">
                ⏸ Pause
              </button>
              <button onClick={handleSave}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-base font-semibold shadow">
                ⏹ Stop
              </button>
            </>
          )}
          {isTracking && isPaused && (
            <>
              <button onClick={() => setIsPaused(false)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-base font-semibold shadow">
                ▶ Resume
              </button>
              <button onClick={handleSave}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-base font-semibold shadow">
                ⏹ Stop
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};