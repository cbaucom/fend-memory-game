/*
 * Create a list that holds all of your cards
 */
const cards = ["anchor", "anchor", "bicycle", "bicycle", "bolt", "bolt", "bomb", "bomb", "cube", "cube", "diamond", "diamond", "leaf", "leaf", "paper-plane", "paper-plane"];

// openCards - to hold cards for comparison
let openCards = [];

// moves - how many pairs of moves the user makes, starting moves should be 0
let moves = 0;

// stars - the fewer moves it takes to win, the higher the number of stars will be. 3 stars is the highest. 
let stars = 3;

// define timer variables 
let seconds = 0;
let minutes = 0;
let hours = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleCards() {
    // Shuffle the cards
    let shuffledCards = shuffle(cards);

    // reset the open cards list
    openCards = [];

    // define the card deck and remove all content 
    const deck = $('.deck').empty();

    // loop through each card and create the content
    for (let card of shuffledCards) {
        // set the HTML of a card
        let cardContainer = $('<li class="card"><i class="fa" aria-hidden="true"></i></li>');

        // add card to the deck 
        deck.append(cardContainer);

        // setup the icon for the card
        let iconClass = "fa-" + card;

        // add icon class to the card
        cardContainer.find('.fa').addClass(iconClass);
    }
}


$('.deck').on('click', '.card', function (event) {
    // open the clicked card
    let clickedCard = $(event.target);

    showCard(clickedCard);

    setTimeout(function () {
        checkCards(clickedCard);
    }, 500);

});

function showCard(card) {
    card.addClass('open show');
}

function checkCards(card) {
    // get symbol from the card
    let cardSymbol = card.children('i').attr('class');

    // check if there are two cards open
    if (openCards.length > 0) {
        openCards.push(card);

        // get the last card
        let lastCard = openCards[openCards.length - 2];
        // get symbol of the last card
        let lastCardSymbol = lastCard.children('i').attr('class');

        // if match
        if (lastCardSymbol === cardSymbol) {
            // lock card
            lockCard(card);
            lockCard(lastCard);
            // reset openCards
            openCards = [];
            // check if win
            checkAllMatched();
        } else {
            // else if not match
            hideCard(card, openCards);
            hideCard(lastCard, openCards);
        }
        updateMoves();
    } else {
        // if only one card opened, add card to the open list
        openCards.push(card);
    }
}

function lockCard(card) {
    card.removeClass("open show");
    card.addClass("match");
}

function hideCard(card, openCards) {
    card.addClass("not-match");
    setTimeout(function () {
        card.removeClass("open show not-match");
        openCards.pop();
    }, 500);
}

function checkAllMatched() {
    let matchedNum = $('.match').length;

    if(matchedNum === $('.deck li').length){
        congratsPopup();

        init();
    } else{
        $(".container").show();
    }
}

// initialize the moves value
function initMoves() {
    moves = 0;
    $('.moves').text(moves);
}

// update the moves value
function updateMoves() {
    moves++;
    $('.moves').text(moves);
    
    updateStars();
}

// initialize the stars count
function initStars() {
    stars = 3;
    $('.stars i').removeClass("fa-star-o");
    $('.stars i').addClass("fa-star");

    updateStars();
}

// update stars based on how many moves have been used 
function updateStars() {
    if (moves <= 10) {
        $('.stars .fa').addClass("fa-star");
        stars = 3;
    } else if (moves >= 11 && moves <= 20) {
        $('.stars li:last-child .fa').removeClass("fa-star");
        $('.stars li:last-child .fa').addClass("fa-star-o");
        stars = 2;        
    } else if (moves >= 21 && moves <=30) {
        $('.stars li:nth-child(2) .fa').removeClass("fa-star");
        $('.stars li:nth-child(2) .fa').addClass("fa-star-o");
        stars = 1;        
    } else if (moves >=31) {
        $('.stars li .fa').removeClass("fa-star");
        $('.stars li .fa').addClass("fa-star-o");
        stars = 0;        
    }
}

function congratsPopup() {
    swal({
        title: "Good job!", 
        text: stars + " stars! You finished in " + moves + " moves with a time of " + timer.getTimeValues().toString(), 
        type: "success",
        button: "Play again!"
    });
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/* timer function with easytimer.js from https://github.com/albert-gonzalez/easytimer.js by Albert Gonzalez 
*/
let timer = new Timer();
timer.start();
timer.addEventListener('secondsUpdated', function (e) {
    $('.timer .values').html(timer.getTimeValues().toString());
});            

// restart the game by clicking the reset button
$('.restart').on('click', function (event) {
    initMoves();
    initStars();
    timer.reset();
    init();
});

function init() {
    initMoves();
    initStars();
    shuffleCards();
    timer.start();
    checkAllMatched();
}

// initialize the game on page load
$(function () {
    init();
});