var wkt = new ol.format.WKT();

var vectorSource = new ol.source.Vector({});
var source = new ol.source.Vector({});
var format = new ol.format.WKT();

//var geojsonLayer=null,geojsonLayerb7=null,geojsonLayerb7_14=null;
var featuresb7 = null, featuresb8_14 = null, featuresb15_30 = null;
var clustersb7 = null, clustersb8_14 = null, clustersb15_30 = null;
var clustersC1 = null, clustersC2 = null, clusters_ot = null;
var casesYearly = null;
var measure_source = new ol.source.Vector();
var rich_buffer_source = new ol.source.Vector();
var vectorSourcebsa = new ol.source.Vector();
var vectorSourcebsa2 = new ol.source.Vector();
var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var defaultLayers = { 'baselayer': 'EMAP', 'overlayer': ['q_zone', 'q_edit', 'tcase_query', 'edit_loc_pid', 'b_town'] } //預設開啟的圖層
var base_uncheck, over_uncheck;
var cluster_info = null;
var case_buffer_source = new ol.source.Vector();

var smart_detection_source = new ol.source.Vector();
var routesource = new ol.source.Vector();


var countylon = $('#CountylocationLon').text();
var countylat = $('#CountylocationLat').text();

var rightcountylon = parseFloat(countylon);
var rightcountylat = parseFloat(countylat);
var zoomsize = parseInt(11);
if (rightcountylon != parseFloat("120.7")) {
    zoomsize = parseInt(14);
}

var bufsize = 100;	//for rich information

Highcharts.theme = {
    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    chart: {
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
                [0, '#2a2a2b'],
                [1, '#3e3e40']
            ]
        },
        style: {
            fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#606063'
    },
    title: {
        style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '20px'
        }
    },
    subtitle: {
        style: {
            color: '#E0E0E3',
            textTransform: 'uppercase'
        }
    },
    xAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
            style: {
                color: '#A0A0A3'

            }
        }
    },
    yAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#E0E0E3'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#707073'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
                color: '#CCC'
            },
            states: {
                hover: {
                    fill: '#707073',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#000003',
                    stroke: '#000000',
                    style: {
                        color: 'white'
                    }
                }
            }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
        },
        labelStyle: {
            color: 'silver'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },

    scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
    },

    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
};

Highcharts.setOptions(Highcharts.theme);



// Generate and array of resolutions and matrixIds for this WMTS
var resolutions = new Array(20);
var matrixIds = new Array(20);
for (var z = 0; z < 20; ++z) {
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}
var image = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 1 })
});
var styles = {
    'q_zone': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(240, 100, 100, 1)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(227, 74, 51, 0.7)'
        })
    })],
    'q_zone_highlight': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(240, 100, 100, 1)',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(253, 187, 132, 0.7)'
        })
    })],
    'tcase_query': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'rgba(227, 74, 51, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(227, 74, 51, 0.7)',
                width: 3
            })
        })
    })],
    'tcase_query_highlight': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: 'green'
            }),
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 3.5
            })
        })
    })],
    /*    'u_conn': [new ol.style.Style({
           stroke: new ol.style.Stroke({
               color: '#0047c0',
               width: 1.5
           })
       })],
      's_manhole': [new ol.style.Style({
           image: new ol.style.Circle({
               radius: 3,
               fill: new ol.style.Fill({
                   color: '#fb9038'
               }),
               stroke: new ol.style.Stroke({
                   color: '#676666',
                   width: 1.0
               })
           })
       })],
       's_facility': [new ol.style.Style({
           image: new ol.style.Circle({
               radius: 3,
               fill: new ol.style.Fill({
                   color: '#29a01e'
               }),
               stroke: new ol.style.Stroke({
                   color: '#676666',
                   width: 1.0
               })
           })
       })],
       's_line': [new ol.style.Style({
           stroke: new ol.style.Stroke({
               color: '#c900d6',
               width: 1.5
           })
       })],*/
    /*    '104_local': [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#4ef20d'
                }),
                stroke: new ol.style.Stroke({
                    color: '#f2240d',
                    width: 2.0
                })
            })
        })],
        '104_foreign': [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#4ef20d'
                }),
                stroke: new ol.style.Stroke({
                    color: '#f2240d',
                    width: 2.0
                })
            })
        })],
        '105_local': [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#f0f20d'
                }),
                stroke: new ol.style.Stroke({
                    color: '#f2240d',
                    width: 2.0
                })
            })
        })],
        '105_foreign': [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#f0f20d'
                }),
                stroke: new ol.style.Stroke({
                    color: '#f2240d',
                    width: 2.0
                })
            })
        })],
        '105_allcases': [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#f0f20d'
                }),
                stroke: new ol.style.Stroke({
                    color: '#f2240d',
                    width: 2.0
                })
            })
        })],
        '106_allcases': [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#0DF0F2'
                }),
                stroke: new ol.style.Stroke({
                    color: '#f2240d',
                    width: 2.0
                })
            })
        })],*/
    '30days_100m': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            lineDash: [2, 8],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(227, 74, 51, 0.1)'
        })
    })],
    '30days_50m': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            lineDash: [2, 8],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(227, 74, 51, 0.1)'
        })
    })],
    'b_village': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f5955b',
            width: 2
        })
    })],
    'b_town': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 4
        })
    })],
    'measure': [new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })],
    /*   'ovitrap106': [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#fb9038'
                }),
                stroke: new ol.style.Stroke({
                    color: '#676666',
                    width: 2.0
                })
            })
        })], */
};
var layers = {
    'osm': { 'title': '開放街圖', 'type': 'base', 'load': false, 'layer': new ol.layer.Tile({ source: new ol.source.OSM() }) },
    'EMAP': {
        'title': '通用版電子地圖(門牌)',
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
    /*    'cland': {
            'title': '縣市有土地',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Tile({
                extent: projectionExtent,
                source: new ol.source.XYZ({
                  url: 'http://140.109.161.37/fs/pingtung/file-exists.php?img=county_land-png-{z}-{x}-{y}'
                })
            })
        },*/
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
    /*    'u_conn': {
            'title': '用戶接管',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/u_conn_e3857.geojson',
                })
            })
        },
        's_manhole': {
            'title': '汙水人孔',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/sewage_manhole_e3857.geojson',
                })
            })
        },
        's_facility': {
            'title': '汙水設施',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/sewage_facility_e3857.geojson',
                })
            })
        },
        's_line': {
            'title': '汙水幹線',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/sewage_line_e3857.geojson',
                })
            })
        },*/
    'flooding': {
        'title': '歷年易淹水範圍',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.KML(),
                url: './data/flooding.kml',
            })
        })
    },
    /*    '104_local': {
            'title': '104年本土案例',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/currentAddr_e3857.geojson',
                })
            })
        },
        '104_foreign': {
            'title': '104年境外移入案例',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/104_foreign_3857.geojson',
                })
            })
        },
        '105_local': {
            'title': '105年本土案例',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/105_local.geojson',
                })
            })
        },
        '105_foreign': {
            'title': '105年境外移入案例',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/105_foreign_3857.geojson',
                })
            })
        },
        '104_08_clean': {
            'title': '104年08月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/104_08_clean.kml',
                })
            })
        },
        '104_09_clean': {
            'title': '104年09月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/104_09_clean.kml',
                })
            })
        },
        '104_10_clean': {
            'title': '104年10月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/104_10_clean.kml',
                })
            })
        },
        '104_11_clean': {
            'title': '104年11月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/104_11_clean.kml',
                })
            })
        },
        '104_12_clean': {
            'title': '104年12月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/104_12_clean.kml',
                })
            })
        },
        '105_01_clean': {
            'title': '105年01月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/105_01_clean.kml',
                })
            })
        },
        '105_02_clean': {
            'title': '105年02月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/105_02_clean.kml',
                })
            })
        },
        '105_03_clean': {
            'title': '105年03月孳清範圍',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.KML(),
                    url: './data/105_03_clean.kml',
                })
            })
        },
        '105_allcases': {
            'title': '105年確診病例',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        },
        '106_allcases': {
            'title': '106年確診病例',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        },*/
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
    'b_village': {
        'title': '村里界',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/ntpc_village_e3857.geojson',
            })
        })
    },
    'b_town': {
        'title': '鄉鎮界',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/ntpc_town_e3857.geojson',
            })
        })
    },
    'BILv': {
        'title': '近兩週布氏級數(綠:1級;黃:2級;紅:大於3級)',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
    },
    'Fspouse': {
        'title': '106年外配統計',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/spouse_e3857.geojson',
            })
        })
    },
    'CurAddr106': {
        'title': '106年本土個案居住地',
        'type': 'overlay',
        'load': false,
        //'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/currentAddr_e3857.geojson',
            })
        })
    },
    'WorkAddr106': {
        'title': '106年本土個案工作地',
        'type': 'overlay',
        'load': false,
        //'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/workAddr_e3857.geojson',
            })
        })
    },
    'Hospital106': {
        'title': '106年本土個案就醫院所',
        'type': 'overlay',
        'load': false,
        //'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/hospital_e3857.geojson',
            })
        })
    },
    'Highrisk106': {
        'title': '106年高危點',
        'type': 'overlay',
        'load': false,
        //'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/highrisk_20171127_e3857.geojson',
            })
        })
    },
    'Fcompany': {
        'title': '106年外勞人數統計',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/foreign_e3857.geojson',
            })
        })
    },
    'clean106': {
        'title': '106年孳清噴藥區域',
        'type': 'overlay',
        'load': false,
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/clean_final_e3857.geojson',
            })
        })
    },
    /*    'rhospital': {
            'title': '快篩醫院',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: './data/hospital_e3857.geojson',
                })
            })
        },
        'regulation': {
            'title': '列管地址(紅:列管;綠:解除)',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        },
        'ovitrip': {
            'title': '誘卵器',
            'type': 'overlay',
            'load':false,
            'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        },*/
    'ovitrap106': {
        'title': '106年誘卵器',
        'type': 'overlay',
        'load': false,
        //'layer': new ol.layer.Vector({ source: new ol.source.Vector({}) })
        'layer': new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/ovitrap_1114_e3857.geojson',
            })
        })
    },
}
var view = new ol.View({
    center: ol.proj.transform([rightcountylon, rightcountylat], 'EPSG:4326', 'EPSG:3857'),
    zoom: zoomsize
});

