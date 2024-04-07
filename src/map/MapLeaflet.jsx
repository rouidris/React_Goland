import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'tiff.js';

const MapComponent = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        // Создание карты
        const map = L.map(mapRef.current).setView([ 51.505, -0.09], 13);

        // Добавление тайлового слоя
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(map);

        // // Добавление изображений на карту
        // const imagePoints = [
        //     { lat: 51.5, lng: -0.09, imageUrl: 'vite_cho_tam/src/assets/pole_mosh.tif' },
        //     // Добавьте здесь другие точки с изображениями
        // ];

        imagePoints.forEach(point => {
            // Создание маркера с изображением
            const markerIcon = L.icon({
                iconUrl: point.imageUrl,
                iconSize: [500, 500], // Размер изображения
            });

            // Добавление маркера на карту
            L.marker([point.lat, point.lng], { icon: markerIcon }).addTo(map);
        });

        return () => {
            // Уничтожение карты при размонтировании компонента
            map.remove();
        };
    }, []);

    return <div ref={mapRef} style={{ width: '1000px', height: '500px' }} />;
};

export default MapComponent;
