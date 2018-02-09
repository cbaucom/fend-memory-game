/**
 * Create a list that holds all of your cards
 * @type {Array}
 */
const cards = ["anchor", "anchor", "bicycle", "bicycle", "bolt", "bolt", "bomb", "bomb", "cube", "cube", "diamond", "diamond", "leaf", "leaf", "paper-plane", "paper-plane"];

/**
 * Define the global variables
 * @type {Array} openCards - to hold cards for comparison
 * @type {number} moves - how many pairs of moves the user makes, starting moves should be 0
 * @type {number} stars - the fewer moves it takes to win, the higher the number of stars will be. 3 stars is the highest
 * @type {number} seconds, minutes and nours
 */

let openCards = [];
let moves = 0;
let stars = 3;

    /**
 * @description timer function with easytimer.js from https://github.com/albert-gonzalez/easytimer.js by Albert Gonzalez
 * @constructor Timer
 */
let timer = new Timer();
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

/**
 * @description shuffle cards
 */
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

/**
 * @description click a card to show and check if they match
 */
var addCardListener = function () {

    // $('.deck').find('.card').bind('click', function () {
    //     var $this = $(this)
    $('.deck').on('click', '.card', function (event) {
        // open the clicked card
        let clickedCard = $(event.target);
        // start the timer
        timer.start();
        timer.addEventListener('secondsUpdated', function (e) {
            $('.timer .values').html(timer.getTimeValues().toString());
        });

        if (clickedCard.hasClass('show') || clickedCard.hasClass('match')) { return true; }

        // showCard(clickedCard);

        let card = clickedCard;
        card.addClass('open show');
        openCards.push(card);

        // get symbol from the card
        let cardSymbol = card.children('i').attr('class');
        // Compare with opened card
        if (openCards.length > 1) {
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
                checkIfAllMatched();
            } else {
                // else if not match
                hideCard(card, openCards);
                hideCard(lastCard, openCards);
            }
            updateMoves();
        }



        // $(openCards[0]).off('click');

        // setTimeout(function () {
        //     checkCards(clickedCard);
        // }, 500);

    });
}

/**
 * @description show card
 * @param {string} card - card which should be shown when clicked
 */
function showCard(card) {
    card.addClass('open show');
}

/**
 * @description check if the cards match
 * @param {string} card - card which was last clicked
 */
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
        } else {
            // else if not match
            hideCard(card, openCards);
            hideCard(lastCard, openCards);
        }
        updateMoves();
        // check if win
        checkIfAllMatched();
    } else {
        // if only one card opened, add card to the open list
        openCards.push(card);
    }
}

/**
 * @description Lock last opened card and set its class to 'match'
 * @param {string} card - card to be marked as matched
 */
function lockCard(card) {
    card.removeClass("open show");
    card.addClass("match");
}

/**
 * @description remove a card from the open card list and hide the card when not match
 * @param {String} card - card to be marked as matched
 * @param {Array} openCards - a list of open cards for match checking
 */
function hideCard(card, openCards) {
    card.addClass("not-match");
    setTimeout(function () {
        card.removeClass("open show not-match");
        openCards.pop();
    }, 500);
}

/**
 * @description check if all cards matched, show congrats popup, reset the board
 */
function checkIfAllMatched() {
    let matchedNum = $('.match').length;

    if(matchedNum === $('.deck li').length){
        endGame(moves, stars);

        timer.stop();
    } else{
        $(".container").show();
    }
}

/**
 * @description initialize the moves value
 */
function initMoves() {
    moves = 0;
    $('.moves').text(moves);
}

/**
 * @description update the moves value
 */
function updateMoves() {
    moves++;
    $('.moves').text(moves);

    updateStars();
}

/**
 * @description initialize the stars count
 */
function initStars() {
    stars = 3;
    $('.stars i').removeClass("fa-star-o");
    $('.stars i').addClass("fa-star");

    updateStars();
}

/**
 * @description update stars based on how many moves have been used
 */
function updateStars() {
    if (moves <= 10) {
        $('.stars .fa').addClass("fa-star");
        stars = 3;
    } else if (moves >= 11 && moves <= 20) {
        $('.stars li:last-child .fa').removeClass("fa-star");
        $('.stars li:last-child .fa').addClass("fa-star-o");
        stars = 2;
    } else if (moves >= 21) {
        $('.stars li:nth-child(2) .fa').removeClass("fa-star");
        $('.stars li:nth-child(2) .fa').addClass("fa-star-o");
        stars = 1;
    }
}

/**
 * @description popup modal from sweetalert.js
 */
function endGame(moves, stars) {
    swal({
        closeOnEsc: false,
        allowOutsideClick: false,
        title: "Great job! You won!",
        text: "You earned " + stars + " stars and a time of " + timer.getTimeValues().toString() + " seconds.",
        icon: "success",
        button: "Play again!"
    }).then(function(isConfirm) {
        if (isConfirm) {
            initGame();
        }
    })
}



/**
 * @description restart the game by clicking the reset button
 */
$('.restart').on('click', function (event) {
    initMoves();
    initStars();
    addCardListener();
    timer.reset();
    initGame();
});

/**
 * @description initialize the game
 */
function initGame() {
    initMoves();
    initStars();
    addCardListener();
    shuffleCards();
    checkIfAllMatched();
    timer.reset();
}

/**
 * @description  initialize the game on page load
 */
$(function () {
    initGame();
});