var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine({ className: 'ol-scale-line', target: document.getElementById('scale-line') })
    ]),
    layers: [],
    target: 'map',
    view: view
});

var lineDraw = new ol.interaction.Draw({
    source: source,
    type: 'Polygon'
});
var select = new ol.interaction.Select();
var modify = new ol.interaction.Modify({
    features: select.getFeatures(),
    deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
    }
});
var img_rainfall;
function initLayers() {
    //Object.keys()回傳layers各元素對應的字串
    for (i = 0; i < Object.keys(layers).length; i++) {

        var layer_count = layers[Object.keys(layers)[i]]

        //如果type為base就加入基本圖層清單列表中
        if (layer_count.type == 'base') {

            //基本圖層清單列表
            $('<div class="radio"><label><input type="radio" name="baselayer" id=' + Object.keys(layers)[i] + ' value="' + Object.keys(layers)[i] + '">' + layer_count.title + '</label></div>').appendTo("#baselayerlist")

            //如果type為overlay就加入套疊圖層清單列表中    
        } else if (layer_count.type == 'overlay') {

            //套疊圖層清單列表
            $('<div class="checkbox"><label><input type="checkbox" name="overlayer" value="' + Object.keys(layers)[i] + '">' + layer_count.title + '</label></div>').appendTo("#overlayerlist")
            $("input[value=" + defaultLayers['overlayer'][i] + "]").prop("checked", false);
            layer_count.layer.setZIndex(1);
            if (styleFunction(Object.keys(layers)[i])) {
                layer_count.layer.setStyle(styleFunction(Object.keys(layers)[i]));
            }
            /*layer_count.layer.setVisible(false);
            map.addLayer(layer_count.layer);*/
        } else if (layer_count.type == 'temp') {
            /*if(styleFunction(Object.keys(layers)[i])){
                layer_count.layer.setStyle(styleFunction(Object.keys(layers)[i]));    
            }*/
            layer_count.layer.setMap(map);
        }
    }

    //一開始打開網頁顯示的地圖
    map.addLayer(layers[defaultLayers['baselayer']].layer);
    $("input[id=" + defaultLayers['baselayer'] + "]").prop("checked", true);

    base_uncheck = defaultLayers['baselayer']

    for (var i = 0; i < defaultLayers['overlayer'].length; i++) {
        $("input[value=" + defaultLayers['overlayer'][i] + "]").prop("checked", true);
        map.addLayer(layers[defaultLayers['overlayer'][i]].layer);
        layers[defaultLayers['overlayer'][i]].load = true;
        layers[defaultLayers['overlayer'][i]].layer.setVisible(true);
    };

    //var popup = new ol.Overlay({
    //  element: container,
    //  positioning: 'bottom-center',
    //  stopEvent: false
    //});
    //	drawCaseYear("2016");
    //	drawMosIdx();
}

layers['Fspouse'].layer.setStyle(myStyleFunctionLev);
layers['CurAddr106'].layer.setStyle(myStyleFunction1);
layers['WorkAddr106'].layer.setStyle(myStyleFunction2);
layers['Hospital106'].layer.setStyle(myStyleFunction3);
layers['Fcompany'].layer.setStyle(myStyleFunctionLevPoint);
layers['clean106'].layer.setStyle(myStyleFunctionClean);
layers['Highrisk106'].layer.setStyle(myStyleFunctionHighrisk);
layers['ovitrap106'].layer.setStyle(myStyleFunctionOviLev);


var myStyles = {
    cur1: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: '#e41a1c'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 3.0
            })
        })
    }),
    cur2: new ol.style.Style({
        image: new ol.style.RegularShape({
            fill: new ol.style.Fill({
                color: '#e41a1c'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 3.0
            }),
            points: 3,
            radius: 11,
            rotation: 0,
            angle: 0
        })
    }),
    work1: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: '#377eb8'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 3.0
            })
        })
    }),
    work2: new ol.style.Style({
        image: new ol.style.RegularShape({
            fill: new ol.style.Fill({
                color: '#377eb8'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 3.0
            }),
            points: 3,
            radius: 11,
            rotation: 0,
            angle: 0
        })
    }),
    hosp1: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: '#4daf4a'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 3.0
            })
        })
    }),
    hosp2: new ol.style.Style({
        image: new ol.style.RegularShape({
            fill: new ol.style.Fill({
                color: '#4daf4a'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 3.0
            }),
            points: 3,
            radius: 11,
            rotation: 0,
            angle: 0
        })
    }),
    lev1: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#edf8fb'
        }),
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 3.0
        })
    }),
    lev2: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#b3cde3'
        }),
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 3.0
        })
    }),
    lev3: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#8c96c6'
        }),
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 3.0
        })
    }),
    lev4: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#8856a7'
        }),
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 3.0
        })
    }),
    lev5: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#810f7c'
        }),
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 3.0
        })
    }),
    cirlev1: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#9ebcda'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    cirlev2: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#8c96c6'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    cirlev3: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#8c6bb1'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    cirlev4: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#88419d'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    cirlev5: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#810f7c'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    c1: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#f1a340'
        }),
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 3.0
        })
    }),
    c2: new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#998ec3'
        }),
        stroke: new ol.style.Stroke({
            color: '#159ff2',
            width: 3.0
        })
    }),
    hr1: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: '#b11eab'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 3.0
            })
        })
    }),
    ovilev1: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#ffffb2'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    ovilev2: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#fecc5c'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    ovilev3: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#fd8d3c'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    ovilev4: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#f03b20'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
    ovilev5: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#bd0026'
            }),
            stroke: new ol.style.Stroke({
                color: '#f7f7f7',
                width: 1.0
            })
        })
    }),
};

