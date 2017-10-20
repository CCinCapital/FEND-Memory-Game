
// duration for setTimeout() methods
const CARDS_DISPLAY_DURATION = 2000
const CARD_DISPLAY_DURATION = 600

// star counter
const TOTAL_STAR = 3
const INITIAL_SCORE = 10000

// timer 
const TIMER_UPDATE_INTERVAL = 200

const SCORE_DECREMENT_INTERVAL = 100
const SCORE_DECREMENT_AMOUNT_PER_INTERVAL = 10
const SCORE_DECREMENT_AMOUNT_PER_MOVE = 10

const FIRST_STAR_CUTOFF = 8000
const SECOND_STAR_CUTOFF = 6000

// deck
const ANCHOR = 'fa-anchor'
const BOLT = 'fa-bolt'
const BOMB = 'fa-bomb'
const BICYCLE = 'fa-bicycle'
const CUBE = 'fa-cube'
const DIAMOND = 'fa-diamond'
const LEAF = 'fa-leaf'
const PAPER_PLANE = 'fa-paper-plane-o'
const DECK = [ANCHOR, BOLT, BOMB, BICYCLE, CUBE, DIAMOND, LEAF, PAPER_PLANE,
              ANCHOR, BOLT, BOMB, BICYCLE, CUBE, DIAMOND, LEAF, PAPER_PLANE]

const TEXT_GAME_TITLE = 'Matching Game'

let game_over = false                 // true => game ended, false => game ongoing
let currentStar = TOTAL_STAR          // current user performance rating, from Total_Star to 1 star, based on currentScore
let currentScore = INITIAL_SCORE      // initial score, decrease based on game time and # of user moves
let cardsBuffer = []                  // temp storage of user's card click, .push/.shift based on gameLogic
let totalCards = DECK.length          // # of cards in deck
let matched = 0                       // # of cards matched by user
let moves = 0                         // # of user's click moves, 

let timeOutID = null                  // ID of setTimeout(), used to clear the timeout function

// 
const Node = function({ 
  nodeName,             // required, must be same as *element.nodeName, <li></li> should put 'LI', <div></div> should put 'DIV'...
  className = null, 
  id = null, 
  innerHTML = null, 
  eventListener = null, 
  childrenNodes = [],   // all child nodes of this node, same structure as DOM tree
}) {
  if(nodeName) {
    // if node name is provided, create a DOM element
    this.domNode = document.createElement(nodeName)    
  }
  else {
    console.log('err: nodeName is required...')
  }

  if(className) {
    this.defaultClassName = className
    this.domNode.className = className
  }

  if(id) {
    this.domNode.id = id
  }

  if(innerHTML) {
    this.domNode.innerHTML = innerHTML
  }

  if(eventListener) {
    this.domNode.addEventListener(eventListener.event, function(evt) {
      eventListener.eventHandler(evt)
    })
  }

  this.childrenNodes = childrenNodes
}
Node.prototype = {
  // append this node's DOM node under its parent dom node
  mountSelfUnderDomNode: function(parentDomNode) {
    parentDomNode.appendChild(this.domNode)
  },
  // append all childrenNodes's DOM nodes under this node's DOM node
  // repeat for all childrenNodes recursively
  mountChildrenNodes: function() {
    for(child in this.childrenNodes) {
      this.domNode.appendChild(this.childrenNodes[child].domNode)
      if(this.childrenNodes[child].hasChild()) {
        this.childrenNodes[child].mountChildrenNodes()
      }
    }
  },
  hasChild: function() {
    return this.childrenNodes.length > 0
  },
  appendChild: function(child) {
    this.childrenNodes.push(child)
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
  },
  resetClass: function() {
    this.domNode.className = this.defaultClassName
  },
  innerHTML: function(innerHTML) {
    this.domNode.innerHTML = innerHTML
  }
}

const Header = function() {
  const title = new Node({
    nodeName: 'h1',
    innerHTML: TEXT_GAME_TITLE,
  })

  const obj = new Node({
    nodeName: 'header',
    childrenNodes: [title],
  })

  return obj
}

