import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { fetchProject, areamap } from "../http/userApi.jsx";
import { useParams } from "react-router-dom";

mapboxgl.accessToken = 'pk.eyJ1IjoiYWlyb24tcm9uZG8iLCJhIjoiY2xodDA1MHlxMGNtMjNlczR1NzNvOG5mOSJ9.t2QGc2zdxSoM4dRG0RU_CA';

const DrawPolygonMap = () => {
    const mapContainerRef = useRef(null);
    const drawRef = useRef(null);
    const projectIdRef = useRef('');
    const [markerPoints, setMarkerPoints] = useState([]);
    const [allCoordinates, setAllCoordinates] = useState([]);

    const { projectId } = useParams();

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [44.5501935, 32.468191],
            zoom: 12,
        });

        const drawControls = {
            polygon: false,
            trash: true,
        };

        if (projectId) {
            // If projectId is available, display the map for fetching project coordinates
            drawControls.polygon = true;
            drawControls.trash = true;
        }

        map.on('style.load', () => {
            drawRef.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: drawControls,
            });
            map.addControl(drawRef.current);

            if (projectId) {
                // If projectId is available, fetch and display project coordinates
                handleServerResponse(projectId);
            }
        });

        return () => {
            map.remove();
        };
    }, [projectId]);

    const handleServerResponse = async (ProjectId) => {
        try {
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

    const updateArea = () => {
        const data = drawRef.current.getAll();
        const answer = document.getElementById('calculated-area');
        if (data.features.length > 0) {
            const area = turf.area(data);
            const rounded_area = Math.round(area * 100) / 100;
            console.log('Площадь:', rounded_area, 'метров в квадрате');
            const answer = document.getElementById("area_scr");
            answer.innerHTML = rounded_area;

        }
        // Создаем массив для сохранения точек координат
        const allCoordinates = [];
        // Выводим координаты на консоль и сохраняем в массив
        data.features.forEach((feature) => {
            const coordinates = feature.geometry.coordinates[0];
            const coordinatesLength = coordinates.length;
            coordinates.slice(0, coordinatesLength - 1).forEach((coordinate) => {
                allCoordinates.push(coordinate);
            });
        });
        const coor = document.getElementById("area_coor");
        coor.innerHTML = allCoordinates;
        setAllCoordinates(allCoordinates);
        console.log('Все точки координат:', allCoordinates);
    };

    const handleSubmit = async () => {
        try {
            const data = await areamap(allCoordinates); // Отправить данные на сервер с помощью areamap
            console.log(data);
        } catch (e) {
            alert(e.response.data.message);
        }
    };

    return (
        <div>
            {projectId && (
                <div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            ref={projectIdRef}
                            type="text"
                            placeholder="Введите ID проекта"
                        />
                        <button onClick={handleServerResponse}>Получить координаты</button>
                    </div>
                    {markerPoints.length > 0 && (
                        <div>
                            <div ref={mapContainerRef} style={{ height: '700px', width: '1000px' }}></div>
                            <div id="calculated-area" style={{ marginTop: '10px', backgroundColor: '#fff', padding: '10px' }}></div>
                            <button onClick={event => handleSubmit({})}>Сохранить координаты в базу</button>
                        </div>
                    )}
                </div>
            )}
            {!projectId && (
                <div>
                    <div ref={mapContainerRef} style={{ height: "700px", width: "1170px" }}></div>
                    <div id="calculated-area" style={{ marginTop: '10px', backgroundColor: '#fff', padding: '10px' }}></div>
                </div>
            )}
        </div>
    );
};

export default DrawPolygonMap;