function myStyleFunction1(feature) {
    if (feature.get('caseNo') == 1) {
        return myStyles.cur1;
    } else {
        return myStyles.cur2;
    }
}
function myStyleFunction2(feature) {
    if (feature.get('caseNo') == 1) {
        return myStyles.work1;
    } else {
        return myStyles.work2;
    }
}
function myStyleFunction3(feature) {
    if (feature.get('caseNo') == 1) {
        return myStyles.hosp1;
    } else {
        return myStyles.hosp2;
    }
}
function myStyleFunctionLev(feature) {
    if (feature.get('總計') > 0 && feature.get('總計') <= 2500) {
        return myStyles.lev1;
    } else if (feature.get('總計') > 2500 && feature.get('總計') <= 5000) {
        return myStyles.lev2;
    } else if (feature.get('總計') > 5000 && feature.get('總計') <= 7500) {
        return myStyles.lev3;
    } else if (feature.get('總計') > 7500 && feature.get('總計') <= 10000) {
        return myStyles.lev4;
    } else {
        return myStyles.lev5;
    }
}
function myStyleFunctionLevPoint(feature) {
    if (feature.get('sum') > 0 && feature.get('sum') <= 4) {
        return myStyles.cirlev1;
    } else if (feature.get('sum') > 4 && feature.get('sum') <= 17) {
        return myStyles.cirlev2;
    } else if (feature.get('sum') > 17 && feature.get('sum') <= 56) {
        return myStyles.cirlev3;
    } else if (feature.get('sum') > 56 && feature.get('sum') <= 200) {
        return myStyles.cirlev4;
    } else {
        return myStyles.cirlev5;
    }
}
function myStyleFunctionClean(feature) {
    if (feature.get('processID') == 1) {
        return myStyles.c1;
    } else {
        return myStyles.c2;
    }
}
function myStyleFunctionHighrisk(feature) {
    return myStyles.hr1;
}
function myStyleFunctionOviLev(feature) {

    val = feature.get('egg_w40');
    if (feature.get('egg_w41') > val)
        val = feature.get('egg_w42');
    if (feature.get('egg_w42') > val)
        val = feature.get('egg_w42');
    if (feature.get('egg_w43') > val)
        val = feature.get('egg_w43');
    if (feature.get('egg_w44') > val)
        val = feature.get('egg_w44');
    if (feature.get('egg_w45') > val)
        val = feature.get('egg_w45');

    if (val > 0 && val <= 50) {
        return myStyles.ovilev2;
    } else if (val > 50 && val <= 100) {
        return myStyles.ovilev3;
    } else if (val > 100 && val <= 150) {
        return myStyles.ovilev4;
    } else if (val > 150) {
        return myStyles.ovilev5;
    } else {
        return myStyles.ovilev1;
    }
}

function addLegend106() {
    $("#legend1").show();
    $("#legend2").show();
}
function clrLegend106() {
    $("#legend1").hide();
    $("#legend2").hide();
}

function styleFunction(stylename) {
    if (styles[stylename]) {
        return styles[stylename];
    } else {
        return false
    }
};

function zoomMap(layername) {
    if (layers[layername].layer.getSource().getFeatures().length > 1) {
        var view_extent = new ol.geom.Polygon.fromExtent(layers[layername].layer.getSource().getExtent())
        var size = (map.getSize());
        view.fit(view_extent, size, { padding: [170, 50, 30, 150] })
    } else if (layers[layername].layer.getSource().getFeatures().length == 1) {
        map.getView().setCenter(ol.extent.getCenter(layers[layername].layer.getSource().getExtent()));
        map.getView().setZoom(18);
    }

}


initLayers();
clustering();

//drawCaseYear("2016");
//drawMosIdx();		//布氏指數
//draw_regulation();	//列管點
//layers['Fspouse'].layer.setZIndex(30);
//layers['clean106'].layer.setZIndex(31);
//layers['Fcompany'].layer.setZIndex(32);
//layers['Highrisk106'].layer.setZIndex(33);
//layers['Hospital106'].layer.setZIndex(34);
//layers['WorkAddr106'].layer.setZIndex(35);
//layers['CurAddr106'].layer.setZIndex(36);


$(function () {
    /*底圖圖層切換動作*/
    $("input[name='baselayer']").change(function () {
        if ($(this).is(':checked')) {
            map.removeLayer(layers[defaultLayers['baselayer']].layer)
            map.addLayer(layers[$(this).val()].layer)
            defaultLayers['baselayer'] = $(this).val()
        }
    })
    /*套疊圖層切換動作*/
    var check_option = 0;
    $("input[name='overlayer']").change(function () {
        if ($(this).is(':checked')) {
            if (layers[$(this).val()].load) {	//若是已載入
                if ($(this).val() === "regulation") {
                    clustersC1.setMap(map);
                    clustersC2.setMap(map);
                } else {
                    layers[$(this).val()].layer.setVisible(true);

                    if ($(this).val() === "CurAddr106" || $(this).val() === "WorkAddr106" || $(this).val() === "Hospital106") {
                        check_option = check_option + 1;
                    } else if ($(this).val() === "Fspouse") {
                        $("#legend3").show();
                    } else if ($(this).val() === "Fcompany") {
                        $("#legend4").show();
                    } else if ($(this).val() === "ovitrap106") {
                        $("#legend5").show();
                    }
                    if (check_option > 0) {
                        addLegend106();
                    }
                }
            } else {	//還沒載入
                if ($(this).val() === "regulation") {
                    draw_regulation();	//列管點
                    clustersC1.setMap(map);
                    clustersC2.setMap(map);
                    //layers[$(this).val()].layer.setVisible(true);
                } else if ($(this).val() === "ovitrip") {
                    draw_ovitrip();	//列管點
                    clusters_ot.setMap(map);
                } else if ($(this).val() === "105_allcases") {
                    drawCaseYear("2016");
                    map.addLayer(layers[$(this).val()].layer);
                    layers[$(this).val()].layer.setVisible(true);
                } else if ($(this).val() === "106_allcases") {
                    drawCaseYear("2017");
                    map.addLayer(layers[$(this).val()].layer);
                    layers[$(this).val()].layer.setVisible(true);
                } else if ($(this).val() === "BILv") {
                    drawMosIdx();		//布氏指數
                    map.addLayer(layers[$(this).val()].layer);
                    layers[$(this).val()].layer.setVisible(true);
                } else {
                    map.addLayer(layers[$(this).val()].layer);
                    layers[$(this).val()].layer.setVisible(true);

                    if ($(this).val() === "CurAddr106") {
                        check_option = check_option + 1;
                        layers['CurAddr106'].layer.setZIndex(36);
                    } else if ($(this).val() === "WorkAddr106") {
                        check_option = check_option + 1;
                        layers['WorkAddr106'].layer.setZIndex(35);
                    } else if ($(this).val() === "Hospital106") {
                        check_option = check_option + 1;
                        layers['Hospital106'].layer.setZIndex(34);
                    } else if ($(this).val() === "Fspouse") {
                        $("#legend3").show();
                        layers['Fspouse'].layer.setZIndex(30);
                    } else if ($(this).val() === "Fcompany") {
                        $("#legend4").show();
                        layers['Fcompany'].layer.setZIndex(32);
                    } else if ($(this).val() === "Highrisk106") {
                        layers['Highrisk106'].layer.setZIndex(33);
                    } else if ($(this).val() === "clean106") {
                        layers['clean106'].layer.setZIndex(31);
                    } else if ($(this).val() === "ovitrap106") {
                        $("#legend5").show();
                        layers['ovitrap106'].layer.setZIndex(37);
                    }

                    if (check_option > 0) {
                        addLegend106();
                    }
                }
                layers[$(this).val()].load = true;
            }

            //105年確診會與cluster重疊，因此先關閉
            if ($(this).val() === "105_allcases") {
                rmCluster();
            }

            if ($(this).val() === "106_allcases") {
                rmCluster();
            }

            if ($(this).val() === "30days_100m") {
                draw_casebuffer(100);
            }

            if ($(this).val() === "30days_50m") {
                draw_casebuffer(50);
            }
        } else {
            if ($(this).val() === "rainfall") {
                img_rainfall.setVisible(false);
            } else if ($(this).val() === "regulation") {
                clustersC1.setMap(null);
                clustersC2.setMap(null);
            } else if ($(this).val() === "ovitrip") {
                clusters_ot.setMap(null);
            } else {
                layers[$(this).val()].layer.setVisible(false);

                if ($(this).val() === "CurAddr106" || $(this).val() === "WorkAddr106" || $(this).val() === "Hospital106") {
                    check_option = check_option - 1;
                } else if ($(this).val() === "Fspouse") {
                    $("#legend3").hide();
                } else if ($(this).val() === "Fcompany") {
                    $("#legend4").hide();
                } else if ($(this).val() === "ovitrap106") {
                    $("#legend5").hide();
                }
                if (check_option == 0) {
                    clrLegend106();
                }
            }

            if ($(this).val() === "105_allcases") {
                addCluster();
            }

            if ($(this).val() === "106_allcases") {
                addCluster();
            }

        }
    })

    $("[name='searchbuf']").on("change", function (e) {
        if ($(e.target).val() == 50) {
            bufsize = 50;
        } else {
            bufsize = 100;
        }
    });

    $('#closeoviinfo').click(function () {
        $('#oviinfo').hide();
    })

})


