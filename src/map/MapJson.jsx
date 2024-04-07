import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {fetchProject} from "../http/userApi.jsx";

mapboxgl.accessToken = 'pk.eyJ1IjoiYWlyb24tcm9uZG8iLCJhIjoiY2xodDA1MHlxMGNtMjNlczR1NzNvOG5mOSJ9.t2QGc2zdxSoM4dRG0RU_CA';
const DrawPolygonMap = () => {
    const mapContainerRef = useRef(null);
    const drawRef = useRef(null);
    const projectIdRef = useRef('');
    const [markerPoints, setMarkerPoints] = useState([]);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [44.5501935, 32.468191],
            zoom: 12,
        });

        map.on('style.load', () => {
            drawRef.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: false,
                    trash: true,
                },
            });
            map.addControl(drawRef.current);
        });

        return () => {
            map.remove();
        };
    }, []);

    const handleServerResponse = async () => {
        try {
            const ProjectId = projectIdRef.current.value;
            const coordinates = await fetchProject(ProjectId);
            console.log('Координаты:', coordinates);
            const points = coordinates.map(
                (coordinate) => [coordinate[0], coordinate[1]]
            );
            console.log('markerPoints: ', points);
            setMarkerPoints(points);
        } catch (error) {
            console.error('Ошибка при получении ответа от сервера:', error);
        }
    };

    useEffect(() => {
        if (markerPoints.length > 0) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: markerPoints[0],
                zoom: 12,
            });

            map.on('style.load', () => {
                drawRef.current = new MapboxDraw({
                    displayControlsDefault: false,
                    controls: {
                        polygon: false,
                        trash: true,
                    },
                });
                map.addControl(drawRef.current);


                markerPoints.forEach((point) => {
                    // Create a marker and add it to the map
                    new mapboxgl.Marker().setLngLat(point).addTo(map);
                });

                if (markerPoints.length >= 2) {
                    const lineString = turf.lineString([...markerPoints, markerPoints[0]]);
                    const lineGeoJSON = turf.featureCollection([lineString]);

                    map.addLayer({
                        id: 'line',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: lineGeoJSON,
                        },
                        paint: {
                            'line-color': 'blue',
                            'line-width': 2,
                        },
                    });
                }
            });
        }
    }, [markerPoints]);

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <input ref={projectIdRef} type="text" placeholder="Введите ID проекта" />
                <button onClick={handleServerResponse}>Получить координаты</button>
            </div>
            <div ref={mapContainerRef} style={{ height: '700px', width: '1000px' }}></div>
        </div>
    );
};

export default DrawPolygonMap;

