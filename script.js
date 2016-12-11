//idea separate arrays for markers and parksVisited. markers is physical markers collection for map and parksVisited is a list of indexes of the parks in order


//template

//purpose:
//param: none
//local: none
//global: none
//functions called: none
//returns: none


var firstCardClicked = null;
var secondCardClicked = null;
var totalPossibleMatches = 9;
 // var totalPossibleMatches = 2;        //temp while testing

var matches = 0;           //incrementer for the number of matches found
var attempts = 0;          //incrementer for the number of attempted matches
var accuracy = 0;          //ratio of the number of matches to attempts
var distanceTraveled = 0;   //distance between the matched parks
var gamesPlayed = 0;      //the number of times the game has been played

//variables relating to the map feature
var markers = [];
var parksVisited = [];
var npsLogo = null;
var map = null;
var firstPark = null;
var currentPark = null;

var directionsService;
var directionsDisplay;

//array of national parks and their positions in geocoded form
var parks = [
    {officialName: 'acadia national park', name: 'acadia', pos: {lat: 44.338556, lng: -68.273335}, placeId: 'ChIJJSmiDrKjrkwRhFVV_A4i32I'},
    {officialName: 'arches national park', name: 'arches', pos: {lat: 38.733081, lng: -109.592514}, placeId: 'ChIJUaoNhhr2yoARlcQo0WnqQk8'},
    {officialName: 'everglades national park', name: 'everglades', pos: {lat: 25.286615, lng: -80.89865}, placeId: 'ChIJldex4mqr0IgRPtkgx65AyR8'},
    {name: 'grandCanyon', pos: {lat: 36.106965, lng: -112.112997}},
    {name: 'hotSprings', pos: {lat: 34.521692, lng: -93.042354}},
    {name: 'olympic', pos: {lat: 47.802107, lng: -123.604352}},
    {name: 'shenandoah', pos: {lat: 38.292756, lng: -78.679584 }},
    {name: 'yellowstone', pos: {lat: 44.427968, lng: -110.588454}},
    {name: 'yosemite', pos: {lat: 37.865101, lng: -119.538329}},
];

 //purpose: set up the game board when the document is loaded
 //param: none
 //local: none
 //global: none
 //functions called: initializeGame
 //returns: none
 $(document).ready(function () {
     initializeGame();
 });


 //purpose: generates the game board by dynamically building cards from divs and assigning images randomly
 //param: none
 //local: initArray, randomIndex, valueFromArray, singleCard
 //global: none
 //functions called: createInitialArray, createSingleCard
 //returns: none
 function initializeGame(){
     totalPossibleMatches = 3;        //normal 9 but temp 3 while testing waypoints

     matches = 0;
     attempts = 0;
     accuracy = 0;
     distanceTraveled = 0;

     firstCardClicked = null;
     secondCardClicked = null;

     // currentPark = null;
     markers = [];
     parksVisited = [];
     // map = $('#map');
     // map = new google.maps.Map($('#map-canvas')[0], options);
     // map = new google.maps.Map($('#map')[0], options);
     //****************prob change this******************
//what i want: 3 rows. within each row 6 divs with class card
// a div card, with div front and div back within. within div front an image. within div back an image
     var initArray = createInitialArray();      //create an array of numbers associated with the image on a card's front

     //as the for loop runs the length of initArray diminishes leaving us with an exit from the loop
     for(var i = 0; i < initArray.length;){
         var randomIndex = Math.floor(Math.random()*initArray.length);      //choose a random index from initArray
         var valueFromArray = initArray[randomIndex];                       //this random index points to a number associated with an image for the front of the card

         var singleCard = createSingleCard(valueFromArray);                    //create one card with the value associated with an image
         initArray.splice(randomIndex, 1);                                  //remove the randomly chosen number from the array

         $('#cardArea').append(singleCard);
     }
     applyEventHandlers();            //when the board is set up add the event handlers
 }

 //purpose: creates an array of doubled up numbers that will later point at an image for the front of a card
 //param: none
 //local: none
 //global: none
 //functions called: none
 //returns: initArray
 function createInitialArray() {
     var initArray = [];
     for(var i = 0; i < totalPossibleMatches; i++){
         for(var j = 0; j < 2; j++){
             initArray.push(i);
         }
     }
     return initArray;
 }

 //purpose: creates a card DOM element by appending images and divs with class to a div with class card
 //param: valueFromArray - a random number chosen from an array that identifies which picture the card front should have
 //local: imgSource, generatedCard, generatedFront, generatedBack
 //global: none
 //functions called: findImageSource
 //returns: generatedCard - the DOM element