function richInfo(evt) {

    var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    var lon = lonlat[0];
    var lat = lonlat[1];

    rich_buffer_source.clear();
    vectorSourcebsa.clear();
    vectorSourcebsa2.clear();
    //create buffer
    var parser = new jsts.io.olParser();
    var buffer_feature = new ol.Feature({});
    var point_feature = new ol.Feature({
        geometry: new ol.geom.Point([lon, lat]).transform('EPSG:4326', 'EPSG:3857')
    });

    var jstsGeom = parser.read(point_feature.getGeometry());
    var buffered = jstsGeom.buffer(parseInt(bufsize));
    buffer_feature.setGeometry(parser.write(buffered));
    rich_buffer_source.addFeature(buffer_feature);
    var buffer_vectorLayer = new ol.layer.Vector({
        source: rich_buffer_source,
        style: [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                lineDash: [2, 8],
                width: 2
            }),
            fill: new ol.style.Fill({
                color: 'rgba(227, 74, 51, 0.1)'
            })
        })]
    });
    map.addLayer(buffer_vectorLayer);

    var buffer_feature_2 = new ol.Feature({});
    buffer_feature_2.setGeometry(parser.write(buffered));

    //buffer to wkt
    var buffer_feature_4326 = new ol.Feature({ //轉換坐標為 經緯度
        geometry: buffer_feature_2.getGeometry().transform('EPSG:3857', 'EPSG:4326')
    });

    var wktformat = new ol.format.WKT();
    var buffer_wkt = wktformat.writeGeometry(buffer_feature_4326.getGeometry());
    //console.log(buffer_wkt);

    var featuresbsa = null;
    var feature_geojson = null;

    // 查詢buffer_wkt內的點



    $.ajax({
        url: "getinfo.php",
        method: "POST",
        dataType: "json",
        async: false,
        data: {
            buffer_wkt: buffer_wkt,
        },
        success: function (data) {
            console.log(data)
            featuresbsa = data.popu;
            featuresmidx = data.mosidx;

            feature_geojson = (new ol.format.GeoJSON()).readFeatures(
                featuresbsa, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });

            vectorSourcebsa = new ol.source.Vector({
                features: feature_geojson
            });

            var vectorLayer = new ol.layer.Vector({
                source: vectorSourcebsa,
                //2016-0608 edited by bocheng
                style: [new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#159ff2',
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(21, 159, 242, 0.1)'
                    })
                })]
            });

            map.addLayer(vectorLayer);

            var getText = function (feature, resolution) {
                var type = 'normal';
                var maxResolution = 1200;
                var text = feature.get('Village') + "\nDate: " + feature.get('LatestDate') + "\nBI(BILv): " + feature.get('BI') + "(" + feature.get('BILv') + ")";

                if (resolution > maxResolution) {
                    text = '';
                } else if (type == 'hide') {
                    text = '';
                } else if (type == 'shorten') {
                    text = text.trunc(12);
                } else if (type == 'wrap') {
                    text = stringDivider(text, 16, '\n');
                }
                return text;
            };

            // Text Style for point
            var createTextStyle = function (feature, resolution) {
                var align = 'start';
                var baseline = 'bottom';
                var size = '12px';
                var offsetX = parseInt('0', 10);
                var offsetY = parseInt('-20', 10);
                var weight = 'normal';
                var rotation = parseFloat('0');
                var font = weight + ' ' + size + ' ' + 'Arial';
                var fillColor = '#aa3300';
                var outlineColor = '#ffffff';
                var outlineWidth = parseInt('3', 10);

                return new ol.style.Text({
                    textAlign: align,
                    textBaseline: baseline,
                    font: font,
                    text: getText(feature, resolution),
                    fill: new ol.style.Fill({ color: fillColor }),
                    stroke: new ol.style.Stroke({ color: outlineColor, width: outlineWidth }),
                    offsetX: offsetX,
                    offsetY: offsetY,
                    rotation: rotation
                });
            };

            // Points
            var createPointStyleFunction = function () {
                return function (feature, resolution) {
                    var style = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 5,
                            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.1)' }),
                            stroke: new ol.style.Stroke({ color: 'red', width: 1 })
                        }),
                        text: createTextStyle(feature, resolution)
                    });
                    return [style];
                };
            };

            var featuremidx_geojson = (new ol.format.GeoJSON()).readFeatures(featuresmidx, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })

            vectorSourcebsa2 = new ol.source.Vector({
                features: featuremidx_geojson
            });

            var vectorLayermidx = new ol.layer.Vector({
                source: vectorSourcebsa2,
                style: createPointStyleFunction(),
            });

            map.addLayer(vectorLayermidx);

            //2016-0608 edited by bocheng
			/**
			* Elements that make up the popup.
			*/
            var container = document.getElementById('popup');
            var content = document.getElementById('popup-content');
            var closer = document.getElementById('popup-closer');


			/**
			* Add a click handler to hide the popup.
			* @return {boolean} Don't follow the href.
			*/
            closer.onclick = function () {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            };


			/**
			* Create an overlay to anchor the popup to the map.
			*/
            var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
                element: container,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            }));

            map.addOverlay(overlay);

            var coordinate = evt.coordinate;
            content.innerHTML = '<p>區域資訊</p><a>半徑大小：</a><code>' + bufsize + '</code></br><a>戶數：</a><code>' + data.h_cnt + '</code></br><a>人口數：</a><code>' + data.p_cnt + '</code></br><a>14天累積病例：</a><code>' + data.b14total + '</code></br>';

            overlay.setPosition(coordinate);

        }
    });
}

function clustering() {
    $.ajax({
        url: "getdata.php",
        method: "POST",
        dataType: "json",
        async: false,
        data: {
            queryCaseTime: "yes"
        },
        success: function (data) {
            //alert(data);
            //console.log("cluster:",data);
            featuresb7 = data.b7geojson;
            featuresb8_14 = data.b8_14geojson;
            featuresb15_30 = data.b15_30geojson;

            var vectorSourceb7 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(featuresb7,
                    { featureProjection: 'EPSG:3857' })
            });
            var vectorSourceb8_14 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(featuresb8_14,
                    { featureProjection: 'EPSG:3857' })
            });
            var vectorSourceb15_30 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(featuresb15_30,
                    { featureProjection: 'EPSG:3857' })
            });


            var clusterSourceb7 = new ol.source.Cluster({
                distance: 50,
                source: vectorSourceb7
            });
            var clusterSourceb8_14 = new ol.source.Cluster({
                distance: 50,
                source: vectorSourceb8_14
            });
            var clusterSourceb15_30 = new ol.source.Cluster({
                distance: 50,
                source: vectorSourceb15_30
            });

            var styleCache = {};
            clustersb7 = new ol.layer.Vector({
                source: clusterSourceb7,
                style: function (feature, resolution) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 15,
                                stroke: new ol.style.Stroke({
                                    color: '#fff',
                                    width: 3.0
                                }),
                                fill: new ol.style.Fill({
                                    color: 'red'
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: '#fff'
                                })
                            })
                        })];
                        styleCache[size] = style;
                    }
                    return style;
                }
            });

            var styleCache2 = {};
            clustersb8_14 = new ol.layer.Vector({
                source: clusterSourceb8_14,
                style: function (feature2, resolution) {
                    var size2 = feature2.get('features').length;
                    var style2 = styleCache2[size2];
                    if (!style2) {
                        style2 = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 10,
                                stroke: new ol.style.Stroke({
                                    color: '#fff',
                                    width: 2.0
                                }),
                                fill: new ol.style.Fill({
                                    color: '#FF7744'
                                })
                            }),
                            text: new ol.style.Text({
                                text: size2.toString(),
                                fill: new ol.style.Fill({
                                    color: '#fff'
                                })
                            })
                        })];
                        styleCache2[size2] = style2;
                    }
                    return style2;
                }
            });/**/

            var styleCache3 = {};
            clustersb15_30 = new ol.layer.Vector({
                source: clusterSourceb15_30,
                style: function (feature3, resolution) {
                    var size3 = feature3.get('features').length;
                    var style3 = styleCache3[size3];
                    if (!style3) {
                        style3 = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 10,
                                stroke: new ol.style.Stroke({
                                    color: '#fff',
                                    width: 2.0
                                }),
                                fill: new ol.style.Fill({
                                    color: '#00B050'
                                })
                            }),
                            text: new ol.style.Text({
                                text: size3.toString(),
                                fill: new ol.style.Fill({
                                    color: '#fff'
                                })
                            })
                        })];
                        styleCache3[size3] = style3;
                    }
                    return style3;
                }
            });/**/
            clustersb15_30.setMap(map);
            clustersb8_14.setMap(map);;
            clustersb7.setMap(map);;
        },
        error: function (data) {
            console.log(data)
        }
    });

    click_fun();

}

