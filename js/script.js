/*
apiKey = '99926ef1bc71ccb69ab73d46f0242e77'
googlekey = AIzaSyALjRBDr7FcTX0HtgMDQT-JW99pCFHXd5Y
*/
// https://api.forecast.io/forecast/b4d8165ef873cfaea7b62c77bf195dae/LATITUDE,LONGITUDE
var KEY = '99926ef1bc71ccb69ab73d46f0242e77',
    KEY_g = 'AIzaSyALjRBDr7FcTX0HtgMDQT-JW99pCFHXd5Y',
    BASE_URL = 'https://api.forecast.io/forecast/',
    BASE_URL_g = 'https://maps.googleapis.com/maps/api/geocode/json?address=',
    BASE_url_g_rev = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='


var searchContainer = document.querySelector('#searchCity')
var buttonsContainer = document.querySelector('#buttons')
var viewNode = document.querySelector('#view')

var locationReader = function(geoPos) {
    console.log('got geo pos')
    location.hash = geoPos.coords.latitude + '/' + geoPos.coords.longitude + '/current'
    console.log('location>>>>>>>>>' + location.hash)
}

var errorHandler = function(error) {
    console.log(error)
}

var hashToObject = function() {
    var hashRoute = location.hash.substr(1)
    var hashParts = hashRoute.split('/')
    return {
        lat: hashParts[0],
        lng: hashParts[1],
        viewType: hashParts[2]
    }
}



var objmap = {
    "clear-day":Skycons.CLEAR_DAY,
    "partly-cloudy-day": Skycons.PARTLY_CLOUDY_DAY,
    "partly-cloudy-night" : Skycons.PARTLY_CLOUDY_NIGHT,
    "sun": Skycons.CLEAR_DAY,
    "clear-night": Skycons.CLEAR_NIGHT,
    "snow": Skycons.SNOW,
    "sleet": Skycons.SLEET,
    "wind": Skycons.WIND,
    "rain": Skycons.RAIN,
    "cloudy": Skycons.CLOUDY,
    "fog": Skycons.FOG
}

var renderCurrent = function(objData){

    var temperature = Math.floor(objData.currently.temperature)

    viewNode.innerHTML = '<h1>' + temperature + '</h1>'  + '<div><canvas id="' + objData.currently.icon + '" width="120" height="120">' + '</canvas></div>'

    var v = new Skycons({"color" : "white"});
    v.add(objData.currently.icon, objmap[objData.currently.icon])
    v.play()
  }

var renderDailyView = function(objData){


 viewNode.innerHTML = ''
 var mon = new Skycons({"color" : "white"});

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    var date = new Date()
    var today = date.getDay()
    var nextWeek = [days[today+1], days[today+2], days[today+3], days[today+4], days[today+5], days[today+6], days[today+7]]


    for(var i= 1; i < 8; i++){

        var tempMax = Math.floor(objData.daily.data[i].temperatureMax)
        var tempMin = Math.floor(objData.daily.data[i].temperatureMin)

        viewNode.innerHTML += '<h1 id="daily">' + nextWeek[i-1] + ' : ' + tempMin + '~' + tempMax + '</h1>' + '<div><canvas id="day' + i + '" width="90" height="90">' + '</canvas></div>'


    }

    mon.add("day1", objmap[objData.daily.data[1].icon])
    mon.play()
    mon.add("day2", objmap[objData.daily.data[2].icon])
    mon.play()
    mon.add("day3", objmap[objData.daily.data[3].icon])
    mon.play()
    mon.add("day4", objmap[objData.daily.data[4].icon])
    mon.play()
    mon.add("day5", objmap[objData.daily.data[5].icon])
    mon.play()
    mon.add("day6", objmap[objData.daily.data[6].icon])
    mon.play()
    mon.add("day7", objmap[objData.daily.data[7].icon])
    mon.play()

}


//decidind the time slot in the day : morning, afternoon, evening or night

var date = new Date()
//var userLng = 0
//  testing for timezone
/*var x = 0
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    x =  position.coords.longitude
    return x
}

console.log(x)
*/
var slots = ["morning", "afternoon", "evening", "night"]

var hour = date.getHours()