const Stars = function() {
  // create an array of 3 stars as children nodes
  const stars = []
  for(let i = 0; i < TOTAL_STAR; i++) {
    const star = new Node({
      nodeName: 'li',
      innerHTML: '',
    })
    stars.push(star)
  }

  const obj = new Node({
    nodeName: 'ul',
    className: 'stars',
    childrenNodes: stars,
  })

  obj.update = function(count) {
    // remove innerHTML of all stars
    obj.childrenNodes.map(function(star){
      star.innerHTML('')
    })
    // fill innerHTML of all stars
    this.showFullyFilledStars(count)
  }

  obj.showFullyFilledStars = function(starsToFill) {
    // loop through all child stars, and begin the filling from [0]
    obj.childrenNodes.map(function(star, index){
      if(index < starsToFill) {
        star.innerHTML(`<i class='fa fa-star'></i>`)    // filled
      }
      else {
        star.innerHTML(`<i class='fa fa-star-o'></i>`)  // outline
      }
    })
  }

  //  on create, fill stars to the game preset value
  obj.showFullyFilledStars(currentStar)

  return obj
}

const MoveCounter = function() {
  const obj = new Node({
    nodeName: 'span',
    className: 'moveCounter',
    innerHTML: ' 0 Moves ',
  })

  obj.update = function(count) {
    this.innerHTML(` ${count} Moves `)
  }

  return obj
}

const RestartBtn = function() {
  const obj = new Node({
    nodeName: 'div',
    className: 'restartBtn',
    innerHTML: `<i class='fa fa-repeat'></i>`,  // img of this button
    eventListener: {
      event: 'click',
      eventHandler: function(e) {
        restart()   // restart the game if this button is clicked
      }
    },
  })

  return obj
}

const Timer = function() {
  const obj = new Node({
    nodeName: 'span',
    className: 'timer',
    innerHTML: `00:00`,
    //innerHTML: `00:00:00`, // with hour
  })

  let startTime = new Date().getTime() // start time of timer, its value created here doesn't matter
  let timerID = 0                           // ID of the setInterval() function
  let hours = minutes = seconds = 0         // clock fragments

  obj.start = function() {
    startTime = new Date().getTime()        // gets the current time
    this.update()                           // start update the timer
  }

  obj.stop = function() {
    clearInterval(timerID)                  // stop the timer
  }

  obj.restart = function() {
    clearInterval(timerID)                  // clear the setInterval() set by update function, this is redundent line of code, leave it here for future implementations
    startTime = new Date().getTime()        // get the current time
    this.update()                           // start the update
  }

  obj.update = function() {
    timerID = setInterval(function(){
      timePassed = new Date().getTime() - startTime       // in milli seconds

      seconds = parseInt(timePassed / 1000 % 60)          // convert to seconds, and filter out seconds
      minutes = parseInt(timePassed / 1000 / 60 % 60)     // convert to minutes, and filter out minutes

      if(seconds < 10) seconds = '0'+seconds              // change someting like 12:1 to 12:01
      if(minutes < 10) minutes = '0'+minutes              // change something like 1:12 to 01:12

      obj.innerHTML(`${minutes}:${seconds}`)

      // hours = parseInt(timePassed / 1000 / 60 / 60 % 24)  // convert to hours, and filter out hours       
      // if(hours < 10) hours = '0'+hours      // with hour
      //obj.innerHTML(`${hours}:${minutes}:${seconds}`)  
    }, TIMER_UPDATE_INTERVAL)
  }

  obj.getTimePassed = function() {
    return new Date().getTime() - startTime
  }

  return obj
}

const ScorePanel = function() {
  const stars = new Stars()
  const moveCounter = new MoveCounter()
  const restartBtn = new RestartBtn()
  const timer = new Timer()

  const obj = new Node({
    nodeName: 'section',
    className: 'score-panel',
    id: 'score-panel',
    childrenNodes: [stars, moveCounter, restartBtn, timer],
  })

  obj.reset = function() {
    stars.update(TOTAL_STAR)  // TOTAL_STAR is 0 upon game reset
    moveCounter.update(moves) // moves is 0 upon game reset
    timer.restart()
  }

  // expose child nodes so other class could call *.stars.*methods outside closure.
  obj.stars = stars 
  obj.moveCounter = moveCounter
  obj.timer = timer

  return obj
}

const Card = function() {
  const obj = new Node({
    nodeName: 'li', 
    className: 'card', 
  })

  return obj
}