function click_fun() {

    //    var vectorSourceb7 = new ol.source.Vector({
    //        features: (new ol.format.GeoJSON()).readFeatures(featuresb7,
    //            {featureProjection: 'EPSG:3857'})
    //    });
    //    var vectorSourceb8_14 = new ol.source.Vector({
    //        features: (new ol.format.GeoJSON()).readFeatures(featuresb8_14,
    //            {featureProjection: 'EPSG:3857'})
    //    });
    //    var vectorSourceb15_30 = new ol.source.Vector({
    //        features: (new ol.format.GeoJSON()).readFeatures(featuresb15_30,
    //            {featureProjection: 'EPSG:3857'})
    //    });
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    closer.onclick = function () {
        popup.setPosition(undefined);
        closer.blur();
        return false;
    };

    var popup = new ol.Overlay(/** @type {olx.OverlayOptions} */({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    //    var popup = new ol.Overlay({
    //      element: container,
    //      positioning: 'bottom-center',
    //      stopEvent: false
    //    });

    map.addOverlay(popup);

    cluster_info = map.on('click', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature, layer) {
                //console.log(feature);
                return feature;
            });
        if (feature) {
            //popup.setPosition(evt.coordinate);
            if (feature.get('id')) {
                content.innerHTML = '<p>病例資訊</p><a>發病日期：</a><code>' + feature.get('date') + '</code></br><a>確診編號：</a><code>' + feature.get('id') + '</code></br>';
            } else if (feature.get('features')) {
                if (feature.get('features')[0].get('date')) {
                    content.innerHTML = '<p>病例資訊</p><a>發病日期：</a><code>' + feature.get('features')[0].get('date') + '</code></br><a>確診編號：</a><code>' + feature.get('features')[0].get('id') + '</code></br>';
                } else if (feature.get('features')[0].get('tkey')) {
                    content.innerHTML = '<p>設置資訊</p><a>日期：</a><code>' + feature.get('features')[0].get('datetime') + '</code></br><a>地址：</a><code>' + feature.get('features')[0].get('address') + '</code></br>';
                } else {
                    content.innerHTML = '<p>資訊</p><code>' + feature.get('features')[0].get('Information') + '</code></br>';
                }
            } else if (feature.get('VILLAGE')) {
                content.innerHTML = '<p>資訊</p><a>名稱：</a><code>' + feature.get('VILLAGE') + '</code></br>';
            } else if (feature.get('TOWN')) {
                content.innerHTML = '<p>資訊</p><a>名稱：</a><code>' + feature.get('TOWN') + '</code></br>';
            } else if (feature.get('v_name')) {
                content.innerHTML = '<p>資訊</p><a>村里名稱：</a><code>' + feature.get('v_name') + '</code></br><a>日期：</a><code>' + feature.get('date') + '</code></br><a>布氏級數：</a><code>' + feature.get('mosidx') + '</code></br>';
            } else if (feature.get('sn')) {
                content.innerHTML = '<p>病例資訊</p><a>流水號：</a><code>' + feature.get('sn') + '</code></br><a>案例號：</a><code>' + feature.get('caseNo') + '</code></br><a>稱謂：</a><code>' + feature.get('title') + '</code></br><a>發病日期：</a><code>' + feature.get('relapseDat') + '</code></br><a>通報日期：</a><code>' + feature.get('notifyDate') + '</code></br><a>確診日期：</a><code>' + feature.get('casesureda') + '</code></br><a>性別：</a><code>' + feature.get('gender') + '</code></br><a>年齡：</a><code>' + feature.get('age') + '</code></br><a>居住地：</a><code>' + feature.get('currentAdd') + '</code></br><a>工作地：</a><code>' + feature.get('workAddr') + '</code></br><a>活動地：</a><code>' + feature.get('activity') + '</code></br><a>就醫院所：</a><code>' + feature.get('hospital') + '</code></br><a>IgM</a><code>' + feature.get('IgM') + '</code></br><a>IgG</a><code>' + feature.get('IgG') + '</code></br><a>PCR</a><code>' + feature.get('PCR') + '</code></br><a>NS1</a><code>' + feature.get('NS1') + '</code></br>';
            } else if (feature.get('key')) {
                content.innerHTML = '<p>就醫院所資訊</p><a>醫療院所：</a><code>' + feature.get('hospital') + '</code></br><a>案例號：</a><code>' + feature.get('caseNo') + '</code></br>';
            } else if (feature.get('townid')) {
                content.innerHTML = '<p>外配統計資訊</p><a>鄉鎮市區：</a><code>' + feature.get('townname') + '</code></br><a>總計：</a><code>' + feature.get('總計') + '</code></br><a>外籍配偶：</a><code>' + feature.get('外籍配') + '</code></br><a>大陸配偶：</a><code>' + feature.get('大陸配') + '</code></br>';
            } else if (feature.get('cid')) {
                content.innerHTML = '<p>公司外勞統計</p><a>公司：</a><code>' + feature.get('company') + '</code></br><a>總計：</a><code>' + feature.get('sum') + '</code></br><a>菲律賓：</a><code>' + feature.get('Philippine') + '</code></br><a>泰國：</a><code>' + feature.get('Thailand') + '</code></br><a>馬來西亞：</a><code>' + feature.get('Malaysia') + '</code></br><a>印尼：</a><code>' + feature.get('Indonesia') + '</code></br><a>越南：</a><code>' + feature.get('Vietnam') + '</code></br><a>蒙古：</a><code>' + feature.get('Mongolia') + '</code></br>';
            } else if (feature.get('cleanID')) {
                content.innerHTML = '<p>孳清噴藥紀錄</p><a>日期：</a><code>' + feature.get('date') + '</code></br><a>處置方式：</a><code>' + feature.get('處置') + '</code></br><a>範圍：</a><code>' + feature.get('範圍') + '</code></br>';
            } else if (feature.get('位置')) {
                content.innerHTML = '<p>高危點</p><a>位置：</a><code>' + feature.get('位置') + '</code></br>';
            } else if (feature.get('編號')) {

                drawOviplot(feature);
                $('#oviinfo').show();
                $('#oviinfo').draggable();

                content.innerHTML = '<p>誘卵器</p><a>編號：</a><code>' + feature.get('編號') + '</code></br><a>地址：</a><code>' + feature.get('Addr') + '</code></br><a>註記：</a><code>' + feature.get('Note') + '</code></br><a>調查日期(w1)：</a><code>' + feature.get('date_w40') + '</code></br><a>-卵數：</a><code>' + feature.get('egg_w40') + '</code></br><a>-孑孓：</a><code>' + feature.get('larva_w40') + '</code></br><a>調查日期(w2)：</a><code>' + feature.get('date_w41') + '</code></br><a>-卵數：</a><code>' + feature.get('egg_w41') + '</code></br><a>-孑孓：</a><code>' + feature.get('larva_w41') + '</code></br><a>調查日期(w3)：</a><code>' + feature.get('date_w42') + '</code></br><a>-卵數：</a><code>' + feature.get('egg_w42') + '</code></br><a>-孑孓：</a><code>' + feature.get('larva_w42') +
                    '</code></br><a>調查日期(w3)：</a><code>' + feature.get('date_w43') + '</code></br><a>-卵數：</a><code>' + feature.get('egg_w43') + '</code></br><a>-孑孓：</a><code>' + feature.get('larva_w43') +
                    '</code></br><a>調查日期(w3)：</a><code>' + feature.get('date_w44') + '</code></br><a>-卵數：</a><code>' + feature.get('egg_w44') + '</code></br><a>-孑孓：</a><code>' + feature.get('larva_w44') +
                    '</code></br><a>調查日期(w3)：</a><code>' + feature.get('date_w45') + '</code></br><a>-卵數：</a><code>' + feature.get('egg_w45') + '</code></br><a>-孑孓：</a><code>' + feature.get('larva_w45') + '</code></br>';


            } else {
                var Name = (feature.get('Name')) ? '<a>名稱：</a><code>' + feature.get('Name') + '</code></br>' : "";
                var name = (feature.get('name')) ? '<a>名稱：</a><code>' + feature.get('name') + '</code></br>' : "";
                var Descriptio = (feature.get('Descriptio')) ? '<a>描述：</a><code>' + feature.get('Descriptio') + '</code></br>' : "";
                content.innerHTML = '<p>病例資訊</p>' + Name + name + Descriptio;
            }

            popup.setPosition(evt.coordinate);

            //$(container).popover({
            //  'placement': 'top',
            //  'html': true,
            //  'content': content
            //});

        } else {
            $(container).popover('destroy');
        }
    });


}


