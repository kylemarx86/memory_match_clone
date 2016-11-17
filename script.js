
//template

//purpose:
//param: none
//local: none
//global: none
//functions called: none
//returns: none


 var firstCardClicked = null;
 var secondCardClicked = null;
 // var totalPossibleMatches = 9;
 var totalPossibleMatches = 3;        //temp while testing

 var matches = 0;           //incrementer for the number of matches found
 var attempts = 0;          //incrementer for the number of attempted matches
 var accuracy = 0;          //ratio of the number of matches to attempts
 var gamesPlayed = 0;      //the number of times the game has been played

 //purpose: set up the game board when the document is loaded
 //param: none
 //local: none
 //global: none
 //functions called: generateGameBoard
 //returns: none
 $(document).ready(function () {
     generateGameBoard();
 });


 //purpose: generates the game board by dynamically building cards from divs and assigning images randomly
 //param: none
 //local: initArray, randomIndex, valueFromArray, singleCard
 //global: none
 //functions called: createInitialArray, createSingleCard
 //returns: none
 function generateGameBoard(){
//what i want: 3 rows. within each row 6 divs with class card
// a div card, with div front and div back within. within div front an image. within div back an image
     var initArray = createInitialArray();      //create an array of numbers associated with the image on a card's front

     //as the for loop runs the length of initArray diminishes leaving us with an exit from the loop
     for(var i = 0; i < initArray.length;){
         var randomIndex = Math.floor(Math.random()*initArray.length);      //choose a random index from initArray
         var valueFromArray = initArray[randomIndex];                       //this random index points to a number associated with an image for the front of the card

         var singleCard = createSingleCard(valueFromArray);                    //create one card with the value associated with an image
         initArray.splice(randomIndex, 1);                                  //remove the randomly chosen number from the array

         $('#game-area').append(singleCard);
         // //idea: base the row to append the cards to on the length of the init array. As more cards are removed we should be getting into later rows
         // if(Math.floor(initArray.length / 6) === 2){
         //     $('div.row1').append(singleCard);
         // }else if(Math.floor(initArray.length /6) === 1){
         //     $('div.row2').append(singleCard);
         // }else{
         //     $('div.row3').append(singleCard);
         // }
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
         attempts++;                                //watch in debug
         displayStats();
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
     // console.log(firstCardClicked.find('.front'));
     // console.log(secondCardClicked.find('.front'));
     // console.log(firstCardClicked.css('background-image'));
     // console.log(secondCardClicked.css('background-image'));
     console.log(firstCardClicked.find('.front').css('background-image'));
     console.log(secondCardClicked.find('.front').css('background-image'));
     if(firstCardClicked.find('.front').css('background-image') === secondCardClicked.find('.front').css('background-image')){
         //here's the set time out that Scott told me to look at

         setTimeout(makeCardsMatch, 500);      //time should be same as transition time for card flipping
     }else{
         setTimeout(makeCardsReappear, 2000);
     }
 }

 //purpose: Adds and removes classes to notify other functions that the two cards are part of a matching pair, then it resets the first and second card. Function will also invoke a function to check if the game has been won. Readies the click handler, as well
 //param: none
 //local: none
 //global: firstCardClicked, secondCardClicked, matches
 //functions called: gameIsWon, clickedCard
 //returns: none
 function makeCardsMatch() {
     // console.log('cards match');        //leave for now
     firstCardClicked.addClass('matched');
     secondCardClicked.addClass('matched');
     firstCardClicked.removeClass('cardClicked');
     secondCardClicked.removeClass('cardClicked');
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
     // firstCardClicked.find('.back').css('display','initial');      //worked for img tags
     // secondCardClicked.find('.back').css('display','initial');
     firstCardClicked.removeClass('cardClicked');
     secondCardClicked.removeClass('cardClicked');
     firstCardClicked = null;
     secondCardClicked = null;
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
         $("#gameWon").css('display','initial');
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
     $('.games-played .value').text(gamesPlayed);
     $('.attempts .value').text(attempts);
     $('.accuracy .value').text(accuracy);
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
     $('.back').css('display', 'initial');                  //makes all card back reappear
     $('.card').removeClass('cardClicked matched');         //makes all cards clickable once more by removing 'cardClicked' and 'matched' classes
     $('.card').off('click');                               //temporarily removes all click handlers, so that they won't fire twice when restarted
     $('.card').click(clickedCard($(this)));                //adds the click handler for the 'card' class
     firstCardClicked = null;
     secondCardClicked = null;
     $('#gameWon').css('display', 'none');                  //reset win features
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
     calculateAccuracy();
     displayStats();
 }