const Board = function() {
  let deck = DECK
  let cards = []

  const populateCards = function() {
    // shuffle the list of cards 
    shuffleCards()
    // loop through each card, and assign symbol to the card
    for(card in cards) {
      cards[card].innerHTML(`<i class='fa ${deck[card]}'></i>`)
    }
  }

  // shuffle the list of cards (DECK), Shuffle function from http://stackoverflow.com/a/2450976
  const shuffleCards = function() {
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

  // create an array of Cards() as children nodes of Board()
  for(let c = 0; c < totalCards; c++) {
    const card = new Card()
    cards.push(card)
  }
  // assign symbol to the cards
  populateCards()

  const obj = new Node({ 
    nodeName: 'ul',
    className: 'deck',
    eventListener: {
      event: 'click',
      eventHandler: function(e) {
        gameLogic(e) // run the gameLogic Once per user click
      }
    },
    childrenNodes: cards,
  })

  obj.reset = function() {
    // reset all card's class to what when it was created
    // remove the symbol assigned to it
    // then assign new symbol to each card
    cards.forEach(function(card){
      card.resetClass()
      card.innerHTML('')
    })
    populateCards()
  }

  obj.showCardsFor = function(duration) {     // show the cards to user for a duration
    cards.forEach(function(card){             // show all cards
      card.toggleClass('show open')
    })

    timeOutID = setTimeout(function(){        // then hide the cards after duration expire
      cards.forEach(function(card){           // keep the timeoutID of setTimeout function
        card.toggleClass('show open')         //  - resetting the game will clear the Timer (if there is any)
      })
    }, duration)
  }

  // expose [cards] so other class could call *.cards[?] outside closure.
  obj.cards = cards

  return obj
}

const Modal = function() {
  // wraper
  const obj = new Node({
    nodeName: 'div',
    className: 'modal',
  })

  obj.show = function() {
    this.addClass('visible')
  }

  obj.hide = function() {
    this.removeClass('visible')
  }

  // content panel of modal
  const panel = new Node({
    nodeName: 'div',
    className: 'modal panel',
  })
  obj.appendChild(panel)    // add to wraper.childrenNodes array

  const stars = new Stars() // message to show when game end
  panel.appendChild(stars)  // stars to show user performance

  const gratz = new Node({
    nodeName: 'h1',
    className: 'panel-gratz',
    innerHTML: 'Congratulations! You Won!'
  })
  panel.appendChild(gratz)

  const msg = new Node({
    nodeName: 'p',
    className: 'panel-msg',
  })
  panel.appendChild(msg)    // add to panel.childrenNodes array

  const okBtn = new Node ({ // button to confirm the message
    nodeName: 'button',
    className: 'panel-okBtn',
    innerHTML: 'ok',
    eventListener: {
      event: 'click',
      eventHandler: function(e) { // hide the Modal if button was clicked
        obj.hide()
      },
    },
  })
  panel.appendChild(okBtn) // add to panel.childrenNodes array

  // overlay of modal
  const overlay = new Node ({
    nodeName: 'div',
    className: 'modal overlay',
    eventListener: {
      event: 'click',
      eventHandler: function(e) { // hide the Modal if overlay was clicked
        obj.hide()
      },
    },
  })
  obj.appendChild(overlay) // add to wraper.childrenNodes array

  // expose
  obj.stars = stars
  obj.msg = msg

  return obj
}

const Game = function() {
  const header = new Header()         // show title
  const scorePanel = new ScorePanel() // show stars, move counter, reset button
  const board = new Board()           // user's playing ground
  const modal = new Modal()           // show endgame result 
  
  let obj = new Node({
    nodeName: 'div',
    className: 'container',
    id: 'container',
    childrenNodes: [header, scorePanel, board, modal],
  })

  obj.run = function() {
    this.mountSelfUnderDomNode(document.body)   // append itself under <body></body>
    this.mountChildrenNodes()                   // mount all children Node() and their children Node()

    board.showCardsFor(CARDS_DISPLAY_DURATION)  // let user memorize the boards for a duration
    scorePanel.timer.start()
  }

  obj.restart = function() { 
    scorePanel.reset()
    board.reset()

    board.showCardsFor(CARDS_DISPLAY_DURATION)
    scorePanel.timer.restart()
  }

  // expose
  obj.scorePanel = scorePanel
  obj.modal = modal
  obj.board = board

  return obj
}

function gameLogic(e) {
  if(game_over) {
    return -1
  }

  let clickTarget = new RegExp(e.target.className)          // get the click target's className, 
  let targetIsCard = ( clickTarget.test('card') )           // test if target is a 'card' DOM node
                                                            //  - (card DOM node has 'card' className)

  if(targetIsCard) {                                        // if the target is a 'card' DOM node
    let card = game.board.cards.filter(function(card) {     // find the DOM node's Node() object
      return card.domNode.isSameNode(e.target)              // by test all cards in the cards[] of Board() object
    })[0]                                                   // - position [0] contains the Node() object

                                                            // user should not be able to click a 'shown' card
    if(card.hasClass('show')) {return -1}                   // shown card was locked => it cannot be clicked => clicks on it is ignored.

                                                            // user clicks on a 'hidden' card
    card.addClass('show open')                              // shows the card and highlights (open) it
    
    cardsBuffer.push(card)                                  // add the card to a *list* of "open" cards

    // counter should only increment once
    // after user picks twice
    moves++
    if(moves%2 === 0) {
      game.scorePanel.moveCounter.update(moves/2)         // update move counter
      currentScore -= SCORE_DECREMENT_AMOUNT_PER_MOVE     // deduct points per move
    }

    if(cardsBuffer.length%2 === 0) {                            // when ever the *list* of "open" cards has 2n elements 
                                                                // test if the first two elements matches
 
// Each pair of cards' parity, and decided to show or hide
// for a duration of CARD_DISPLAY_DURATION. 
      const firstCard = cardsBuffer.shift()                     // read/remove the very first card of the *list* of "open" cards
      const secondCard = cardsBuffer.shift()                    // read/remove the second card

      if(firstCard.domNode.isEqualNode(secondCard.domNode)) {   // if both cards do match (is equal node)
        matched += 2                                            // increment the 'matched' counter by 2

        firstCard.addClass('match')
        secondCard.addClass('match')

        setTimeout(function() {
          firstCard.removeClass('open match')                         // lock the cards in the open position,
          secondCard.removeClass('open match')                        // 'card' has className 'show' remaining, ('shown card is locked')
        }, CARD_DISPLAY_DURATION)
      }
      else {                                                    // if cards does not match

        firstCard.addClass('not-match')
        secondCard.addClass('not-match')

        setTimeout(function() {
          firstCard.removeClass('show open not-match')                    // hide the card's symbol
          secondCard.removeClass('show open not-match')                   // 'card' does not have className 'show', ('unshown card is not locked')
        }, CARD_DISPLAY_DURATION)
      }

      if( matched === totalCards ) {                            // if all cards have been matched
        game_over = true

  // Since the time took by this function is not accounted by 
  // user's playtime, hence it is deducted when giving score.         
        const gameTimer = game.scorePanel.timer.getTimePassed()
                          - CARD_DISPLAY_DURATION
                                                                // display a modal with the final score
        game.modal.stars.update(currentStar)
        game.modal.msg.innerHTML(`You've matched ${matched} cards in ${moves/2} moves, ${gameTimer/1000} seconds.`)
        game.modal.show()                                       
      }
    }
  }
  else {            // if the target is not a 'card' DOM node
    return -1       // ignore this click event
  }
} // end of gameLogic(e)

function startGame() {
  game.run()

  // reduce score & star based on game time and # of moves
  let intervalID = setInterval(function(){
    if(!game_over) {                                        // if game is running
      currentScore -= SCORE_DECREMENT_AMOUNT_PER_INTERVAL   // currentScore - SCORE_DECREMENT_AMOUNT_PER_INTERVAL
    }
    
    // decide star rating
    if(currentScore > FIRST_STAR_CUTOFF) {
      currentStar = TOTAL_STAR
    }
    else if(currentScore <= FIRST_STAR_CUTOFF && currentScore > SECOND_STAR_CUTOFF) {
      currentStar = TOTAL_STAR - 1
    }
    else if(currentScore <= SECOND_STAR_CUTOFF) {
      currentStar = TOTAL_STAR - 2
    }
    else {
      currentStar = 1
    }

    // update the star rating
    game.scorePanel.stars.showFullyFilledStars(currentStar)

    if(game_over) {   // this method has to be here rather than with the if(!game_over){}else{} 
                      // otherwise it will skip the final .showFullyFilledStars() update  
      clearInterval(intervalID)                             // stop the score decrement and game timer
      game.scorePanel.timer.stop()
    }

  }, SCORE_DECREMENT_INTERVAL)
} 

function restart() {
                          // to avoid user spamming the reset button => setTimeout() stacks up => board flickers after CARD_DISPLAY_DURATION.
  clearTimeout(timeOutID) // clear the timer set by board.showCardsFor(duration) method if it hasn't expired

  game_over = false
  cardsBuffer = []
  currentStar = TOTAL_STAR
  currentScore = INITIAL_SCORE
  matched = 0
  moves = 0

  game.restart()
}

const game = new Game()

startGame()
