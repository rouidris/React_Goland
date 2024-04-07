import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';


function Script() {
    useEffect(() => {
        loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/ImageryLayer",
            "esri/widgets/Search",
            "esri/widgets/AreaMeasurement2D",
            "esri/widgets/AreaMeasurement2D/AreaMeasurement2DViewModel",
            "esri/widgets/ElevationProfile"
        ]).then(([Map, MapView, ImageryLayer, Search, AreaMeasurement2D, ElevationProfile]) => {
            const map = new Map({
                basemap: "hybrid"
            });

            const view = new MapView({
                container: "map",
                map: map,
                center: [85.60324, 49.17528],
                zoom: 13
            });

            // Создание и добавление слоя Imagery Hybrid
            const imageryLayer = new ImageryLayer({
                url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
                title: "Imagery Hybrid"
            });
            map.add(imageryLayer);

            // Создание виджета поиска
            const searchWidget = new Search({
                view: view
            });
            // Добавление виджета на карту
            view.ui.add(searchWidget, {
                position: "top-right"
            });

            // Создание виджета измерения площади
            const areaMeasurement = new AreaMeasurement2D({
                view: view
            });

            // Добавление виджета на карту
            view.ui.add(areaMeasurement, "bottom-left");

            areaMeasurement.viewModel.watch("state", function (state) {
                if (state === "measured") {
                    const measurement = areaMeasurement.viewModel.measurement;
                    let areaStr;
                    const geometry = areaMeasurement.viewModel.measurement.geometry;
                    if (geometry) {
                        const coordinates = geometry.centroid.toJSON();
                        console.log("Longitude: " + coordinates.x + ", Latitude: " + coordinates.y);
                    }
                    if (measurement) {
                        const area = measurement.area;
                        const price = Math.floor(area / 100) * 47;
                        const totalPrice = price + " тг";
                        if (area < 10000) {
                            areaStr = area.toFixed(2) + ' м²';
                        } else {
                            areaStr = (area / 1000000).toFixed(2) + ' км²';
                        }
                        const areaElement = document.getElementById("area_scr");
                        const priceElement = document.getElementById("price_scr");
                        areaElement.innerHTML = areaStr;
                        priceElement.innerHTML = totalPrice;
                    }
                }
            });

            // areaMeasurement.viewModel.watch("state", function (state) {
            //     if (state === "measured") {
            //         const geometry = areaMeasurement.viewModel.measurement.geometry;
            //         if (geometry) {
            //             const coordinates = geometry.centroid.toJSON();
            //             console.log("Longitude: " + coordinates.x + ", Latitude: " + coordinates.y);
            //         }
            //     }
            // });

        });
    }, []);

    return (
        <div>
            <div id="map" style={{ height: "700px", width: "1170px" }}></div>
            <div id="area"></div>
        </div>
    );
}

export default Script;
