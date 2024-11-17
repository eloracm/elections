let map;
let chart;
let infowindow;
var searchBox;
let precincts = {};

const blue50 = "#ADCCF6";
const blue60 = "#79ABE2";
const blue70 = "#5A73F7";
const blue80 = "#0B2FF4";
const red50 = "#FCE0E0";
const red60 = "#EAA9A9";
const red70 = "#DB7171";
const red80 = "#FD0303";

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

const Dolores = { lat: 33.61240481838322, lng: -117.74075594481238 };
const Stewart = { lat: 33.68606808574965, lng: -117.95698058104394 };
const Douglas = { lat: 39.6190480671349, lng: -105.06405515812628 };
const Carole = { lat: 40.010419972516715, lng: -75.68420487034948 };
const Alex = { lat: 40.03703315188258, lng: -75.69660451048235 };
const Waterside = { lat: 40.21896211865368, lng: -75.18219918957182 };
const Hilltop = { lat: 39.564255806477995, lng: -104.72109136875474 };
const Readers = { lat: 37.662445361044966, lng: -77.6729569261032 };
const Wexford = { lat: 39.977500644149494, lng: -74.7628979888659 };
const Whitehall = { lat: 40.615722278431406, lng: -75.55495986000993 };

const markers = [];

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
        zoom: 9,
        center: Waterside,
        options: {
            gestureHandling: 'greedy'
        },
        mapId: "Precincts"
    });

    map.mapTypes.set('mystyle', new google.maps.StyledMapType(mapStyle, { name: 'My Style' }));

    // Load GeoJSON.
    //const geojson = "https://storage.googleapis.com/mapsdevsite/json/google.json";
    // map.data.loadGeoJson(geojson);

    markers.push({ county: 'oc', marker: new AdvancedMarkerElement({ position: Dolores, map }) });
    markers.push({ county: 'oc', marker: new AdvancedMarkerElement({ position: Stewart, map }) });
    markers.push({ county: 'denver', marker: new AdvancedMarkerElement({ position: Douglas, map }) });
    markers.push({ county: 'chester', marker: new AdvancedMarkerElement({ position: Carole }) });
    markers.push({ county: 'chester', marker: new AdvancedMarkerElement({ position: Alex, map }) });
    markers.push({ county: 'montgomery', marker: new AdvancedMarkerElement({ position: Waterside, map }) });
    markers.push({ county: 'douglas', marker: new AdvancedMarkerElement({ position: Hilltop, map }) });
    markers.push({ county: 'goochland', marker: new AdvancedMarkerElement({ position: Readers, map }) });
    markers.push({ county: 'burlington', marker: new AdvancedMarkerElement({ position: Wexford, map }) });
    markers.push({ county: 'lehigh', marker: new AdvancedMarkerElement({ position: Whitehall, map }) });

    const county = document.querySelector('input[name="county"]:checked').value;
    initCounty(county);
    zoom(county);

    drawLegend();
    drawTopTurnout();
}

initMap();
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

function showHideMarkers(county) {
    markers.forEach(function (marker) {
        if (marker.county == county)
            marker.marker.map = map;
        else
            marker.marker.map = null;
    })
}
function initCounty(county) {
    const geojson = "./" + county + "_precincts.geojson";
    precincts[county] = new google.maps.Data();
    precincts[county].setMap(map);
    precincts[county].loadGeoJson(geojson, { idPropertyName: 'PRECINCTID' }, function (features) {
        zoom(county);
        // google.charts.setOnLoadCallback(drawTopTurnout);
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
        } else if (county == 'goochland') {
            setGoochlandInfo(event);
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
        } else if (county == 'goochland') {
            setGoochlandInfo(event);
        } else {
            setResultsInfo(event);
        }
    });

    precincts[county].addListener('mouseout', function (evt) {
        infowindow.close();
        infowindow.opened = false;
    });

    showHideMarkers(county);
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
    const harris = feature.getProperty("Harris");
    if (trump == undefined || harris == undefined) {
        color = "orange";
    } else if (harris == trump) {
        color = "orange";
    } else if (harris > trump) {
        const percent = feature.getProperty("harris_percent");
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

    let harris = -1;
    let trump = -1;
    let harrisP = 0;
    let trumpP = 0;
    if (event.feature.getProperty('Harris') != undefined) {
        harris = event.feature.getProperty('Harris');
    }
    if (event.feature.getProperty('Trump') != undefined) {
        trump = event.feature.getProperty('Trump');
    }
    if (event.feature.getProperty('harris_percent') != undefined) {
        harrisP = event.feature.getProperty('harris_percent')
    }
    if (event.feature.getProperty('trump_percent') != undefined) {
        trumpP = event.feature.getProperty('trump_percent')
    }
    infowindow.opened = false;
    const html = "<div style='width:230px; '><span class='large'>" + ((undefined != name) ? (name + "&nbsp;(") : "Precinct ") + precinctId + ((undefined != name) ? ")" : "") + "</span>" +
        "<BR><span class='bold'>Harris/Walz:</span> " + (-1 != harris ? (harris + " (" + harrisP + "%)") : "N/A") +
        "<BR><span class='bold'>Trump/Vance:</span> " + (-1 != trump ? (trump + " (" + trumpP + "%)") : "N/A") +
        "<BR><span class='bold'>Voter turnout:</span> " + (undefined != event.feature.getProperty('turnout') ? (event.feature.getProperty('turnout') + "%") : "N/A") + "</div > ";
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng)
    infowindow.open(map);
}

