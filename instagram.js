
function gett(lat, longt, func) {
    var url = "https://api.instagram.com/v1/media/search?lat=" + lat + "&lng=" + longt + "&distance=2000&client_id=73e1055ac2ad4799887538583f2249ef";
    $.ajax({
        url: url,
        type: "GET",
        async: true,
        dataType: "jsonp",
        success: callBackk(lat, longt, func),
        error: show_error
    });
}

function callBackk(lat, longt, func) {
    return function (data, testStatus, request) {
        var res = getPictures(data, lat, longt);
        if (res != -1) {
            var marker = func(lat, longt, res)
            setTimeout(function () {
                google.maps.event.trigger(marker, 'click');
            }, 600)
        }
    };
}

function show_error() {
    alert("Something went wrong, sorry....");
}

//-----------
function bubblesort(mass) {
    var arr = mass;
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            if (arr[j].likes.count < arr[j + 1].likes.count) {
                var t = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = t;
            }
        }
    }
}

function getPictures(arr, lat, longt) {
    if (arr.meta.code != 200) {
        return -1;
    }
    arr = arr.data;
    if (arr.length == 0)
        return -1;
    var urls = [];
    console.log("Total pictures: " + arr.length);

    bubblesort(arr);

    for (var i = 0; i < arr.length; i++) {
        urls[i] = arr[i].images.low_resolution;
    }
    
    //Adding imgs
    var res = '<table><tr><td class="theDiv">';
    for (var i = 0; i < urls.length && i < 10; i++) {
        res += '<a href="' + arr[i].link + '" target="_blank"><img class="theImg" title="' + arr[i].likes.count + ' Likes" src=' + urls[i].url + '></img></a>';
    }

    //Adding tags
    var popular = getTags(arr);
    var tgs = [];
    for (var i = 0; i < popular.length; i++) {
        tgs[i] = "#" + popular[i][0] + " (" + popular[i][1] + ")";
    }

    res += '</td><tr><td>Most popular tags: ' + tgs.slice(0, 4).join(", ") + '</td><tr>';
    return res;
}

function getTags(arr) {
    var gtags = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].tags.length; j++) {
            if (gtags[arr[i].tags[j]] !== undefined) {
                gtags[arr[i].tags[j]]++;
            }
            else {
                gtags[arr[i].tags[j]] = 1;
            }
        }
    }

    var sortable = [];
    for (var tagg in gtags)
        sortable.push([tagg, gtags[tagg]]);
    sortable.sort(function (a, b) { return b[1] - a[1]; });
    return sortable;
}
