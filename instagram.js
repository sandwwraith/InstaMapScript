
function gett(lat, longt, func, dist) {
    if (dist === undefined) dist = 1000;
    console.log("Dist: " + dist);
    var url = "https://api.instagram.com/v1/media/search?lat=" + lat + "&lng=" + longt + "&distance=" + dist+ "&client_id=73e1055ac2ad4799887538583f2249ef";
    $.ajax({
        url: url,
        type: "GET",
        async: true,
        dataType: "jsonp",
        success: callBackk(lat, longt, func, dist),
        error: show_error
    });
}

function callBackk(lat, longt, func, dist) {
    return function (data, testStatus, request) {
        var res = getPictures(data, dist);
         if (res.code == -1) {
             // No pics
             if (dist >= 5000) { 
                res.str =  "<b>Sorry, no photos in this location</b>";
             }  else {
                 console.log("Increasing dist...");
                 gett(lat,longt,func,dist+1000);
                 return;
             }         
        } else if (res.code == -2) {
            res.str = "<b>Sorry, invalid response code from Instagram API: " +res.return_code +  " </b>";
        }
        //Finally
        func(res.str, dist);
            
    };
}

function show_error() {
    alert("Something went wrong, sorry....");
}

function getPictures(arr, dist) {
    if (arr.meta.code != 200) {
        return {code: -2, return_code: arr.meta.code};
    }
    arr = arr.data;
    console.log("Total pictures: " + arr.length);
    if (arr.length == 0 || (arr.length < 10 && dist < 5000)) //No pictures or we can try to grab more
        return {code: -1};
    var urls = [];

    //Sorting by likes
    arr.sort(function (a,b) {
       return b.likes.count-a.likes.count; 
    });

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
        tgs[i] = '<a href="http://websta.me/tag/' + encodeURI(popular[i][0]) + '?vm=grid3" target="_blank">#' + popular[i][0] + '</a>(' + popular[i][1] + ")";
    }
    
    if (tgs.length > 0) {
        res += '</td><tr><td>Most popular tags: ' + tgs.slice(0, 4).join(", ") + '</td><tr>';
    } else {
        res += '</td><tr><td>Oops, no tags :(</td></tr>';
    }
    res+='</table>';
    return {str: res, code: 0};
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
