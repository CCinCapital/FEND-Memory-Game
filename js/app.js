
const BASE_CARD_CLASS = 'card'
const BASE_CARD_ICON_CLASS = 'fa'

// game state
const RUN = true
const STOP = false

// game judge
const CHECK_MATCH = 'CHECK_MATCH'

const TAG_NAME_CARD = 'LI'

const DELAY = 500

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



let cardsBuffer = []  
let totalCards = 16
let matched = 0
let cards = []
let deck = [ANCHOR, BOLT, BOMB, BICYCLE, CUBE, DIAMOND, LEAF, PAPER_PLANE,
            ANCHOR, BOLT, BOMB, BICYCLE, CUBE, DIAMOND, LEAF, PAPER_PLANE]


const Node = function({ nodeName, className = null, listener = null }) {
  if(nodeName) {
    this.domNode = document.createElement(nodeName)    
  }

  if(className) {
    this.addClass(className)
  }

  if(listener) {
    this.domNode.addEventListener(listener.event, function(evt) {
      listener.handleEvent(evt)
    })
  }
}
Node.prototype = {
  appendThisNodeUnder: function(parentNode) {
    parentNode.appendChild(this.domNode)
  },
  hasClass: function(cls) {
    let patt1 = new RegExp(cls)
    return patt1.test(this.domNode.className)
  },
  addClass: function(cls) {
    if( !this.hasClass(cls) ) {
      if( this.domNode.className !== '' ) {
        this.domNode.className += ' ' + cls
      }
      else {
        this.domNode.className = cls
      }
    }
  },
  removeClass: function(cls) {
    if( this.hasClass(cls) ) {
      let patt1 = new RegExp(cls)
      this.domNode.className = this.domNode.className.replace(patt1, ' ')
      let patt2 = new RegExp('  ')
      this.domNode.className = this.domNode.className.replace(patt2, '')
    }
  },
  toggleClass: function(cls) {
    if( this.hasClass(cls) ) {
      this.removeClass(cls)
    }
    else {
      this.addClass(cls)
    }
  }
}

const Card = function() {
  const obj = new Node({
    nodeName: 'li', 
    className: 'card', 
  })

  return obj
}

const Board = function() {
  const obj = new Node({ 
    nodeName: 'ul',
    className: 'deck',
    listener: {
      event: 'click',
      handleEvent: function(e) {
        if(e.target.tagName == TAG_NAME_CARD) {
          let card = cards.filter(function(card) {
            return card.domNode.isSameNode(e.target)
          })[0]

          if(card.hasClass(SHOW)) {
            return
          }

          card.addClass(OPEN + ' ' + SHOW)
          // add the card to a *list* of "open" cards
          cardsBuffer.push(card)

          gameLogic()
        }
      }
    }
  })

  obj.initBoard = function() {
    this.appendThisNodeUnder(document.getElementById('container'))

    // Loop through each card and create its HTML
    for(let c = 0; c < totalCards; c++) {
      const card = new Card()
      cards.push(card)

      // Add each card's HTML to the page
      this.domNode.appendChild(card.domNode)
    }

    populateBoard()
  }

  const resetBoard = function() {
    cards.forEach(function(card){
      card.domNode.innerHTML = ''
    })
    populateBoard()
  }

  const populateBoard = function() {
    // shuffle the list of cards using the provided "shuffle" method    
    shuffle()

    for(card in cards) {
      // display the card's symbol
      cards[card].domNode.innerHTML = `<i class='fa ${deck[card]}'></i>`
    }
  }

  // Shuffle function from http://stackoverflow.com/a/2450976
  const shuffle = function() {
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

  return obj
}

const Game = function() {
  this.board = new Board()
}
Game.prototype.run = function() {
  this.board.initBoard()
}


function gameLogic() {
  if(cardsBuffer.length === 2) {
    if(cardsBuffer[0].domNode.isEqualNode(cardsBuffer[1].domNode)) {
      setTimeout(function() {
        cardsBuffer[0].removeClass(OPEN)
        cardsBuffer[1].removeClass(OPEN)
        cardsBuffer = []
      }, DELAY)
    }
    else {
      setTimeout(function() {            
        cardsBuffer[0].removeClass(OPEN + ' ' + SHOW)
        cardsBuffer[1].removeClass(OPEN + ' ' + SHOW)
        cardsBuffer = []
      }, DELAY)
    }
  }

  // if all cards have matched, display a message with the final score
  if( matched === totalCards ) {
    return alertFinalScore()
  }

}


function startGame() {
  const game = new Game()
  game.run()
}


startGame()
/*
 *  - 
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + 
*/


