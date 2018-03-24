var map = new ol.Map({
    'layers': [
        new ol.layer.Tile({
            style: 'Road',
            source: new ol.source.MapQuest({ layer: 'osm' }),
            name: 'mapquest'
        }),
        new ol.layer.Tile({
            source: new ol.source.OSM(),
            name: 'osm'
        })
    ],
    'renderer': 'canvas',
    'target': 'map',
    'view': new ol.View({
        'projection': 'EPSG:3857',
        'center': [1531627.8847864927, 6632124.286850829],
        'zoom': 4
    })
});

var toggleLayer = function (inputEl) {
    map.getLayers().forEach(function (layer) {
        if (layer.get('name') === inputEl.name)
            layer.setVisible(inputEl.checked);
    });
};