function createSingleCard(valueFromArray){
    var imgSource = findImageSource(valueFromArray);
    var generatedCard = $('<div>').addClass('card');
    var generatedFront = $('<div>').addClass('front');
    var generatedBack = $('<div>').addClass('back');
    generatedFront.css('background-image', 'url(' + imgSource + ')');
    $(generatedCard).append(generatedFront, generatedBack);

    return generatedCard;
}

 //purpose: based on an input, determines which image a card's front should have
 //param: valueFromArray
 //local: none
 //global: none
 //functions called: none
 //returns: imageSource
function findImageSource(valueFromArray) {
    switch(valueFromArray){
        case 0:
            imageSource = 'resources/National_Park_Quarters/Acadia.png';
            break;
        case 1:
            imageSource = 'resources/National_Park_Quarters/Arches.png';
            break;
        case 2:
            imageSource = 'resources/National_Park_Quarters/Everglades.png';
            break;
        case 3:
            imageSource = 'resources/National_Park_Quarters/Grand_Canyon.png';
            break;
        case 4:
            imageSource = 'resources/National_Park_Quarters/Hot_Springs.png';
            break;
        case 5:
            imageSource = 'resources/National_Park_Quarters/Olympic.png';
            break;
        case 6:
            imageSource = 'resources/National_Park_Quarters/Shenandoah.png';
            break;
        case 7:
            imageSource = 'resources/National_Park_Quarters/Yellowstone.png';
            break;
        default:
            imageSource = 'resources/National_Park_Quarters/Yosemite.png';
    }
    return imageSource;
}

 //purpose: handles the events that either a div with class card is clicked or the reset button is clicked
 //param: none
 //local: none
 //global: none
 //functions called: clickedCard, resetGame
 //returns: none
