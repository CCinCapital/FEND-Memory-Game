
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



const Node = function(type) {
  let obj = document.createElement(type)

  obj.appendThisNodeUnder = function(node) {
    node.appendChild(obj)
  }

  obj.hasClass = function(cls) {
    let patt1 = new RegExp(cls)
    return patt1.test(this.className)
  }

  obj.addClass = function(cls) {
    if( !this.hasClass(cls) ) {
      if( this.className !== '' ) {
        this.className += ' ' + cls
      }
      else {
        this.className = cls
      }
    }
  }

  obj.removeClass = function(cls) {
    if( this.hasClass(cls) ) {
      let patt1 = new RegExp(cls)
      this.className = this.className.replace(patt1, ' ')
      let patt2 = new RegExp('  ')
      this.className = this.className.replace(patt2, '')
    }
  }

  obj.toggleClass = function(cls) {
    if( this.hasClass(cls) ) {
      this.removeClass(cls)
    }
    else {
      this.addClass(cls)
    }
  }

  return obj
}



const Board = function() {
  const obj = new Node('ul')

  let totalCards = 16

  let matched = 0

  let cards = []

  let cardsBuffer = []

  let deck = [ANCHOR, ANCHOR, 
              BOLT, BOLT, 
              BOMB, BOMB, 
              BICYCLE, BICYCLE, 
              CUBE, CUBE, 
              DIAMOND, DIAMOND,
              LEAF, LEAF,
              PAPER_PLANE, PAPER_PLANE]

  obj.initBoard = function() {
    this.addClass('deck')
    this.appendThisNodeUnder(document.getElementById('container'))

    this.addEventListener('click', function(event) {
      handleClick(event)
    })

// Loop through each card and create its HTML
    for(let c = 0; c < totalCards; c++) {
      const card = new Node('li')
      card.addClass('card')

      cards.push(card)

      // Add each card's HTML to the page
      this.appendChild(card)
    }

    this.populateBoard()
  }

  obj.resetBoard = function() {
    cards.forEach(function(card){
      card.innerHTML = ''
    })

    this.populateBoard()
  }

  obj.populateBoard = function() {
// shuffle the list of cards using the provided "shuffle" method    
    this.shuffle()

    for(card in cards) {
      cards[card].innerHTML = `<i class='fa ${deck[card]}'></i>`
    }
  }

  obj.judgeCards = function() {
    return cardsBuffer[0] === cardsBuffer[1]
  }

// Shuffle function from http://stackoverflow.com/a/2450976
  obj.shuffle = function() {
    var currentIndex = deck.length, temporaryValue, randomIndex
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = deck[currentIndex]
        deck[currentIndex] = deck[randomIndex]
        deck[randomIndex] = temporaryValue
    }
    return deck
  }

  obj.run = function() {
    this.initBoard()

// if all cards have matched, display a message with the final score
    if( matched === totalCards ) {
      return alertFinalScore()
    }

// add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
    this.waitForUser()

// if the list already has another card, check to see if the two cards match    
    this.judgeCards()
  }

// display the card's symbol
  let handleClick = function(event) {
    if(event.target.nodeName === 'LI') {
      console.log(event.target)
    }
  }

  let alertFinalScore = function() {
    console.log('final score')
  }

  return obj
}



function startGame() {
  const game = new Board()
  game.run()
}


/*
 *  - 
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + 
*/



