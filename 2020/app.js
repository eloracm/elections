let map;
let chart;
let infowindow;
var searchBox;
let precincts = {};

const mapStyle =
    [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#CBE9CA"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#c9c9c9"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#AADAFF"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        }
    ];

function initMap() {
    var USCenter = new google.maps.LatLng(39.967122, -75.713753);
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        mapTypeId: 'mystyle',
        center: USCenter,
        options: {
            gestureHandling: 'greedy'
        }
    });

    map.mapTypes.set('mystyle', new google.maps.StyledMapType(mapStyle, { name: 'My Style' }));

    var searchDiv = document.getElementById("pacSearch");
    searchDiv.innerHTML = '<input id="pac-input" class="controls" type="text" placeholder="Search Box">';

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0)
            return;

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        map.setZoom(14);
    });


    // Load GeoJSON.
    //const geojson = "https://storage.googleapis.com/mapsdevsite/json/google.json";
    //const geojson = "./az.geojson";
    const county = document.querySelector('input[name="county"]:checked').value;
    initCounty(county);
    zoom(county);
    drawLegend();
}

function zoom(county) {
    var bounds = new google.maps.LatLngBounds();
    precincts[county].forEach(function (feature) {
        if (undefined == feature.getGeometry() || undefined == feature.getGeometry().getArray()) {
            console.log(feature);
            return;
        }
        processPoints(feature.getGeometry(), bounds.extend, bounds);
    });
    map.fitBounds(bounds);
}

function processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
        callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
        callback.call(thisArg, geometry.get());
    } else {
        geometry.getArray().forEach(function (g) {
            processPoints(g, callback, thisArg);
        });
    }
}

const blue50 = "#ADCCF6";
const blue60 = "#79ABE2";
const blue70 = "#5A73F7";
const blue80 = "#0B2FF4";
const red50 = "#FCE0E0";
const red60 = "#EAA9A9";
const red70 = "#DB7171";
const red80 = "#FD0303";


function initCounty(county) {
    const geojson = "./" + county + "_precincts.geojson";
    precincts[county] = new google.maps.Data();
    precincts[county].setMap(map);
    precincts[county].loadGeoJson(geojson, { idPropertyName: 'PRECINCTID' }, function (features) {
        zoom(county);
        google.charts.setOnLoadCallback(drawTopTurnout);
    });
    // Color each letter gray. Change the color when the isColorful property
    // is set to true.
    precincts[county].setStyle(feature => {
        const display = document.querySelector('input[name="display"]:checked').value;
        if (display == "results") {
            return styleResults(feature);
        }
        return styleTurnout(feature);
    });

    infowindow = new google.maps.InfoWindow();

    precincts[county].addListener('click', function (event) {
        const county = document.querySelector('input[name="county"]:checked').value;
        if (county == 'chester') {
            setChesterInfo(event);
        }
        else if (county == 'montgomery') {
            setMontgomeryInfo(event);
        } else {
            setResultsInfo(event);
        }
    });

    precincts[county].addListener('mouseover', function (event) {
        const county = document.querySelector('input[name="county"]:checked').value;
        if (county == 'chester') {
            setChesterInfo(event);
        }
        else if (county == 'montgomery') {
            setMontgomeryInfo(event);
        } else {
            setResultsInfo(event);
        }
    });

    precincts[county].addListener('mouseout', function (evt) {
        infowindow.close();
        infowindow.opened = false;
    });
}

function stylePrecinct(feature, display) {
    if (display == 'turnout') {
        return styleTurnout(feature);
    }
    return styleResults(feature);
}

function styleResults(feature) {
    let color = "blue";
    let opacity = .25;
    let stroke = "orange";
    let zindex = 1;
    const trump = feature.getProperty("Trump");
    const biden = feature.getProperty("Biden");
    if (trump == undefined || biden == undefined) {
        color = "orange";
    } else if (biden == trump) {
        color = "orange";
    } else if (biden > trump) {
        const percent = feature.getProperty("biden_percent");
        if (percent >= 80) {
            color = blue80;
        } else if (percent >= 70) {
            color = blue70;
        } else if (percent >= 60) {
            color = blue60;
        } else {
            color = blue50;
        }
        stroke = "blue";
        opacity = .75;
        zindex = 2;
    } else {
        const percent = feature.getProperty("trump_percent");
        if (percent >= 80) {
            color = red80;
        } else if (percent >= 70) {
            color = red70;
        } else if (percent >= 60) {
            color = red60;
        } else {
            color = red50;
        }
        stroke = "red";
        opacity = .75;
        zindex = 2;
    }

    return /** @type {!google.maps.Data.StyleOptions} */ {
        fillColor: color,
        strokeColor: stroke,
        strokeWeight: 2,
        fillOpacity: opacity,
        zIndex: zindex
    };
}

