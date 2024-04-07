import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {areamap, fetchProject} from "../http/userApi.jsx";
import {useParams} from "react-router-dom";

mapboxgl.accessToken = 'pk.eyJ1IjoiYWlyb24tcm9uZG8iLCJhIjoiY2xodDA1MHlxMGNtMjNlczR1NzNvOG5mOSJ9.t2QGc2zdxSoM4dRG0RU_CA';

const DrawPolygonMap = () => {
    const mapContainerRef = useRef(null);
    const drawRef = useRef(null);
    const [allCoordinates, setallCoordinates] = useState({})


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [44.5501935, 32.468191],
            zoom: 12
        });

        drawRef.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
            defaultMode: 'draw_polygon'
        });
        map.addControl(drawRef.current);

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        });
        map.addControl(geocoder, 'top-left');

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);

        return () => {
            map.off('draw.create', updateArea);
            map.off('draw.delete', updateArea);
            map.off('draw.update', updateArea);
            drawRef.current = null;
            map.remove();
        };
    }, []);

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
            const coordinatesLength = (coordinates.length - 1);
            coordinates.slice(0, coordinatesLength - 1).forEach((coordinate) => {

                allCoordinates.push(coordinate);



            });
        });
            const coor = document.getElementById("area_coor");
        coor.innerHTML = allCoordinates;
        setallCoordinates(allCoordinates);
        // console.log('Все точки координат:', allCoordinates);

    };

    const handleSubmit = async () => {

        try {
            const data = await areamap(allCoordinates);// Отправить данные на сервер с помощью areamap
            console.log(data);

        } catch (e) {
            alert(e.response.data.message);
        }
    };

    return (
        <div>
            <div ref={mapContainerRef} style={{height: "700px", width: "1170px" }}></div>

            <div id="calculated-area" style={{ marginTop: '10px', backgroundColor: '#fff', padding: '10px' }}></div>
            <button onClick={event => handleSubmit({})}> Сохранить координаты в базу: </button>
        </div>
    );
};

export default DrawPolygonMap;
