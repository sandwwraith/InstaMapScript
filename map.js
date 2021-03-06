 $(function() {
            $( document ).tooltip({
                position: {my: "center top+15", at: "center bottom", collision: "flipfit"}
            });
        });

var map;
var markers = [];
var opened_info_window;
var opened_circle;        //TODO: not good global vars, refactor

function searchPlacesChangedGetter(searchBox) {
    return function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
    };
}

function addImage(lat, lng, dist) {
    var marker = new google.maps.Marker({position: {lat: lat, lng: lng},
                                          animation: google.maps.Animation.DROP,
                                          map: map,
                                          });

    var infowindow = new google.maps.InfoWindow({
        content: '<table><tr><td class="spinner"></td><td>LOADING...</td></tr></table>'
    });

    var circle = new google.maps.Circle({center: marker.getPosition(),
                            map: map,
                            radius: dist,
                            visible: false,
                            fillColor: '#33B5E5',
                            strokeColor: '#0099CC',
                            strokeWeight: 2,
                            clickable: false,
                            strokeOpacity: 0.8});

    google.maps.event.addListener(marker, 'click', function() {
        google.maps.event.addListener(infowindow, 'closeclick', function() {
            circle.setVisible(false)
        });
        close_info_window(infowindow)
        infowindow.open(map, marker)
        opened_info_window = infowindow
        opened_circle = circle
        circle.setVisible(true)
    });
    
    infowindow.open(map, marker);
    opened_info_window = infowindow;
    google.maps.event.addListener(infowindow, 'closeclick', function() {
            opened_info_window = undefined;
        });        
        
    return [infowindow, circle, marker];
}

function close_info_window(infowindow) {
    if (opened_info_window !== infowindow) {
        if (opened_info_window !== undefined)
            opened_info_window.close();
        if (opened_circle !== undefined)
            opened_circle.setVisible(false);
    }
}

function getLoc(map) {
    var coords = new google.maps.LatLng(59.956406877802756, 30.30924081802368);

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log("Get");
            map.setCenter(coords);
        }, function () {
                console.log("Didn't Get");
            });
    } else {
        console.log("Browser doesn't support Geolocation");
    }

    map.setCenter(coords);
}

function initialize() {
    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    };
    
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    getLoc(map);
    
    var input = (document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox((input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', searchPlacesChangedGetter(searchBox));

    google.maps.event.addListener(map, 'click', function(pos) {
        var x = pos.latLng.lat()
        var y = pos.latLng.lng()
        close_info_window()
        var data = addImage(x, y, 1000)
        gett(x, y, function(content, radius) {
            data[0].setContent(content)
            data[1].setRadius(radius)
            setTimeout(function () {
                     //Someone can close "Loading" window, so we shouldn't do anything
                    if (opened_info_window == data[0])
                        google.maps.event.trigger(data[2], 'click');
                }, 500); //Waiting for pics to load
            });
        });
}

google.maps.event.addDomListener(window, 'load', initialize);