function setMontgomeryInfo(event) {
    let precinctId = event.feature.getProperty('PRECINCTID');
    const name = event.feature.getProperty('Precinct_Name');

    const harris = event.feature.getProperty('Harris');
    const harris_percent = event.feature.getProperty('harris_percent');
    const trump = event.feature.getProperty('Trump');
    const trump_percent = event.feature.getProperty('trump_percent');
    const turnout = event.feature.getProperty("turnout");
    const cast = event.feature.getProperty("cast");
    const races = event.feature.getProperty("races");
    const candidates = races[0]["candidates"];
    const harris_in_p = candidates["DEM Kamala D Harris"]["Election Day Votes"];
    const harris_mail = candidates["DEM Kamala D Harris"]["Mail-in Votes"];
    const harris_prov = candidates["DEM Kamala D Harris"]["Provisional Votes"];
    const trump_in_p = candidates["REP Donald J Trump"]["Election Day Votes"];
    const trump_mail = candidates["REP Donald J Trump"]["Mail-in Votes"];
    const trump_prov = candidates["REP Donald J Trump"]["Provisional Votes"];

    infowindow.opened = false;
    let html = "<div style='width:450px; '><span class='large'>" + name + "(" + precinctId + ")" + "</span>";
    html += "<p /><span class='bold'>Ballots cast: </span>" + cast + " (" + turnout + "% turnout)";
    html += "<p /><table id='votes'>" +
        "<tr><th /><th>TOTAL</th><th>Vote&nbsp;%</th><th>In&nbsp;Person</th><th>Mail&nbsp;In</th><th>Provisional</th></tr>" +
        "<tr><td>Harris/Walz</td><td>" + harris + "</td><td>" + harris_percent + "%</td><td>" + harris_in_p + "</td><td>" + harris_mail + "</td><td>" + harris_prov + "</td></tr>" +
        "<tr><td>Trump/Vance</td><td>" + trump + "</td><td>" + trump_percent + "%</td><td>" + trump_in_p + "</td><td>" + trump_mail + "</td><td>" + trump_prov + "</td></tr>" +
        "</table>";
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng)
    infowindow.open(map);

}

function setChesterInfo(event) {
    setResultsInfo(event);
    // const precinctId = event.feature.getProperty('PRECINCTID');
    // const name = event.feature.getProperty('NAME');

    // const harris = event.feature.getProperty('Harris');
    // const trump = event.feature.getProperty('Trump');
    // const turnout = event.feature.getProperty('turnout');
    // const cast = event.feature.getProperty('Ballots');
    // const total = event.feature.getProperty('Total');
    // const harris_in_p = event.feature.getProperty('Harris In Person');
    // const harris_mail = event.feature.getProperty('Harris Mail');
    // const harris_prov = event.feature.getProperty('Harris Provisional');
    // const trump_in_p = event.feature.getProperty('Trump In Person');
    // const trump_mail = event.feature.getProperty('Trump Mail');
    // const trump_prov = event.feature.getProperty('Trump Provisional');

    // const harrisP = (harris / total * 100.0).toFixed(2) + "%";
    // const trumpP = (trump / total * 100.0).toFixed(2) + "%";
    // infowindow.opened = false;
    // let html = "<div style='width:450px; '><span class='large'>" + name + "(" + precinctId + ")" + "</span>";
    // html += "<p /><span class='bold'>Ballots cast: </span>" + cast + " (" + turnout + "% turnout)";
    // html += "<p /><table id='votes'>" +
    //     "<tr><th /><th>TOTAL</th><th>Vote&nbsp;%</th><th>In&nbsp;Person</th><th>Mail&nbsp;In</th><th>Provisional</th></tr>" +
    //     "<tr><td>Harris/Walz</td><td>" + harris + "</td><td>" + harrisP + "</td><td>" + harris_in_p + "</td><td>" + harris_mail + "</td><td>" + harris_prov + "</td></tr>" +
    //     "<tr><td>Trump/Vance</td><td>" + trump + "</td><td>" + trumpP + "</td><td>" + trump_in_p + "</td><td>" + trump_mail + "</td><td>" + trump_prov + "</td></tr>" +
    //     "</table>";
    // infowindow.setContent(html);
    // infowindow.setPosition(event.latLng)
    // infowindow.open(map);
}