var turnoutColors = [];
turnoutColors[0] = "#EDF8B1";
turnoutColors[1] = "#C7E9B4";
turnoutColors[2] = "#7FCDBB";
turnoutColors[3] = "#41B6C4";
turnoutColors[4] = "#1D91C0";
turnoutColors[5] = "#253494";
turnoutColors[6] = "#8C6BB1";
turnoutColors[7] = "#DD3497";
turnoutColors[8] = "#CE1255";
turnoutColors[9] = "#FF0000";

var turnoutRange = [];
turnoutRange[0] = 20;
turnoutRange[1] = 40;
turnoutRange[2] = 50;
turnoutRange[3] = 60;
turnoutRange[4] = 65;
turnoutRange[5] = 70;
turnoutRange[6] = 75;
turnoutRange[7] = 80;
turnoutRange[8] = 85;
turnoutRange[9] = 85;

function styleTurnout(feature) {
    const turnout = feature.getProperty("turnout");
    let color = "brown";
    let opacity = .45;
    let stroke = "brown";
    let zindex = 1;

    if (turnout == 0 || turnout == undefined) {
        color = turnoutColors[0];
        stroke = "black";
    }
    else {
        for (var i = 1; i < turnoutColors.length; i++) {
            if (turnout < turnoutRange[i]) {
                color = turnoutColors[i];
                stroke = color;
                break;
            }
        }
    }
    if (i == turnoutColors.length) {
        color = turnoutColors[turnoutColors.length - 1];
        stroke = color;
    }

    zindex = i;
    return /** @type {!google.maps.Data.StyleOptions} */ {
        fillColor: color,
        strokeColor: stroke,
        strokeWeight: 2,
        fillOpacity: opacity,
        zIndex: zindex
    };
}

function setResultsInfo(event) {
    let precinctId = event.feature.getProperty('PRECINCTID');
    const name = event.feature.getProperty('NAME');
    if (undefined == precinctId)
        precinctId = event.feature.getProperty('Precinct');

    let biden = -1;
    let trump = -1;
    let bidenP = 0;
    let trumpP = 0;
    if (event.feature.getProperty('Biden') != undefined) {
        biden = event.feature.getProperty('Biden');
    }
    if (event.feature.getProperty('Trump') != undefined) {
        trump = event.feature.getProperty('Trump');
    }
    if (event.feature.getProperty('biden_percent') != undefined) {
        bidenP = event.feature.getProperty('biden_percent')
    }
    if (event.feature.getProperty('trump_percent') != undefined) {
        trumpP = event.feature.getProperty('trump_percent')
    }
    infowindow.opened = false;
    const html = "<div style='width:230px; '><span class='large'>" + ((undefined != name) ? (name + "(") : "Precinct ") + precinctId + ((undefined != name) ? ")" : "") + "</span>" +
        "<BR><span class='bold'>Biden/Harris:</span> " + (-1 != biden ? (biden + " (" + bidenP + "%)") : "N/A") +
        "<BR><span class='bold'>Trump/Pence:</span> " + (-1 != trump ? (trump + " (" + trumpP + "%)") : "N/A") +
        "<BR><span class='bold'>Voter turnout:</span> " + (undefined != event.feature.getProperty('turnout') ? (event.feature.getProperty('turnout') + "%") : "N/A") + "</div > ";
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng)
    infowindow.open(map);
}

function setMontgomeryInfo(event) {
    let precinctId = event.feature.getProperty('PRECINCTID');
    const name = event.feature.getProperty('Precinct_Name');

    const biden = event.feature.getProperty('Biden');
    const biden_percent = event.feature.getProperty('biden_percent');
    const trump = event.feature.getProperty('Trump');
    const trump_percent = event.feature.getProperty('trump_percent');
    const turnout = event.feature.getProperty("turnout");
    const cast = event.feature.getProperty("cast");
    const biden_in_p = event.feature.getProperty('Biden Election Day Votes');
    const biden_mail = event.feature.getProperty('Biden Mail-in Votes');
    const biden_prov = event.feature.getProperty('Biden Provisional Votes');
    const trump_in_p = event.feature.getProperty('Trump Election Day Votes');
    const trump_mail = event.feature.getProperty('Trump Mail-in Votes');
    const trump_prov = event.feature.getProperty('Trump Provisional Votes');

    infowindow.opened = false;
    let html = "<div style='width:450px; '><span class='large'>" + name + "(" + precinctId + ")" + "</span>";
    html += "<p /><span class='bold'>Ballots cast: </span>" + cast + " (" + turnout + "% turnout)";
    html += "<p /><table id='votes'>" +
        "<tr><th /><th>TOTAL</th><th>Vote&nbsp;%</th><th>In&nbsp;Person</th><th>Mail&nbsp;In</th><th>Provisional</th></tr>" +
        "<tr><td>Biden/Harris</td><td>" + biden + "</td><td>" + biden_percent + "%</td><td>" + biden_in_p + "</td><td>" + biden_mail + "</td><td>" + biden_prov + "</td></tr>" +
        "<tr><td>Trump/Pence</td><td>" + trump + "</td><td>" + trump_percent + "%</td><td>" + trump_in_p + "</td><td>" + trump_mail + "</td><td>" + trump_prov + "</td></tr>" +
        "</table>";
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng)
    infowindow.open(map);

}

