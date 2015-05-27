 $(function() {
            $( document ).tooltip({
                position: {my: "center top+15", at: "center bottom", collision: "flipfit"}
            });
        });

var map;
var markers = [];
var opened_info_window;
var opened_circle;        //TODO: not good global vars, refactor
function addImage(lat, lng, contentString) {
    var marker = new google.maps.Marker({position: {lat: lat, lng: lng},
                                          animation: google.maps.Animation.DROP,
                                          map: map,
                                          });

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var circle = new google.maps.Circle({center: marker.getPosition(),
                            map: map,
                            radius: 2000,
                            visible: false,
                            fillColor: '#33B5E5',
                            strokeColor: '#0099CC',
                            strokeWeight: 2,
                            strokeOpacity: 0.8});

    google.maps.event.addListener(marker, 'click', function() {
        google.maps.event.addListener(infowindow, 'closeclick', function() {
            circle.setVisible(false)
        });
        close_info_window()
        infowindow.open(map, marker)
        opened_info_window = infowindow
        opened_circle = circle
        circle.setVisible(true)
        map.panTo(marker.getPosition())
    });
    return marker;
}

function close_info_window() {
    if (opened_info_window !== undefined)
        opened_info_window.close();
    if (opened_circle !== undefined)
        opened_circle.setVisible(false);
}

function initialize() {
    var mapOptions = {
        center: { lat: 59.956406877802756, lng: 30.30924081802368},
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var input = /** @type {HTMLInputElement} */(document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
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
    });


    google.maps.event.addListener(map, 'click', function(pos) {
        var x = pos.latLng.lat()
        var y = pos.latLng.lng()
        close_info_window()
        gett(x, y, addImage)
    });
}
google.maps.event.addDomListener(window, 'load', initialize);