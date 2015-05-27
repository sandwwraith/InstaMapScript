//------ Workaround
function gett(lat, longt) {
    var url = "https://api.instagram.com/v1/media/search?lat=" + lat + "&lng=" + longt + "&client_id=73e1055ac2ad4799887538583f2249ef";
    $.ajax({
        url: url,
        type: "GET",
        async:true,
        dataType: "jsonp",
        success: callBackk(lat,longt),
        error: show_error
    });
}

function callBackk(lat,longt) {

    return function (data, testStatus, request) {
        getPictures(data,lat,longt);
    };

}

function show_error() {
    alert("BANG");
}

//-----------
function bubblesort(arr) {
    //var arr = mass;
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
    if (arr.meta.code!=200) show_error();
    arr = arr.data;
    //alert(arr.length);
    var urls = [];
    console.log(arr.length);

    bubblesort(arr);
    //alert(arr[0].likes.count);
    for (var i = 0;i<arr.length;i++) {
        urls[i] = arr[i].images.low_resolution;
        console.log(urls[i].url);
        console.log(arr[i].likes.count)
    }
    //$('#theDiv').prepend($('<img>',{id:'theImg',src:urls[0].url}))
    for (var i = 0; i< 7; i++) {
        $('#theDiv').append($('<img>',{class:'theImg',src:urls[i].url, title: arr[i].likes.count + " Likes"}))
    }

    var popular = getTags(arr);
    var tgs = [];
    //var str = "#" + popular[0][0] + " (" + popular[0][1]+ ")";
    for (var i = 0;i<popular.length;i++) {
        tgs[i] = "#" + popular[i][0] + " (" + popular[i][1]+")"
    }


    $('table').append("<tr><td>Most polpular tags: " + tgs.slice(0,4).join(", ") + "</td></tr>")
    //$('body').append($('<img>',{class:'theImg',src:urls[1].url}))
    //$('body').append($('<img>',{class:'theImg',src:urls[2].url}))
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

//alert(10);
gett(48.858844,2.294351);