function setChesterInfo(event) {
    const precinctId = event.feature.getProperty('PRECINCTID');
    const name = event.feature.getProperty('NAME');

    const biden = event.feature.getProperty('Biden');
    const trump = event.feature.getProperty('Trump');
    const turnout = event.feature.getProperty('turnout');
    const cast = event.feature.getProperty('Ballots');
    const total = event.feature.getProperty('Total');
    const biden_in_p = event.feature.getProperty('Biden In Person');
    const biden_mail = event.feature.getProperty('Biden Mail');
    const biden_prov = event.feature.getProperty('Biden Provisional');
    const trump_in_p = event.feature.getProperty('Trump In Person');
    const trump_mail = event.feature.getProperty('Trump Mail');
    const trump_prov = event.feature.getProperty('Trump Provisional');

    const bidenP = (biden / total * 100.0).toFixed(2) + "%";
    const trumpP = (trump / total * 100.0).toFixed(2) + "%";
    infowindow.opened = false;
    let html = "<div style='width:450px; '><span class='large'>" + name + "(" + precinctId + ")" + "</span>";
    html += "<p /><span class='bold'>Ballots cast: </span>" + cast + " (" + turnout + "% turnout)";
    html += "<p /><table id='votes'>" +
        "<tr><th /><th>TOTAL</th><th>Vote&nbsp;%</th><th>In&nbsp;Person</th><th>Mail&nbsp;In</th><th>Provisional</th></tr>" +
        "<tr><td>Biden/Harris</td><td>" + biden + "</td><td>" + bidenP + "</td><td>" + biden_in_p + "</td><td>" + biden_mail + "</td><td>" + biden_prov + "</td></tr>" +
        "<tr><td>Trump/Pence</td><td>" + trump + "</td><td>" + trumpP + "</td><td>" + trump_in_p + "</td><td>" + trump_mail + "</td><td>" + trump_prov + "</td></tr>" +
        "</table>";
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng)
    infowindow.open(map);
}

function switchCounty() {
    drawLegend();
    const county = document.querySelector('input[name="county"]:checked').value;
    const counties = Object.keys(precincts);
    for (var i = 0; i < counties.length; i++) {
        precincts[counties[i]].setMap(null);
    }
    if (null == precincts[county]) {
        initCounty(county);
    }
    precincts[county].setMap(map);
    zoom(county);
    document.getElementById('topTurn').innerHTML = "";
    if ('chester' == county) {
        drawTopTurnout();
    }
}

function switchDisplay() {
    const display = document.querySelector('input[name="display"]:checked').value;
    if (display == 'turnout') {
        drawTurnoutLegend();
    } else {
        drawResultsLegend();
    }

    const county = document.querySelector('input[name="county"]:checked').value;
    precincts[county].forEach(function styleIt(feature) {
        precincts[county].setStyle(feature => {
            return stylePrecinct(feature, display);
        });
    });
}

function drawLegend() {
    const display = document.querySelector('input[name="display"]:checked').value;
    if (display == "results") {
        drawResultsLegend();
    }
    else {
        drawTurnoutLegend();
    }
}