function drawOviplot(feature) {
    //console.log(feature);
    // Apply the theme

    $('#ovitable').highcharts({
        chart: {
            type: 'column',
            borderRadius: 5,
            width: '500',
            height: '300',
            className: 'chart'
        },
        title: {
            text: feature.get('編號')//'誘卵器調查數量'
        },
        xAxis: {
            categories: ['week40', 'week41', 'week42', 'week43', 'week44', 'week45'],
            crosshair: true
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: '數量'
            }
        },
        credits: {
            text: 'pt.geohealth.tw',
            href: 'http://pt.geohealth.tw'
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px"></span><table>',
            pointFormat: '<tr><td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '蟲卵',
            data: [feature.get('egg_w40'), feature.get('egg_w41'), feature.get('egg_w42'), feature.get('egg_w43'), feature.get('egg_w44'), feature.get('egg_w45')]
        }, {
            name: '孑孓',
            data: [feature.get('larva_w40'), feature.get('larva_w41'), feature.get('larva_w42'), feature.get('larva_w43'), feature.get('larva_w44'), feature.get('larva_w45')]
        }]
    });
}



////2016-06-20
//function compareCoordinates(coord1, coord2){
//    var
//        lon1 = Math.round(coord1[0]),
//        lon2 = Math.round(coord2[0]),
//        lat1 = Math.round(coord1[1]),
//        lat2 = Math.round(coord2[1]);
//
//    var
//        percent_lon = Math.abs(lon1 / lon2 - 1).toFixed(4),
//        percent_lat = Math.abs(lat1 / lat2 - 1).toFixed(4);
//        percent = (Number(percent_lon) + Number(percent_lat) / 2).toFixed(4);
//
//    return percent;
//}
////2016-06-20
//function between(number, min, max){
//    if(number >= min && number <= max) return true;
//    else return false;
//}
function addCluster() {
    clustersb15_30.setMap(map);
    clustersb8_14.setMap(map);
    clustersb7.setMap(map);
    $("#legend").show()
    //click_fun();
}
function rmCluster() {
    clustersb15_30.setMap(null);
    clustersb8_14.setMap(null);
    clustersb7.setMap(null);
    $("#legend").hide()
    //map.unByKey(cluster_info);
}
function rmQEdit() {
    layers['edit_loc_pid'].layer.getSource().clear()
}
function drawCaseYear(year) {
    $.ajax({
        url: "getdatabyyear.php",
        method: "POST",
        dataType: "json",
        async: false,
        data: {
            year: year
        },
        success: function (_data) {
            //console.log(_data);
            casesYearly = _data.caseYearly;
            if (year === '2016') {
                layers['105_allcases'].layer.getSource().clear();

                var format = new ol.format.GeoJSON();
                layers['105_allcases'].layer.getSource().addFeatures(format.readFeatures(casesYearly, {
                    featureProjection: 'EPSG:3857'
                }));
            }
            if (year === '2017') {
                layers['106_allcases'].layer.getSource().clear();

                var format = new ol.format.GeoJSON();
                layers['106_allcases'].layer.getSource().addFeatures(format.readFeatures(casesYearly, {
                    featureProjection: 'EPSG:3857'
                }));
            }
        }
    });

}
function drawMosIdx() {
    $.ajax({
        url: "getmosidx_latest.php",
        method: "POST",
        dataType: "json",
        async: false,
        success: function (data) {
            featuresvill = data.village;

            //console.log(featuresvill);
            layers['BILv'].layer.getSource().clear()

            feature_geojson = (new ol.format.GeoJSON()).readFeatures(featuresvill);

            dcase_color(feature_geojson);

            layers['BILv'].layer.getSource().addFeatures(feature_geojson);
            //vectorSourcebsa = new ol.source.Vector({
            //    features: feature_geojson
            //});
            //
            //var vectorLayer = new ol.layer.Vector({
            //    source: vectorSourcebsa,
            //});
            //
            //map.addLayer(vectorLayer);
        }
    });

}

function dcase_color(tfeatures) {
    if (tfeatures == null || tfeatures.length == 0) {
        setTimeout(function () {
            lmi_color();
        }, 500);
    } else {
        //console.log(tfeatures.length);
        for (var j = 0; j < tfeatures.length; j++) {
            var feature = tfeatures[j];
            var val = feature.get("mosidx");

            if (val >= 3) {
                var style = new ol.style.Style({
                    fill: new ol.style.Fill({ color: [255, 0, 0, 0.8] }), stroke: new ol.style.Stroke({ color: '#159ff2', width: 2 }),
                    text: new ol.style.Text({ text: feature.get('v_name') + '\n (BILv: ' + val + ')' })
                });
                feature.setStyle(style);
            } else if (val < 3 && val >= 2) {
                style = new ol.style.Style({ fill: new ol.style.Fill({ color: [255, 255, 0, 0.8] }), stroke: new ol.style.Stroke({ color: '#159ff2', width: 2 }) });
                feature.setStyle(style);
            } else if (val < 2 && val >= 1) {
                style = new ol.style.Style({ fill: new ol.style.Fill({ color: [0, 128, 0, 0.8] }), stroke: new ol.style.Stroke({ color: '#159ff2', width: 2 }) });
                feature.setStyle(style);
            } else if (val < 1 && val >= 0) {
                style = new ol.style.Style({ fill: new ol.style.Fill({ color: [128, 128, 128, 0.8] }), stroke: new ol.style.Stroke({ color: '#159ff2', width: 2 }) });
                feature.setStyle(style);
            } else {
                style = new ol.style.Style({ fill: new ol.style.Fill({ color: [21, 159, 242, 0.1] }), stroke: new ol.style.Stroke({ color: '#159ff2', width: 2 }) });
                feature.setStyle(style);
            }
        }
    }
}