function setGoochlandInfo(event) {
    const precinctId = event.feature.getProperty('PRECINCTID');
    const name = event.feature.getProperty('Label_Name');

    const harris = event.feature.getProperty('Harris');
    const trump = event.feature.getProperty('Trump');

    infowindow.opened = false;
    let html = "<div style='width:450px; '><span class='large'>" + name + "(" + precinctId + ")" + "</span>";
    // html += "<p /><span class='bold'>Ballots cast: </span>" + cast + " (" + turnout + "% turnout)";
    html += "<p /><table id='votes'>" +
        "<tr><th /><th>TOTAL</th><th>Vote&nbsp;%</th><th>Early Voting</th><th>In Person</th><th>Mail&nbsp;In</th><th>Post Election</th></tr>" +
        "<tr><td>Harris/Walz</td><td>" + harris + "</td><td>" + event.feature.getProperty('harris_percent') + "%</td><td>" + event.feature.getProperty('harris_early') + "</td><td>" + event.feature.getProperty('harris_dayOf') + "</td><td>" + event.feature.getProperty('harris_absentee') + "</td><td>" + event.feature.getProperty('harris_post') + "</td></tr>" +
        "<tr><td>Trump/Vance</td><td>" + trump + "</td><td>" + event.feature.getProperty('trump_percent') + "%</td><td>" + event.feature.getProperty('trump_early') + "</td><td>" + event.feature.getProperty('trump_dayOf') + "</td><td>" + event.feature.getProperty('trump_absentee') + "</td><td>" + event.feature.getProperty('trump_post') + "</td></tr>" +
        "</table>";
    infowindow.setContent(html);
    infowindow.setPosition(event.latLng)
    infowindow.open(map);
}

function setBurlingtonInfo(event) {
    const precinctId = event.feature.getProperty('PRECINCTID');
    const name = event.feature.getProperty('NAME');

    const harris = event.feature.getProperty('Harris');
    const trump = event.feature.getProperty('Trump');

    infowindow.opened = false;
    let html = "<div style='width:450px; '><span class='large'>" + name + "(" + precinctId + ")" + "</span>";
    html += "<p /><span class='bold'>Ballots cast: </span>" + event.feature.getProperty('cast') + " (" + event.feature.getProperty('turnout') + "% turnout)";
    html += "<p /><table id='votes'>" +
        "<tr><th /><th>TOTAL</th><th>Vote&nbsp;%</th><th>Early Voting</th><th>In Person</th><th>Mail&nbsp;In</th></tr>" +
        "<tr><td>Harris/Walz</td><td>" + harris + "</td><td>" + event.feature.getProperty('harris_percent') + "%</td><td>" + event.feature.getProperty('harris_early') + "</td><td>" + event.feature.getProperty('harris_dayOf') + "</td><td>" + event.feature.getProperty('harris_mail') + "</td></tr>" +
        "<tr><td>Trump/Vance</td><td>" + trump + "</td><td>" + event.feature.getProperty('trump_percent') + "%</td><td>" + event.feature.getProperty('trump_early') + "</td><td>" + event.feature.getProperty('trump_dayOf') + "</td><td>" + event.feature.getProperty('trump_mail') + "</td></tr>" +
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
    if ('burlington' == county || 'montgomery' == county || 'lehigh' == county || 'chester' == county) {
        drawTopTurnout();
    }
    showHideMarkers(county);

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
    ctx.fillText("Harris", startX, 25);

    ctx.fillStyle = blue50;
    ctx.fillRect(startX + spacer, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<60%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + spacer + rectWidth, 25);

    ctx.fillStyle = blue60;
    ctx.fillRect(startX + 2 * spacer + rectWidth, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<70%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 2 * spacer + 2 * rectWidth, 25);

    ctx.fillStyle = blue70;
    ctx.fillRect(startX + 3 * spacer + 2 * rectWidth, 10, rectWidth - 5, 20);
    ctx.fillStyle = "black"; // text color
    var caption = "<80%";
    ctx.font = "10pt Arial";
    ctx.fillText(caption, startX + 3 * spacer + 3 * rectWidth, 25);

    ctx.fillStyle = blue80;
    ctx.fillRect(startX + 4 * spacer + 3 * rectWidth, 10, rectWidth - 5, 20);
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
    if (county != 'burlington' && county != 'montgomery' && county != 'lehigh' && county != 'chester')
        return;

    const dataArray = [];

    precincts[county].forEach(function extract(feature) {
        const turnout = parseFloat(feature.getProperty('turnout'));
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
        dataArray.push([label, turnout, precinctId]);
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
            textStyle: { fontName: 'Arial', fontSize: 12 }
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