function drawResultsLegend() {
    const canvas = document.getElementById("legendCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px sans-serif";
    //var spacer = window.innerWidth / turnoutColors.length;
    var spacer = 50;
    var rectWidth = 55;
    var startX = 10;
    var startY = 25;

    ctx.fillStyle = "black";
    ctx.font = "bold 10pt Arial";
    ctx.fillText("Biden", startX, 25);

    ctx.fillStyle = blue50;
    ctx.fillRect(startX + spacer, 10, rectWidth-5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<60%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + spacer + rectWidth, 25);

    ctx.fillStyle = blue60;
    ctx.fillRect(startX + 2 * spacer + rectWidth, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<70%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 2*spacer + 2*rectWidth, 25);

    ctx.fillStyle = blue70;
    ctx.fillRect(startX + 3*spacer + 2*rectWidth, 10, rectWidth -5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<80%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 3*spacer + 3*rectWidth, 25);

    ctx.fillStyle = blue80;
    ctx.fillRect(startX + 4 * spacer + 3*rectWidth, 10, rectWidth -5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = ">80%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 4 * spacer + 4 * rectWidth, 25);

    ctx.fillStyle = "black";
    ctx.font = "bold 10pt Arial";
    ctx.fillText("Trump", startX + 5 * spacer + 4 * rectWidth, 25);

    ctx.fillStyle = red50;
    ctx.fillRect(startX + 6 * spacer + 4 * rectWidth, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<60%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 6 * spacer + 5 * rectWidth, 25);

    ctx.fillStyle = red60;
    ctx.fillRect(startX + 7 * spacer + 5 * rectWidth, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<70%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 7 * spacer + 6 * rectWidth, 25);

    ctx.fillStyle = red70;
    ctx.fillRect(startX + 8 * spacer + 6 * rectWidth, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<80%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 8 * spacer + 7 * rectWidth, 25);

    ctx.fillStyle = red80;
    ctx.fillRect(startX + 9 * spacer + 7 * rectWidth, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = ">80%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 9 * spacer + 8 * rectWidth, 25);

    const county = document.querySelector('input[name="county"]:checked').value;
    if (county == 'oc') {
        ctx.fillStyle = "black";
        ctx.font = "bold 10pt Arial";
        ctx.fillText("N/A", startX + 10 * spacer + 8 * rectWidth, 25);

        ctx.fillStyle = "orange";
        ctx.fillRect(startX + 10 * spacer + 8 * rectWidth + 30, 10, rectWidth - 5, 20);
    }
}

function drawTurnoutLegend() {
    const canvas = document.getElementById("legendCanvas");
    var ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "10pt Arial";
    canvas.height = 30;

    var startY = 10;
    for (var i = 0; i < turnoutColors.length; i++) {
        var x = 120 * i;
        ctx.fillStyle = turnoutColors[i];
        ctx.fillRect(10 + x, startY, 50, 20);
        ctx.fillStyle = "black";
        if (i == 0)
            caption = "0%";
        else if (i == 9)
            caption = ">= 85%";
        else
            caption = "< " + turnoutRange[i] + "%";

        ctx.fillText(caption, 65 + x, 15 + startY);
    }
}

function drawTopTurnout() {
    const county = document.querySelector('input[name="county"]:checked').value;
    if (county != 'chester' && county != 'montgomery')
        return;

    const dataArray = [];

    precincts[county].forEach(function extract(feature) {
        const turnout = feature.getProperty('turnout');
        let precinctId = feature.getProperty('PRECINCTID');
        if (precinctId == '4012035')
            return;
        let name = feature.getProperty('NAME');
        if (undefined == name)
            name = feature.getProperty('Precinct_Name');
        if (undefined == precinctId)
            precinctId = feature.getProperty('Precinct');
        let label = precinctId;
        if (undefined != name)
            label = name + " (" + precinctId + ")";
        dataArray.push([ label, turnout, precinctId ]);
    });

    dataArray.sort(function (a, b) { return b[1] - a[1]; })
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Precinct');
    data.addColumn('number', 'Turnout');
    for (var i = 0; i < 10; i++) {
        data.addRow([dataArray[i][0], dataArray[i][1]]);
    }

    var options = {
        title: 'Top 10 Precincts in voter turnout',
        width: 800,
        height: 500,
        chartArea: {
            height: 450
        },
        legend: { position: "none" },
        bars: 'horizontal',
        vAxis: {
            textStyle: { fontName: 'Arial', fontSize: 12}
        },
        hAxis: {
            format: '#\'%\''
        }
    };

    var formatter = new google.visualization.NumberFormat({ suffix: '%', fractionDigits: 2 });
    // format column 1 of the DataTable
    formatter.format(data, 1);

    chart = new google.visualization.BarChart(document.getElementById('topTurn'));
    chart.draw(data, options);
    google.visualization.events.addListener(chart, 'onmouseover', function (event) {
        setHighlight(dataArray[event.row][2]);
    });
    google.visualization.events.addListener(chart, 'onmouseout', function (event) {
        removeHighlight(dataArray[event.row][2]);
    });
}

function setHighlight(precinctId) {
    const county = document.querySelector('input[name="county"]:checked').value;
    const precinct = precincts[county].getFeatureById(precinctId);
    if (undefined == precinct)
        return;
    precincts[county].overrideStyle(precinct, { strokeColor: '#FFFFFF', zIndex: 9999, strokeWeight: 3 });
}

function removeHighlight(precinctId) {
    const county = document.querySelector('input[name="county"]:checked').value;
    const precinct = precincts[county].getFeatureById(precinctId);
    if (undefined == precinct)
        return;
    precincts[county].revertStyle(precinct);
}