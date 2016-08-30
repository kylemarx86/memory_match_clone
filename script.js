 var first_card_clicked = null;
 var second_card_clicked = null;
 var total_possible_matches = 9;

 var matches = 0;           //incrementer for the number of matches found
 var attempts = 0;          //incrementer for the number of attempted matches
 var accuracy = 0;          //ratio of the number of matches to attempts
 var games_played = 0;      //the number of times the game has been played

 //purpose: apply the event handlers when the document is loaded
 //param: none
 //local: none
 //global: none
 //functions called: apply_event_handlers
 //returns: none
 $(document).ready(function () {
     generateGameBoard();
     apply_event_handlers;
 });



 //purpose: generates the game board by dynamically building cards from divs and assigning images randomly
 //param: none
 //local: initArray, randomArray, randomIndex, imgSource, generatedCard, generatedFront, generatedBack, generatedImg, backCardImg
 //global: none
 //functions called: none
 //returns: imageSource
 function generateGameBoard(){
//what i want: 3 rows. within each row 6 divs with class card
// a div card, with div front and div back within. within div front an image. within div back an image
     var initArray = [];
     var randomArray = [];

     //create subroutine out of this
     for(var i = 0; i < total_possible_matches; i++){
         for(var j = 0; j < 2; j++){
             initArray.push(i);
         }
     }

     //as the for loop runs the length of initArray diminishes leaving us with an exit from the loop
     for(var i = 0; i < initArray.length;){
         var randomIndex = Math.floor(Math.random()*initArray.length);
         var valueFromArray = initArray[randomIndex];

         var theCard = createOneCard(valueFromArray);

         initArray.splice(randomIndex, 1);

         //decide which row to place the card in
         //won't work because i never changes it is always 0.
         //I iterate through initArray by removing an element of the array with each pass
         if(Math.floor(i/6) === 0){
             $('div.row1').append(generatedCard);
         }else if(Math.floor(i/6) === 1){
             $('div.row2').append(generatedCard);
         }else{
             $('div.row3').append(generatedCard);
         }
     }
 }

 //purpose:
 //param: none
 //local: none
 //global: none
 //functions called: none
 //returns: none
 function createInitialArray(initialArray) {

 }

 //purpose:
 //param: none
 //local: none
 //global: none
 //functions called: none
 //returns: none
function createOneCard(valueFromArray){
    var theCardElt = null;
    var imgSource = findImageSource(valueFromArray);
    var generatedCard = $('<div>').addClass('card');
    var generatedFront = $('<div>').addClass('front');
    var generatedBack = $('<div>').addClass('back');
    var generatedImg = $('<img>');
    var backCardImg = $('<img>');

    generatedImg.attr('src', imgSource);
    backCardImg.attr('src', 'resources/nps_logo_transparent.png');


    $(generatedFront).append(generatedImg);
    $(generatedBack).append(backCardImg);
    $(generatedCard).append(generatedFront, generatedBack);

}


 //purpose:
 //param: none
 //local: none
 //global: none
 //functions called: none
 //returns: none










 //purpose: based on an input, determines which image a card's front should have
 //param: valueFromArray
 //local: none
 //global: none
 //functions called: none
 //returns: imageSource
function findImageSource(valueFromArray) {
    switch(valueFromArray){
        case 0:
            imageSource = 'resources/National_Park_Quarters/Acadia.jpg';
            break;
        case 1:
            imageSource = 'resources/National_Park_Quarters/Arches.jpg';
            break;
        case 2:
            imageSource = 'resources/National_Park_Quarters/Everglades.jpg';
            break;
        case 3:
            imageSource = 'resources/National_Park_Quarters/Grand_Canyon.jpg';
            break;
        case 4:
            imageSource = 'resources/National_Park_Quarters/Hot_Springs.jpg';
            break;
        case 5:
            imageSource = 'resources/National_Park_Quarters/Olympic.jpg';
            break;
        case 6:
            imageSource = 'resources/National_Park_Quarters/Shenandoah.jpg';
            break;
        case 7:
            imageSource = 'resources/National_Park_Quarters/Yellowstone.jpg';
            break;
        default:
            imageSource = 'resources/National_Park_Quarters/Yosemite.jpg';
    }
    return imageSource;
}

 //purpose: handles the events that either a div with class card is clicked or the reset button is clicked
 //param: none
 //local: none
 //global: none
 //functions called: card_clicked, reset_game
 //returns: none
