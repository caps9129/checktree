
var wkt = new ol.format.WKT();

var vectorSource = new ol.source.Vector({});
var measure_source = new ol.source.Vector();
var source = new ol.source.Vector({});
var format = new ol.format.WKT();

var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;

var rightcountylon = 121.355113;
var rightcountylat = 24.954589;
var zoomsize = parseInt(11);

var defaultLayers = { 'baselayer': 'EMAP', 'overlayer': ['q_zone', 'q_edit', 'tcase_query', 'edit_loc_pid', 'b_town'] } //預設開啟的圖層

if (rightcountylon != parseFloat("120.7")) {
    zoomsize = parseInt(14);
}

var resolutions = new Array(20);
var matrixIds = new Array(20);
for (var z = 0; z < 20; ++z) {
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}

var layers = {
    'osm': { 'title': '開放街圖', 'name': 'osm', 'type': 'base', 'load': false, 'layer': new ol.layer.Tile({ source: new ol.source.OSM() }) },
    'EMAP': {
        'title': '通用版電子地圖(門牌)',
        'name': 'EMAP',
        'type': 'base',
        'load': false,
        'layer': new ol.layer.Tile({
            extent: projectionExtent,
            source: new ol.source.WMTS({
                url: 'http://wmts.nlsc.gov.tw/wmts?',
                layer: 'EMAP',
                matrixSet: 'GoogleMapsCompatible',
                format: 'image/jpeg',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                extent: projectionExtent,
                style: 'default'
            })
        })
    },
    'B5000': {
        'title': '1/5000 基本地形圖',
        'name': 'B5000',
        'type': 'base',
        'load': false,
        'layer': new ol.layer.Tile({
            extent: projectionExtent,
            source: new ol.source.WMTS({
                url: 'http://wmts.nlsc.gov.tw/wmts?',
                layer: 'B5000',
                matrixSet: 'GoogleMapsCompatible',
                format: 'image/jpeg',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                extent: projectionExtent,
                style: 'default'
            })
        })
    },
    'PHOTO2': {
        'title': '正射影像圖',
        'name': 'PHOTO2',
        'type': 'base',
        'load': false,
        'layer': new ol.layer.Tile({
            extent: projectionExtent,
            source: new ol.source.WMTS({
                url: 'http://wmts.nlsc.gov.tw/wmts?',
                layer: 'PHOTO2',
                matrixSet: 'GoogleMapsCompatible',
                format: 'image/jpeg',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                extent: projectionExtent,
                style: 'default'
            })
        })
    },
    'q_zone': {
        'title': '防疫區查詢',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
    },
    'tcase_query': {
        'title': '確診病例分布',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
    },
    'q_edit': {
        'title': '防疫區劃設',
        'type': 'temp',
        'load': false,
        'layer': new ol.layer.Vector({ source: source })
    },
    'edit_loc_pid': {
        'title': '病例點位',
        'type': 'temp',
        'load': false,
        'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
    },
    'measure': {
        'title': '距離量測',
        'type': 'temp',
        'load': true,
        'layer': new ol.layer.Vector({ source: measure_source })
    },
    '30days_100m': {
        'title': '30天確診病例(100m範圍)',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
    },
    '30days_50m': {
        'title': '30天確診病例(50m範圍)',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
    },
    'img_rainfall': {
        'title': '本日累積雨量',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: "http://opendata.cwb.gov.tw/opendata/DIV2/O-A0040-002.jpg",
                imageSize: [400, 400],
                imageExtent: new ol.extent.applyTransform([119.41, 21.86, 123.41, 25.86], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
            }),
            opacity: 0.5
        })
    },
    'BILv': {
        'title': '近兩週布氏級數(綠:1級;黃:2級;紅:大於3級)',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
    },
}


var map = new ol.Map({
    layers: [],
    //'renderer': 'canvas',
    target: 'map',
    view: new ol.View({
        center: ol.proj.transform([rightcountylon, rightcountylat], 'EPSG:4326', 'EPSG:3857'),
        zoom: zoomsize
    })

});

//一開始打開網頁顯示的地圖

map.addLayer(layers[defaultLayers['baselayer']].layer);

$(function () {


    //radio

    $("#tree1").dynatree({
        checkbox: true,
        // Override class name for checkbox icon:
        classNames: { checkbox: "dynatree-radio" },
        selectMode: 1,
        children: treeData,
        onActivate: function (node) {
            $("#echoActive1").text(node.data.title);
        },
        onSelect: function (select, node) {
            // Display list of selected nodes
            $.map(node.tree.getSelectedNodes(), function (node) {
                console.log(node.data.key);
                map.removeLayer(layers[defaultLayers['baselayer']].layer);
                map.addLayer(layers[node.data.key].layer);
                defaultLayers['baselayer'] = node.data.key;
                return node.data.key;
            });
            /*var s = node.tree.getSelectedNodes().join(", ");
            console.log(s);*/



            $("#echoSelection1").text(node.data.key);
        }

    });


    //checkbox 

    $("#tree3").dynatree({
        checkbox: true,
        selectMode: 1,
        children: treeData,
        onSelect: function (select, node) {
            // Get a list of all selected nodes, and convert to a key array:
            var selKeys = $.map(node.tree.getSelectedNodes(), function (node) {

                return node.data.key;
            });

            //console.log(selKeys);



            $.each(selKeys, function (key, value) {
                map.removeLayer(layers[defaultLayers['baselayer']].layer);
                map.addLayer(layers[value].layer);
                defaultLayers['baselayer'] = value;
                console.log(value);
            });


            $("#echoSelection3").text(selKeys.join(", "));

            // Get a list of all selected TOP nodes
            var selRootNodes = node.tree.getSelectedNodes(true);
            // ... and convert to a key array:
            var selRootKeys = $.map(selRootNodes, function (node) {
                return node.data.key;
            });

            $("#echoSelectionRootKeys3").text(selRootKeys.join(", "));
            $("#echoSelectionRoots3").text(selRootNodes.join(", "));
        },
        onDblClick: function (node, event) {
            node.toggleSelect();
        },
        onKeydown: function (node, event) {
            if (event.which == 32) {
                node.toggleSelect();
                return false;
            }
        }
    });


});