function applyEventHandlers(){
    displayStats();
    $(".card").click(clickedCard($(this)));
    $('.reset').click(resetGame);
}

 //purpose: handles click events on divs with class card
 //param: none
 //local: thisCard- passes the card clicked
 //global: none
 //functions called: handleCardClicks
 //returns: none
 function clickedCard(cardElement){
     $(".card").click(function () {
         var thisCard = $(this);
         handleCardClicks(thisCard);
     });
 }

 //purpose: handles what to do when a card is clicked. This is the main handler. It will appropriately assign the first card or second card depending on what it is. Disables the click event while we figure out what to do with cards.
 //param: cardElement - div with class 'card' that was clicked in  clickedCard
 //local: none
 //global: firstCardClicked, secondCardClicked
 //functions called: cardIsMatchedAlready, checkForTwoCards
 //returns: none
 function handleCardClicks(cardElement){
     // cardElement.children('.back').css('display',"none");        //was initially enabled in working code

     if(!cardIsMatchedAlready(cardElement)) {   //is the card already part of a matched pair
         if (firstCardClicked === null) {         //is the first card empty
             cardElement.addClass('cardClicked');   //add flag stating the card has been clicked
             firstCardClicked = $(cardElement);   //assign the currently clicked card to the first card
         }
         else if (!cardElement.hasClass('cardClicked')) {       //has the card already been clicked/revealed
             secondCardClicked = $(cardElement);              //assign the currently clicked card to the second card
             cardElement.addClass('cardClicked');               //add flag stating the card has been clicked
             $('.card').off('click');                           //disables click while we check the two cards
         }
         checkForTwoCards();
     }
 }

 //purpose: check whether or not the currently clicked card is in a matched pair
 //param: cardElement - the card clicked
 //local: none
 //global: none
 //functions called: none
 //returns: the truth of whether or not the currently clicked card is in a matched pair
 function cardIsMatchedAlready(cardElement) {
     if(cardElement.hasClass('matched')){
         return true;
     } else{
         return false;
     }
 }

 //purpose: checks whether two cards were clicked. If two cards were clicked it will call a function to see if they are a match
 //param: none
 //local: none
 //global: firstCardClicked, secondCardClicked
 //functions called: checkForMatches
 //returns: none
 function checkForTwoCards(){
     if(firstCardClicked && secondCardClicked) {
         attempts++;
         checkForMatches();
     }
 }

 //purpose: function checks if the firstCardClicked and secondCardClicked are equal. Will call appropriate functions to reset the cards depending on whether or not the cards match
 //param: none
 //local: none
 //global: firstCardClicked, secondCardClicked
 //functions called: makeCardsMatch
 //                 makeCardsReappear
 //returns: none
 function checkForMatches() {
     if(firstCardClicked.find('.front').css('background-image') === secondCardClicked.find('.front').css('background-image')){
         setTimeout(makeCardsMatch, 500);      //time should be same as transition time for card flipping
     }else{
         setTimeout(makeCardsReappear, 2000);
     }
 }

 //purpose: Adds and removes classes to notify other functions that the two cards are part of a matching pair, then it resets the first and second card. Function will also invoke a function to check if the game has been won. Readies the click handler, as well
 //param: none
 //local: none
 //global: firstCardClicked, secondCardClicked, matches
 //functions called: gameIsWon, clickedCard, addMarkerToMap
 //returns: none
 function makeCardsMatch() {
     // console.log('cards match');        //leave for now
     // console.log(firstCardClicked);
     firstCardClicked.addClass('matched');
     secondCardClicked.addClass('matched');
     firstCardClicked.removeClass('cardClicked');
     secondCardClicked.removeClass('cardClicked');

     var transparency = $('<div>').addClass('card transparency');
     $(firstCardClicked).append(transparency);
     transparency = $('<div>').addClass('card transparency');
     $(secondCardClicked).append(transparency);

     // //trying this out here
     // directionsService = new google.maps.DirectionsService;
     // directionsDisplay = new google.maps.DirectionsRenderer;

     var parkIndex = findArrayIndexFromImage(firstCardClicked.find('.front').css('background-image'));
     // if(matches === 0){
     //     firstPark = parkIndex;
     //     currentPark = parkIndex;
     //     //no route available if current park is the first park
     // }else{
     //     currentPark = parkIndex;
     // }

     //prob combine all these compenents into an update map function
     parksVisited.push(parkIndex);

     //add method to add marker to the map here
     //also pushes a marker to the markers array
     addMarkerToMap(parkIndex);

     if(parksVisited.length > 1) {
         calculateAndDisplayRoute(directionsService, directionsDisplay);
     }

     firstCardClicked = null;
     secondCardClicked = null;
     matches++;                                     //watch in debug
     displayStats();
     clickedCard();                                //readies click handler again
     gameIsWon();
 }


 //purpose: Makes cards clickable and card backs visible after it has been determined that the cards do not match, then it resets the first and second card. Readies the click handlier again.
 //param: none
 //local: none
 //global: firstCardClicked, secondCardClicked
 //functions called: clickedCard
 //returns: none
 function makeCardsReappear() {
     firstCardClicked.removeClass('cardClicked');
     secondCardClicked.removeClass('cardClicked');
     firstCardClicked = null;
     secondCardClicked = null;
     displayStats();
     clickedCard();                                //readies click handler again
 }

 //purpose: checks with the game is won
 //param: none
 //local: none
 //global: matches, totalPossibleMatches
 //functions called: none
 //returns: none
 function gameIsWon() {
     if(matches === totalPossibleMatches){
         // console.log('winner');
         $("#gameWon").css('display','initial');
         // $("#gameWon").css('display','inline-block');
     }
 }

 //purpose: displays the user's statistics of the game including games played, attempts, and accuracy
 //param: none
 //local: none
 //global: gamesPlayed, attempts, matches, accuracy
 //functions called: calculateAccuracy
 //returns: none

 //notes: need to figure out good place to call this???? onready???????
 //notes: the values are never updated///yet/// i need to figure out where to update them// so that i can have a value for the accuracy
 function displayStats() {
     // console.log('stats are to be displayed');
     calculateAccuracy();
     $('.gamesPlayed .value').text(gamesPlayed);
     $('.attempts .value').text(attempts);
     $('.accuracy .value').text(accuracy);
     $('.distance .value').text(distanceTraveled);
 }

 //purpose: calculates the user's accuracy. If the attempts are zero, it sets the accuracy to zero to prevent dividing by zero
 //param: none
 //local: none
 //global: attempts, matches, accuracy
 //functions called: none
 //returns: none
 function calculateAccuracy(){
     if(attempts === 0){
         accuracy = 0 + "%";
     }else{
         accuracy = Math.floor((matches / attempts) *100) + "%";
     }
 }

 //purpose: resets the games features to the original state, i.e. cards flipped over, stats reset, win state removed. Also increments the gamesPlayed by one
 //param: none
 //local: none
 //global: none
 //functions called: resetStats, displayStats
 //returns: none
 function resetGame(){
     gamesPlayed++;
     resetStats();
     displayStats();

     $('#cardArea').empty();

     // $('.back').css('display', 'initial');                  //makes all card back reappear
     // $('.card').removeClass('cardClicked matched');         //makes all cards clickable once more by removing 'cardClicked' and 'matched' classes
     $('.card').off('click');                               //temporarily removes all click handlers, so that they won't fire twice when restarted
     // $('.card').click(clickedCard($(this)));                //adds the click handler for the 'card' class  //click handlers applied when new game board generated
     // firstCardClicked = null;
     // secondCardClicked = null;
     $('#gameWon').css('display', 'none');                  //reset win features        //will need to be placed outside of cardArea
     // removeMarkersFromMap();
     //
     initMap();

     $('.reset').off('click');
     initializeGame();
 }

 //purpose: calculates the user's statistics of the game, namely accuracy
 //param: none
 //local: none
 //global: attempts, matches, accuracy
 //functions called: calculateAccuracy, displayStats
 //returns: none
 function resetStats() {
     matches = 0;
     attempts = 0;
     distanceTraveled = 0;
     calculateAccuracy();
     displayStats();
 }



