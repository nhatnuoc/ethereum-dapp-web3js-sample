// app.ui.jvectormap Module
// ====================================================================
// This file should included in your project.
//
// - Squaredesigns.net -


"use strict";
angular.module("app.ui.jvectormap", [])

/***********************************
  :: UI Jvectormap Directive
***********************************/

.directive("uiJvectormap", [
  function() {
    return {
      restrict: "A",
      scope: {
        options: "="
      },
      link: function(scope, ele, attrs) {
        var options;
        options = scope.options;
        return ele.vectorMap(options);
      }
    };
  }
])

/***********************************
  :: Jvectormap Ctrl
***********************************/

.controller("jvectormapCtrl", [
  "$scope", function($scope) {
    var usa_markers, world_marker_data;
    world_marker_data = [{
            latLng: [41.90, 12.45],
            name: 'Vatican City'
        }, {
            latLng: [55.75, 37.61],
            name: 'Moscow'
        }, {
            latLng: [52.52, 13.40],
            name: 'Berlin'
        }, {
            latLng: [37.77, -122.41],
            name: 'San Francisco'
        }, {
            latLng: [3.2, 73.22],
            name: 'Maldives'
        }, {
            latLng: [32.71, -117.16],
            name: 'San Diego'
        }, {
            latLng: [40.71, -74.00],
            name: 'New York'
        }, {
            latLng: [47.60, -122.33],
            name: 'Seattle'
        }, {
            latLng: [1.3, 103.8],
            name: 'Singapore'
        }, {
            latLng: [41.87, -87.62],
            name: 'Chicago'
        }, {
            latLng: [26.02, 50.55],
            name: 'Bahrain'
        }, {
            latLng: [43.73, 7.41],
            name: 'Monaco'
        }, {
            latLng: [-0.52, 166.93],
            name: 'Nauru'
        }, {
            latLng: [-8.51, 179.21],
            name: 'Tuvalu'
        }, {
            latLng: [43.93, 12.46],
            name: 'San Marino'
        }, {
            latLng: [47.14, 9.52],
            name: 'Liechtenstein'
        }, {
            latLng: [40.71, -74.00],
            name: 'New York'
        }, {
            latLng: [29.76, -95.36],
            name: 'Houston'
        }, {
            latLng: [1.46, 173.03],
            name: 'Kiribati'
        }, {
            latLng: [-21.13, -175.2],
            name: 'Tonga'
        }, {
            latLng: [15.3, -61.38],
            name: 'Dominica'
        }];
    $scope.Jvusamap = {
        map: 'us_aea_en',
      zoomButtons: false,
      markers: world_marker_data,
      normalizeFunction: 'polynomial',
      regionsSelectable: true,
      markersSelectable: true,
      backgroundColor: '#ffffff',
	  scaleColors: ['#C8EEFF', '#0071A4'],
      zoomOnScroll: false,
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                fill: '#fad733'
            },
            selected: {
                fill: '#ffffff'
            }
        },
        regionStyle: {
            initial: {
                fill: '#23b7e5'
            },
            selected: {
                fill: '#27c24c'
            }
        },
        series: {
            markers: [{
                attribute: 'r',
                scale: [5, 15],
                values: [
                    187.70,
                    255.16,
                    310.69,
                    605.17,
                    248.31,
                    107.35,
                    217.22
                ]
            }]
        },
        backgroundColor: '#fff',
        regionsSelectable: true,
        markersSelectable: true,
        markers: [{
            latLng: [40.71, -74.00],
            name: 'New York'
        }, {
            latLng: [34.05, -118.24],
            name: 'Los Angeles'
        }, {
            latLng: [41.87, -87.62],
            name: 'Chicago'
        }, {
            latLng: [29.76, -95.36],
            name: 'Houston'
        }, {
            latLng: [39.95, -75.16],
            name: 'Philadelphia'
        }, {
            latLng: [38.62, -90.19],
            name: 'St. Louis,MO'
       },  {
            latLng: [38.90, -77.03],
            name: 'Washington'
       },  {
            latLng: [37.36, -122.03],
            name: 'Silicon Valley'
        }]
    }


    return $scope.Jvworldmap = {
      map: 'world_mill_en',
      zoomButtons: false,
      markers: world_marker_data,
      normalizeFunction: 'polynomial',
      regionsSelectable: true,
      markersSelectable: true,
      backgroundColor: '#ffffff',
	  scaleColors: ['#C8EEFF', '#0071A4'],
      zoomOnScroll: false,
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                fill: '#fad733'
            },
            selected: {
                fill: '#ffffff'
            }
        },
        regionStyle: {
            initial: {
                fill: '#23b7e5'
            },
            selected: {
                fill: '#27c24c'
            }
        },
        series: {
            markers: [{
                attribute: 'r',
                scale: [5, 15],
                values: [
                    187.70,
                    255.16,
                    310.69,
                    605.17,
                    248.31,
                    107.35,
                    217.22
                ]
            }]
        },
        backgroundColor: '#fff',
        regionsSelectable: true,
        markersSelectable: true,
    };
  }
]);