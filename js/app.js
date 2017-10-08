
const BASE_CARD_CLASS = 'card'
const BASE_CARD_ICON_CLASS = 'fa'

// star counter
const STAR = 'fa-star' 
const FULL_STAR = 3
let currentStar = FULL_STAR

// restart button
const RESTART = 'fa-repeat'

// card properties
const SHOW = 'show'  // HIDDEN = $('#id').toggleClass(SHOW)
const OPEN = 'open'  // CLOSE = $('id').toggleClass(OPEN)

// deck
const ANCHOR = 'fa-anchor'
const BOLT = 'fa-bolt'
const BOMB = 'fa-bomb'
const BICYCLE = 'fa-bicycle'
const CUBE = 'fa-cube'
const DIAMOND = 'fa-diamond'
const LEAF = 'fa-leaf'
const PAPER_PLANE = 'fa-paper-plane-o'





/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */



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