function draw_regulation() {

    var featuresC1 = null, featuresC2 = null;

    $.ajax({
        url: "getdata_regpt.php",
        method: "POST",
        dataType: "json",
        async: false,
        data: {
            queryCaseTime: "yes"
        },
        success: function (data) {
            //console.log("cluster:",data);
            featuresC1 = data.b7geojson;	//type 1
            featuresC2 = data.b8_14geojson;  //type 2

            var vectorSourceC1 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(featuresC1,
                    { featureProjection: 'EPSG:3857' })
            });

            var vectorSourceC2 = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(featuresC2,
                    { featureProjection: 'EPSG:3857' })
            });

            var clusterSourceC1 = new ol.source.Cluster({
                distance: 50,
                source: vectorSourceC1
            });

            var clusterSourceC2 = new ol.source.Cluster({
                distance: 50,
                source: vectorSourceC2
            });

            var styleCache = {};
            clustersC1 = new ol.layer.Vector({
                source: clusterSourceC1,
                style: function (feature, resolution) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 12,
                                stroke: new ol.style.Stroke({
                                    color: [152, 152, 152, 1.0],
                                    width: 3.0
                                }),
                                fill: new ol.style.Fill({
                                    color: [255, 50, 50, 1.0]
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: '#fff'
                                })
                            })
                        })];
                        styleCache[size] = style;
                    }
                    return style;
                }
            });

            var styleCache2 = {};
            clustersC2 = new ol.layer.Vector({
                source: clusterSourceC2,
                style: function (feature2, resolution) {
                    var size2 = feature2.get('features').length;
                    var style2 = styleCache2[size2];
                    if (!style2) {
                        style2 = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 12,
                                stroke: new ol.style.Stroke({
                                    color: [152, 152, 152, 1.0],
                                    width: 3.0
                                }),
                                fill: new ol.style.Fill({
                                    color: [50, 153, 50, 1.0]
                                })
                            }),
                            text: new ol.style.Text({
                                text: size2.toString(),
                                fill: new ol.style.Fill({
                                    color: '#fff'
                                })
                            })
                        })];
                        styleCache2[size2] = style2;
                    }
                    return style2;
                }
            });
        },
        error: function (data) {
            console.log(data)
        }
    });
}

function draw_ovitrip() {

    var features_ot = null;

    $.ajax({
        url: "showimagegetdata3.php",
        method: "POST",
        dataType: "json",
        async: false,
        success: function (data) {
            //console.log("cluster:",data);
            features_ot = data.b7geojson;

            var vectorSource_ot = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(features_ot,
                    { featureProjection: 'EPSG:3857' })
            });

            var clusterSource_ot = new ol.source.Cluster({
                distance: 50,
                source: vectorSource_ot
            });

            var styleCache = {};
            clusters_ot = new ol.layer.Vector({
                source: clusterSource_ot,
                style: function (feature, resolution) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = [new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 12,
                                stroke: new ol.style.Stroke({
                                    color: [152, 152, 152, 1.0],
                                    width: 2.0
                                }),
                                fill: new ol.style.Fill({
                                    color: [255, 87, 51, 1.0]
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: '#fff'
                                })
                            })
                        })];
                        styleCache[size] = style;
                    }
                    return style;
                }
            });
        },
        error: function (data) {
            console.log(data)
        }
    });
}

function draw_casebuffer(range) {
    if (range == 100)
        layers['30days_100m'].layer.getSource().clear();
    if (range == 50)
        layers['30days_50m'].layer.getSource().clear();

    $.ajax({
        url: "getdatain30days.php",
        method: "POST",
        dataType: "json",
        async: false,
        data: {
            queryCaseTime: "yes"
        },
        success: function (data) {
            features = data.case30days.features;
            //console.log(features);
            for (var i = 0; i < features.length; i++) {
                console.log(features[i].geometry.coordinates[0]);
                var lon = features[i].geometry.coordinates[0];
                var lat = features[i].geometry.coordinates[1];

                //create buffer
                var parser = new jsts.io.olParser();
                var buffer_feature = new ol.Feature({});
                var point_feature = new ol.Feature({
                    geometry: new ol.geom.Point([lon, lat]).transform('EPSG:4326', 'EPSG:3857')
                });

                var jstsGeom = parser.read(point_feature.getGeometry());
                var buffered = jstsGeom.buffer(range);
                buffer_feature.setGeometry(parser.write(buffered));

                if (range == 100)
                    layers['30days_100m'].layer.getSource().addFeature(buffer_feature);
                if (range == 50)
                    layers['30days_50m'].layer.getSource().addFeature(buffer_feature);

            }
        },
        error: function (data) {
            console.log(data)
        }
    });
}

var styleFunction = function (feature) {
    var geometry = feature.getGeometry();
    var styles = [
        // linestring
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            })
        })
    ];

    //console.log(geometry.getLength());
    //var lines = geometry.getLineString(0);
    var line_array = geometry.getLineStrings();
    for (var i = 0; i < line_array.length; i++) {
        //console.log(line_array[i]);  
        line_array[i].forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);

            // arrows
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                image: new ol.style.Icon({
                    src: 'images/arrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));
        });
    }
    return styles;
};

function intelligent_detection() {

    $.ajax({
        url: "activityoverlay.php",
        method: "POST",
        dataType: "json",
        async: false,
        success: function (data) {
            //console.log(data.activity.features.length);

            features = data.activity.features;
            for (var i = 0; i < features.length; i++) {
                geometry = features[i].geometry.geometries;
                for (var j = 0; j < geometry.length; j++) {

                    var lon1 = geometry[j].coordinates[0];
                    var lat1 = geometry[j].coordinates[1];

                    features2 = data.activity.features;
                    for (var m = i; m < features2.length; m++) {
                        if (i !== m) {
                            geometry2 = features[m].geometry.geometries;
                            for (var n = 0; n < geometry2.length; n++) {

                                var lon2 = geometry2[n].coordinates[0];
                                var lat2 = geometry2[n].coordinates[1];

                                dlon2 = (lon2 - lon1) * (lon2 - lon1);
                                dlat2 = (lat2 - lat1) * (lat2 - lat1);
                                dd = Math.sqrt(dlon2 + dlat2);

                                if (dd <= 0.0027) { //150*2
                                    //create buffer
                                    var coor = [[lon1, lat1], [lon2, lat2]];
                                    for (var p = 0; p < 2; p++) {

                                        var parser = new jsts.io.olParser();
                                        var buffer_feature = new ol.Feature({});
                                        var point_feature = new ol.Feature({
                                            geometry: new ol.geom.Point([coor[p][0], coor[p][1]]).transform('EPSG:4326', 'EPSG:3857')
                                        });

                                        var jstsGeom = parser.read(point_feature.getGeometry());
                                        var buffered = jstsGeom.buffer(150);
                                        buffer_feature.setGeometry(parser.write(buffered));

                                        smart_detection_source.addFeature(buffer_feature);
                                        var buffer_vectorLayer = new ol.layer.Vector({
                                            source: smart_detection_source,
                                            style: [new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                    color: 'red',
                                                    lineDash: [2, 8],
                                                    width: 1
                                                }),
                                                fill: new ol.style.Fill({
                                                    color: 'rgba(227, 74, 51, 0.1)'
                                                })
                                            })]
                                        });
                                        map.addLayer(buffer_vectorLayer);
                                    }

                                }

                            }
                            //console.log(geometry[j].coordinates[0]);
                            //	var lon = features[i].geometry.coordinates[0];
                            //	var lat = features[i].geometry.coordinates[1];
                            //	
                            //	//create buffer
                            //	var parser = new jsts.io.olParser();
                            //	var buffer_feature = new ol.Feature({});
                            //	var point_feature = new ol.Feature({
                            //		geometry: new ol.geom.Point([lon, lat]).transform('EPSG:4326', 'EPSG:3857')
                            //	});
                            //
                            //	var jstsGeom = parser.read(point_feature.getGeometry());
                            //	var buffered = jstsGeom.buffer(200);
                            //	buffer_feature.setGeometry(parser.write(buffered));
                            //
                            //	smart_detection_source.addFeature(buffer_feature);
                            //	var buffer_vectorLayer = new ol.layer.Vector({
                            //		source: smart_detection_source,
                            //		style: [new ol.style.Style({
                            //					stroke: new ol.style.Stroke({
                            //						color: 'red',
                            //						lineDash: [2, 8],
                            //						width: 1
                            //					}),
                            //					fill: new ol.style.Fill({
                            //						color: 'rgba(227, 74, 51, 0.1)'
                            //					})
                            //				})]
                            //	});
                            //	map.addLayer(buffer_vectorLayer);
                        }
                    }
                }
            }

            //point
            var locationfeatures = new ol.format.GeoJSON().readFeatures(data.activity, {
                featureProjection: 'EPSG:3857'
            });

            locationSource = new ol.source.Vector({
                features: locationfeatures
            });

            var locationLayer = new ol.layer.Vector({
                source: locationSource,
                style: [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: '#f0f20d'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#f2240d',
                            width: 2.0
                        })
                    })
                })]
            });
            map.addLayer(locationLayer);

            //route
            //console.log(data.route);
            var routefeatures = new ol.format.GeoJSON().readFeatures(data.route, {
                featureProjection: 'EPSG:3857'
            });

            routeSource = new ol.source.Vector({
                features: routefeatures
            });

            var routeLayer = new ol.layer.Vector({
                source: routeSource,
                style: styleFunction
                //style: [new ol.style.Style({
                //			stroke: new ol.style.Stroke({
                //				color: 'green',
                //				width: 2
                //			})
                //		})]
            });
            map.addLayer(routeLayer);

        },
        error: function (data) {
            console.log(data)
        }
    });
}