//purpose: initializes google map
function initMap() {
    // var CenterOfUSA = {lat: 38, lng: -97.5};
    var CenterOfUSA = {lat: 38, lng: -100};
    //var CenterOfUSA = {lat: 39.828127, lng: -98.579404};  //old

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: CenterOfUSA,
        disableDefaultUI: true
    });

    markers = [];
    parksVisited = [];
    npsLogo = {
        url: 'resources/nps_logo_transparent_tiny.png'
    };

    // for(var i = 0; i < parks.length; i++){
    //     var park = new google.maps.Marker({
    //         position: parks[i]['pos'],
    //         map: map,
    //         icon: npsLogo
    //     });
    // }

    // var acadia_marker = new google.maps.Marker({
    //     position: parks[0]['pos'],
    //     map: map,
    //     icon: npsLogo
    // });
    map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
}

//purpose: adds a marker to the map for the designated park
//param: none
//local: none
//global: none
//functions called: none
//returns: none
function addMarkerToMap(parkIndex){

    var new_marker = new google.maps.Marker({
        position: parks[parkIndex]['pos'],
        map: map,
        animation: google.maps.Animation.DROP,
        icon: npsLogo
    });
    markers.push(new_marker);
}

//purpose:
//param: none
//local: none
//global: none
//functions called: none
//returns: none
function removeMarkersFromMap(){
    setMapOnAll(null);
    markers = [];
    // parksVisited = []; //not necessary here
}


