
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWlyb24tcm9uZG8iLCJhIjoiY2xodDA1MHlxMGNtMjNlczR1NzNvOG5mOSJ9.t2QGc2zdxSoM4dRG0RU_CA';

const DrawPolygonMap = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [44.5501935, 32.468191],
            zoom: 12,
        });

        const projectID = 25;

        fetchProject(projectID)
            .then((project) => {
                if (project && project.Coordinates) {
                    project.Coordinates.forEach((coordinate) => {
                        new mapboxgl.Marker().setLngLat(coordinate).addTo(map);
                    });
                }
            })
            .catch((error) => {
                console.error('Failed to fetch project:', error, projectID);
            });

        return () => {
            map.remove();
        };
    }, []);

    const fetchProject = async (projectID) => {
        try {
            const response = await fetch(`/project?id=${projectID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                // Преобразование формата координат
                const coordinates = data.project.Coordinates.map(coord => [coord[0], coord[1]]);
                data.project.Coordinates = coordinates;
                console.log(data);
                return data;
            } else {
                throw new Error('Response is not valid JSON');
            }
        } catch (error) {
            throw error;
        }
    };




    return <div ref={mapContainerRef} style={{ height: '700px', width: '1000px' }}></div>;
};

export default DrawPolygonMap;
