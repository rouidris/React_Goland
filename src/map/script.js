function init() {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/ImageryLayer",
        "esri/widgets/Search",
        "esri/widgets/AreaMeasurement2D",
        "esri/widgets/AreaMeasurement2D/AreaMeasurement2DViewModel",
        "esri/widgets/ElevationProfile",
        "dojo/domReady!"
    ], function(Map, MapView, ImageryLayer, Search, AreaMeasurement2D, ElevationProfile) {
        var map = new Map({
            basemap: "hybrid"
        });

        var view = new MapView({
            container: "map",
            map: map,
            center: [ 85.60324,49.17528],
            zoom: 13
        });


        // Создание и добавление слоя Imagery Hybrid
        var imageryLayer = new ImageryLayer({
            url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
            title: "Imagery Hybrid"
        });
        map.add(imageryLayer);


        // Создание виджета поиска
        var searchWidget = new Search({
            view: view
        });
        // Добавление виджета на карту
        view.ui.add(searchWidget, {
            position: "top-right"
        });

        // Создание виджета измерения площади
        var areaMeasurement = new AreaMeasurement2D({
            view: view
        });

        // Добавление виджета на карту
        view.ui.add(areaMeasurement, "bottom-left");


        areaMeasurement.viewModel.watch("state", function(state) {
            if (state === "measured") {
                var measurement = areaMeasurement.viewModel.measurement;
                if (measurement) {
                    var area = measurement.area;
                    if (area < 10000) {
                        areaStr = area.toFixed(2) + ' м²'; // переводим в квадратные метры и округляем до 2 знаков
                    } else {
                        areaStr = (area / 1000000).toFixed(2) + ' км²'; // переводим в квадратные километры и округляем до 2 знаков
                    }
                    var areaElement = document.getElementById("area");
                    areaElement.textContent = areaStr; // изменяем текст элемента на значение площади
                }
            }
        });




    });

}