var is_detection = 0;
$("#intelligent_detection").click(function () {
    if (is_detection === 0) {
        intelligent_detection();
        is_detection = 1;
    }
    else {
        smart_detection_source.clear();
        routeSource.clear();
        locationSource.clear();
        is_detection = 0;
    }
})

//function draw_curAddr106(){
//	layers['CurAddr106'].layer.getSource().clear();
//	
//var geojson_layer = new ol.layer.Vector({
//    source: new ol.source.Vector({
//        url: './data/currentAddr_e3857.geojson',
//        format: new ol.format.GeoJSON()
//    })
//});
//	//feature_geojson = new ol.source.Vector({
//	//						url: './data/currentAddr_e3857.geojson',
//	//						format: new ol.format.GeoJSON()
//	//					});	
//	
//    //feature_geojson = (new ol.format.GeoJSON()).readFeatures('./data/currentAddr_e3857.geojson');
//    console.log(geojson_layer);   
//	
//    curAddr106_color(feature_geojson);
//          
//	layers['CurAddr106'].layer.getSource().addFeatures(feature_geojson);
//}
//
//function curAddr106_color(tfeatures){
//	if(tfeatures ==null || tfeatures.length==0 ){
//		setTimeout(function(){
//			lmi_color();    
//		},500);
//	}else{
//		//console.log(tfeatures.length);
//		for (var j = 0; j < tfeatures.length; j++) {				
//			var feature=tfeatures[j];
//			var val=feature.get("caseNo");
//			
//			if(val==1){
//				var style=new ol.style.Style({fill:new ol.style.Fill({color: [255,0,0, 0.8]}),stroke:new ol.style.Stroke({color: '#159ff2',width: 2}),
//					text:new ol.style.Text({text:feature.get('v_name')+'\n (BILv: '+val+')'})
//					});
//				feature.setStyle(style);
//			}else{
//				style=new ol.style.Style({fill:new ol.style.Fill({color: [21,159,242, 0.1]}),stroke:new ol.style.Stroke({color: '#159ff2',width: 2})});
//				feature.setStyle(style);
//			}
//		}
//	}
//}







var mockData = [];

mockData.push({
    item: {
        id: 'layerid1',
        label: '1.通報病例',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id11',
            label: '103',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id111',
                label: '登革熱',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id112',
                label: '屈公病',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id113',
                label: '茲卡病毒',
                value: 1,
                checked: false
            }
        }]
    }, {
        item: {
            id: 'id12',
            label: '104',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id121',
                label: '登革熱',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id122',
                label: '屈公病',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id123',
                label: '茲卡病毒',
                value: 1,
                checked: false
            }
        }]
    }, {
        item: {
            id: 'id13',
            label: '105',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id131',
                label: '登革熱',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id132',
                label: '屈公病',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id133',
                label: '茲卡病毒',
                value: 1,
                checked: false
            }
        }]
    }, {
        item: {
            id: 'id14',
            label: '106',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id141',
                label: '登革熱',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id142',
                label: '屈公病',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id143',
                label: '茲卡病毒',
                value: 1,
                checked: false
            }
        }]
    }]
});

mockData.push({
    item: {
        id: 'layerid2',
        label: '2.確定病例',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id21',
            label: 'Lorem ipsum dolor 21',
            value: 1,
            checked: false
        }
    }, {
        item: {
            id: 'id22',
            label: 'Lorem ipsum dolor 22',
            checked: false
        }
    }, {
        item: {
            id: 'id23',
            label: 'Lorem ipsum dolor 23',
            value: 1,
            checked: false
        }
    }]
});

mockData.push({
    item: {
        id: 'layerid3)',
        label: '3.近2週病媒蚊密度布氏級數</br>(綠:0-1級，黃: 2級，紅: 大於3級',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id31',
            label: 'Lorem ipsum dolor 31',
            value: 1,
            checked: false
        }
    }, {
        item: {
            id: 'id32',
            label: 'Lorem ipsum dolor 32',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id321',
                label: 'Lorem ipsum dolor 321',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id322',
                label: 'Lorem ipsum dolor 322',
                value: 1,
                checked: false
            }
        }]
    }]
});

mockData.push({
    item: {
        id: 'layerid4',
        label: '4.歷史病媒蚊密度調查',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id31',
            label: 'Lorem ipsum dolor 31',
            value: 1,
            checked: false
        }
    }, {
        item: {
            id: 'id32',
            label: 'Lorem ipsum dolor 32',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id321',
                label: 'Lorem ipsum dolor 321',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id322',
                label: 'Lorem ipsum dolor 322',
                value: 1,
                checked: false
            }
        }]
    }]
});

mockData.push({
    item: {
        id: 'layerid5',
        label: '5.誘卵器監測',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id31',
            label: 'Lorem ipsum dolor 31',
            value: 1,
            checked: false
        }
    }, {
        item: {
            id: 'id32',
            label: 'Lorem ipsum dolor 32',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id321',
                label: 'Lorem ipsum dolor 321',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id322',
                label: 'Lorem ipsum dolor 322',
                value: 1,
                checked: false
            }
        }]
    }]
});

mockData.push({
    item: {
        id: 'layerid6',
        label: '6.病例活動地孳清噴藥紀錄',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id31',
            label: 'Lorem ipsum dolor 31',
            value: 1,
            checked: false
        }
    }, {
        item: {
            id: 'id32',
            label: 'Lorem ipsum dolor 32',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id321',
                label: 'Lorem ipsum dolor 321',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id322',
                label: 'Lorem ipsum dolor 322',
                value: 1,
                checked: false
            }
        }]
    }]
});

mockData.push({
    item: {
        id: 'layerid7',
        label: '7.例行性噴藥紀錄',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id31',
            label: 'Lorem ipsum dolor 31',
            value: 1,
            checked: false
        }
    }, {
        item: {
            id: 'id32',
            label: 'Lorem ipsum dolor 32',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id321',
                label: 'Lorem ipsum dolor 321',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id322',
                label: 'Lorem ipsum dolor 322',
                value: 1,
                checked: false
            }
        }]
    }]
});

mockData.push({
    item: {
        id: 'layerid8',
        label: '8.風險點',
        value: 1,
        checked: false
    },
    children: [{
        item: {
            id: 'id31',
            label: 'Lorem ipsum dolor 31',
            value: 1,
            checked: false
        }
    }, {
        item: {
            id: 'id32',
            label: 'Lorem ipsum dolor 32',
            value: 1,
            checked: false
        },
        children: [{
            item: {
                id: 'id321',
                label: 'Lorem ipsum dolor 321',
                value: 1,
                checked: false
            }
        }, {
            item: {
                id: 'id322',
                label: 'Lorem ipsum dolor 322',
                value: 1,
                checked: false
            }
        }]
    }]
});

mockData.push({
    item: {
        id: 'layerid9',
        label: '9.外籍移工統計',
        value: 'Fcompany',
        checked: false
    }
});

mockData.push({
    item: {
        id: 'layerid10',
        label: '10.外配統計',
        value: 'Fspouse',
        checked: false
    }
});

mockData.push({
    item: {
        id: 'layerid11',
        label: '11.歷年易淹水範圍',
        value: 'flooding',
        checked: false
    }
});

mockData.push({
    item: {
        id: 'layerid12',
        label: '12.本日累積雨量',
        value: 'img_rainfall',
        checked: false
    }
});
console.log(mockData);

$(function () {

    $('#tree-container').checkTree({
        data: mockData
    });

});

















