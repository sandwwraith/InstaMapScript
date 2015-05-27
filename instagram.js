//------ Workaround
function gett(lat, longt, func) {
    var url = "https://api.instagram.com/v1/media/search?lat=" + lat + "&lng=" + longt + "&client_id=73e1055ac2ad4799887538583f2249ef";
    $.ajax({
        url: url,
        type: "GET",
        async: true,
        dataType: "jsonp",
        success: callBackk(lat,longt, func),
        error: show_error
    });
}

function callBackk(lat,longt, func) {
    return function (data, testStatus, request) {
        var res = getPictures(data,lat,longt);
        if (res != -1) {
            var marker = func(lat, longt, res)
            setTimeout(function() {
                google.maps.event.trigger(marker, 'click');
            }, 600)
        }
    };
}

function show_error() {
    alert("BANG");
}

//-----------
function heapsort(mass) {
    var arr = mass;
    for (var i = 0;i<arr.length;i++) {
        for (var j = 0; j<arr.length - i - 1; j++) {
            if (arr[j].likes.count < arr[j+1].likes.count){
                var t = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = t;
            }
        }
    }
}

function getPictures(arr,lat,longt) {
    if (arr.meta.code!=200) {
        //show_error();
        return -1;
    }
    arr = arr.data;
    if (arr.length == 0)
        return -1;

    var urls = [];
    console.log(arr.length);

    heapsort(arr);

    for (var i = 0;i<arr.length;i++) {
        urls[i] = arr[i].images.low_resolution;
    }

    var res = '<table><tr><td class="theDiv">'
    //$('#theDiv').prepend($('<img>',{id:'theImg',src:urls[0].url}))
    for (var i = 0; i < urls.length && i < 10; i++) {
        res += '<a href="' + arr[i].link + '" target="_blank"><img class="theImg" title="' + arr[i].likes.count + ' Likes" src=' + urls[i].url + '></img></a>'
    }


    var popular = getTags(arr);
    var str = "#" + popular[0][0] + " (" + popular[0][1]+ ")";
    res += '</td><tr><td>Most popular tags: ' + str + '</td><tr>'
    return res;
}

function getTags(arr) {
    var gtags = [];
    for (var i = 0;i<arr.length;i++) {
        for (var j = 0; j<arr[i].tags.length; j++) {
            if (gtags[arr[i].tags[j]]!==undefined) {
                gtags[arr[i].tags[j]]++;
            }
            else {
                gtags[arr[i].tags[j]] = 1;
            }
        }
    }
    //Searching popular
    /*var max = -1;
    var str = "No popular";
    for (var cc in gtags) {
        if (gtags[cc] > max) {
            max = gtags[cc];
            str = cc;
        }
    };*/

var sortable = [];
for (var vehicle in gtags)
    sortable.push([vehicle, gtags[vehicle]]);
    sortable.sort(function(a, b) {return b[1] - a[1]})
    return sortable;
}