//purpose: based on an image source, determines which index in the park array to grab
//param: imageSrc
//local: none
//global: none
//functions called: none
//returns: index (the index in the parks array associated with the image)
function findArrayIndexFromImage(imageSrc) {
    var index = null;
    switch(true){
        case /(.+)Acadia(.+)/.test(imageSrc):
        // case 'resources/National_Park_Quarters/Acadia.png':
            index = 0;
            break;
        case /(.+)Arches(.+)/.test(imageSrc):
        // case 'resources/National_Park_Quarters/Arches.png':
            index = 1;
            break;
        case /(.+)Everglades(.+)/.test(imageSrc):
            index = 2;
            break;
        case /(.+)Grand_Canyon(.+)/.test(imageSrc):
            index = 3;
            break;
        case /(.+)Hot_Springs(.+)/.test(imageSrc):
            index = 4;
            break;
        case /(.+)Olympic(.+)/.test(imageSrc):
            index = 5;
            break;
        case /(.+)Shenandoah(.+)/.test(imageSrc):
            index = 6;
            break;
        case /(.+)Yellowstone(.+)/.test(imageSrc):
            index = 7;
            break;
        default:
            index = 8;
    }
    return index;
}

//distances between parks gathered from Google Maps
function getDistanceBetweenParks(park1, park2) {

}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    if(parksVisited.length > 2){
        for(var i = 1; i < parksVisited.length - 1; i++){
            // console.log('parksVisited: ', parksVisited);
            console.log('pos: ', parks[parksVisited[i]]['pos']);
            waypts.push({
                // location: parks[parksVisited[i]]['pos'],
                location: parks[parksVisited[i]]['officalName'],        //alternate
                stopover: true
            });
        }
    }
    // var checkboxArray = document.getElementById('waypoints');
    // for (var i = 0; i < parksVisited.length; i++) {
    //     waypts.push({
    //         location: parks[index]['pos'],
    //         stopover: true
    //     });
        // if (checkboxArray.options[i].selected) {
        //     waypts.push({
        //         location: checkboxArray[i].value,
        //         stopover: true
        //     });
        // }
    // }

    directionsService.route({
        //find out how this origin and destination is stored (is it an id or a location object)
        origin: parks[parksVisited[0]]['placeId'],
        destination: parks[parksVisited[parksVisited.length - 1]]['placeId'],
        // waypoints: waypts,
        travelMode: 'DRIVING',
        // optimizeWaypoints: false,


        // origin: LatLng | String | google.maps.Place,         //NOT SURE IF THIS IS RIGHT
        // destination: LatLng | String | google.maps.Place,    //NOT SURE IF THIS IS RIGHT
        // travelMode: 'DRIVING',
        // transitOptions: {},      //NOT NECESSARY WHEN TRAVEL_MODE IS 'DRIVING'
        // drivingOptions: DrivingOptions,  //PREMIUM ONLY??
        // unitSystem: UnitSystem,     //PROB WON'T BE NECESSARY
        // waypoints[]: DirectionsWaypoint,
        // optimizeWaypoints: Boolean,
        // provideRouteAlternatives: Boolean,
        // avoidHighways: Boolean,
        // avoidTolls: Boolean,
        // region: String
    }, function(response, status) {
        console.log('direction service.route');
        // console.log('origin: ', parks[parksVisited[0]]['placeId']);
        // console.log('destination: ', parks[parksVisited[parksVisited.length - 1]]['placeId']);
        console.log('origin: ', parks[parksVisited[0]]['officalName']);                                 //alternate
        console.log('destination: ', parks[parksVisited[parksVisited.length - 1]]['officialName']);     //alternate
        console.log(response);
        console.log(status);
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                // summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                //     '</b><br>';
                // summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                // summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}