function apply_event_handlers(){
    display_stats();
    $(".card").click(card_clicked($(this)));
    $('.reset').click(reset_game);
}

 //purpose: handles click events on divs with class card
 //param: none
 //local: thisCard- passes the card clicked
 //global: none
 //functions called: handleCardClicks
 //returns: none
 function card_clicked(cardElement){
     // display_stats();   //need to add to functions called???? is this correct placement?????
     $(".card").click(function () {
         var thisCard = $(this);
         handleCardClicks(thisCard);
     });
 }

 //purpose: handles what to do when a card is clicked. This is the main handler. It will appropriately assign the first card or second card depending on what it is. Disables the click event while we figure out what to do with cards.
 //param: cardElement - div with class 'card' that was clicked in  card_clicked
 //local: none
 //global: first_card_clicked, second_card_clicked
 //functions called: cardIsMatchedAlready, checkForTwoCards
 //returns: none
 function handleCardClicks(cardElement){
     cardElement.children('.back').css('display',"none");

     if(!cardIsMatchedAlready(cardElement)) {   //is the card already part of a matched pair
         if (first_card_clicked === null) {         //is the first card empty
             cardElement.addClass('cardClicked');   //add flag stating the card has been clicked
             first_card_clicked = $(cardElement);   //assign the currently clicked card to the first card
         }
         else if (!cardElement.hasClass('cardClicked')) {       //has the card already been clicked/revealed
             second_card_clicked = $(cardElement);              //assign the currently clicked card to the second card
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
 //global: first_card_clicked, second_card_clicked
 //functions called: checkForMatches
 //returns: none
 function checkForTwoCards(){
     if(first_card_clicked && second_card_clicked) {
         attempts++;                                //watch in debug
         display_stats();
         checkForMatches();
     }
 }

 //purpose: function checks if the first_card_clicked and second_card_clicked are equal. Will call appropriate functions to reset the cards depending on whether or not the cards match
 //param: none
 //local: none
 //global: first_card_clicked, second_card_clicked
 //functions called: makeCardsMatch
 //                 makeCardsReappear
 //returns: none
 function checkForMatches() {
     if(first_card_clicked.find('.front img').attr('src') === second_card_clicked.find('.front img').attr('src')){
         makeCardsMatch();
     }else{
         setTimeout(makeCardsReappear, 2000);
     }
 }

 //purpose: Adds and removes classes to notify other functions that the two cards are part of a matching pair, then it resets the first and second card. Function will also invoke a function to check if the game has been won. Readies the click handler, as well
 //param: none
 //local: none
 //global: first_card_clicked, second_card_clicked, matches
 //functions called: gameIsWon, card_clicked
 //returns: none
 function makeCardsMatch() {
     console.log('cards match');        //leave for now
     first_card_clicked.addClass('matched');
     second_card_clicked.addClass('matched');
     first_card_clicked.removeClass('cardClicked');
     second_card_clicked.removeClass('cardClicked');
     first_card_clicked = null;
     second_card_clicked = null;
     matches++;                                     //watch in debug
     display_stats();
     card_clicked();                                //readies click handler again
     gameIsWon();
 }

 //purpose: Makes cards clickable and card backs visible after it has been determined that the cards do not match, then it resets the first and second card. Readies the click handlier again.
 //param: none
 //local: none
 //global: first_card_clicked, second_card_clicked
 //functions called: card_clicked
 //returns: none
 function makeCardsReappear() {
     first_card_clicked.find('.back').css('display','initial');
     second_card_clicked.find('.back').css('display','initial');
     first_card_clicked.removeClass('cardClicked');
     second_card_clicked.removeClass('cardClicked');
     first_card_clicked = null;
     second_card_clicked = null;
     card_clicked();                                //readies click handler again
 }

 //purpose: checks with the game is won
 //param: none
 //local: none
 //global: matches, total_possible_matches
 //functions called: none
 //returns: none
 function gameIsWon() {
     if(matches === total_possible_matches){
         $("#gameWon").css('display','initial');
     }
 }

 //purpose: displays the user's statistics of the game including games played, attempts, and accuracy
 //param: none
 //local: none
 //global: games_played, attempts, matches, accuracy
 //functions called: calculate_accuracy
 //returns: none

 //notes: need to figure out good place to call this???? onready???????
 //notes: the values are never updated///yet/// i need to figure out where to update them// so that i can have a value for the accuracy
 function display_stats() {
     // console.log('stats are to be displayed');
     calculate_accuracy();
     $('.games-played .value').text(games_played);
     $('.attempts .value').text(attempts);
     $('.accuracy .value').text(accuracy);
 }

 //purpose: calculates the user's accuracy. If the attempts are zero, it sets the accuracy to zero to prevent dividing by zero
 //param: none
 //local: none
 //global: attempts, matches, accuracy
 //functions called: none
 //returns: none
 function calculate_accuracy(){
     if(attempts === 0){
         accuracy = 0 + "%";
     }else{
         accuracy = Math.floor((matches / attempts) *100) + "%";
     }
 }

 //purpose: resets the games features to the original state, i.e. cards flipped over, stats reset, win state removed. Also increments the games_played by one
 //param: none
 //local: none
 //global: none
 //functions called: reset_stats, display_stats
 //returns: none
 function reset_game(){
     games_played++;
     reset_stats();
     display_stats();
     $('.back').css('display', 'initial');                  //makes all card back reappear
     $('.card').removeClass('cardClicked matched');         //makes all cards clickable once more by removing 'cardClicked' and 'matched' classes
     $(".card").click(card_clicked($(this)));               //adds the click handler for the 'card' class
     first_card_clicked = null;
     second_card_clicked = null;
     $('#gameWon').css('display', 'none');                  //reset win features
 }

 //purpose: calculates the user's statistics of the game, namely accuracy
 //param: none
 //local: none
 //global: attempts, matches, accuracy
 //functions called: calculate_accuracy, display_stats
 //returns: none
 function reset_stats() {
     matches = 0;
     attempts = 0;
     calculate_accuracy();
     display_stats();
 }