var decideTime = function(hour){
    if ((hour >= 6) && (hour < 12)){
        return 0
    }
    else if (hour >= 12 && hour <18){
        return 1
    }
    else if (hour>=18 && hour <=23){
        return 2
    }
    else{
    return 3
    }
}

// create an array of the next 4 periods of the day
var nextSlot = [slots[(decideTime(hour)+1)%4], slots[(decideTime(hour)+2)%4], slots[(decideTime(hour)+3)%4], slots[decideTime(hour)%4]]


var renderHourlyView = function(objData){

 viewNode.innerHTML = ''
 var slothour = new Skycons({"color" : "white"});


var temp1 = Math.floor(objData.hourly.data[6].temperature)
var temp2 = Math.floor(objData.hourly.data[12].temperature)
var temp3 = Math.floor(objData.hourly.data[18].temperature)
var temp4 = Math.floor(objData.hourly.data[24].temperature)



        viewNode.innerHTML = '<h1 id="hourly">' + nextSlot[0] + ': ' + temp1 + '</h1>' + '<div><canvas id="slot1" width="80" height="80">' + '</canvas></div>' +  '<h1 id="hourly">' + nextSlot[1] + ': ' + temp2 + '</h1>' + '<div><canvas id="slot2" width="80" height="80">' + '</canvas></div>' +  '<h1 id="hourly">' + nextSlot[2] + ': ' + temp3 + '</h1>' + '<div><canvas id="slot3" width="80" height="80">' + '</canvas></div>' +  '<h1 id="hourly">' + nextSlot[3] + ': ' + temp4 + '</h1>' + '<div><canvas id="slot4" width="80" height="80">' + '</canvas></div>'


    slothour.add("slot1", objmap[objData.hourly.data[6].icon])
    slothour.play()
    slothour.add("slot2", objmap[objData.hourly.data[12].icon])
    slothour.play()
    slothour.add("slot3", objmap[objData.hourly.data[18].icon])
    slothour.play()
    slothour.add("slot4", objmap[objData.hourly.data[24].icon])
    slothour.play()

}


var controller = function() {
    if (!location.hash) {
        navigator.geolocation.getCurrentPosition(locationReader,errorHandler)
        return
    }
    var hashData = hashToObject()
    var weatherPromise = fetchData(hashData.lat,hashData.lng)
    if (hashData.viewType === "current") {
         weatherPromise.then(renderCurrent)
    }
    if (hashData.viewType === "daily") {
         weatherPromise.then(renderDailyView)
    }
    if (hashData.viewType === "hourly") {
         weatherPromise.then(renderHourlyView)
    }
}

var fetchData = function(lat,lng) {
    var url = BASE_URL + KEY + '/' + lat + ',' + lng
    var promise = $.getJSON(url)
    return promise
}

var handleViewSwitch = function(eventObject) {
    var buttonEl = eventObject.target
    var viewType = buttonEl.value
    if (!viewType) {
        return
    }
    var hashData = hashToObject()
    location.hash = hashData.lat + '/' + hashData.lng + '/' + viewType
    console.log(location.hash)
}

var getCoordinates  = function(e){
    if (e.keyCode === 13) {
    var buttonEl = e.target
    var city = buttonEl.value
    buttonEl.value = ''

    var urlGoogle = BASE_URL_g + city + '&key=' + KEY_g
    console.log(urlGoogle)
    var promiseGoogle = $.getJSON(urlGoogle)
    promiseGoogle.then(assignCoord)

}
}

var assignCoord = function(objCoord){
   console.log(objCoord.results[0].geometry.location)
    var lat = objCoord.results[0].geometry.location.lat
    var lng = objCoord.results[0].geometry.location.lng
    location.hash = lat + '/' + lng + '/current'
    findCity()
}

var findCity = function(){
    var hashData = hashToObject()
    var lat = hashData.lat
    var lng = hashData.lng
    var url_reverse = BASE_URL_g + lat + ',' + lng + '&key' + KEY_g
    var promiseReverse = $.getJSON(url_reverse)
    promiseReverse.then(writeCity)
}

var writeCity = function(objCity){
    console.log(objCity.results[0])
    searchContainer.placeholder=objCity.results[0].address_components[3].long_name

}

buttonsContainer.addEventListener('click',handleViewSwitch)

searchContainer.addEventListener('keydown', getCoordinates)
findCity()
window.addEventListener('hashchange',controller)
controller()
