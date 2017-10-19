# Memory Game Project

This is a card matching game built with vanilla JavaScript, CSS, and HTML.

# About
There are 8 pairs of cards that appear at random location on the board, player has to match all 8 pairs of cards to win the game.After game ended, a end modal will popup and user's score will be shown.

# Procedure
1. Cards are displayed for 2s to let player memorize the location before hidden. 
2. Player clicks on first card to reveal its logo.
3. Player clicks on second card to reveal its logo. Moves counter increment by 1.
4. Test if both cards has same logo.
- if cards do match, both cards are locked with logos visible, Matched counter increment by 2.
- if cards do not match, both cards' logo are hidden after short period.
5. Test if Matched counter equals total number of cards.
- if true, end the game and display the result.
- if false, Repeat step 2 ~ 5 until game end.

# Scoring
1. Player is given a staring score which decrease over time.
2. Player's successful click move also decrese the score.
3. The remaining score when game ends determines player's performance. (in stars)

Thus, in order to obtain a higher performance rating, player has to finish the game faster with fewer moves.

# Setup

1. clone the project:
```git clone https://github.com/CCinCapital/FEND-Memory-Game.git```
2. navigate to the directory:
```cd FEND-Memory-Game```

## Running
1. find the ```index.html``` and double click on it, game will load automatically.

## Restarting
There are two ways to restart the game:
1. Refresh the page. (Click the refresh button or press F5)
2. Click the restart button. (Top-right corner)

# Known Issues
N/A

# Credit
The static UI and styling used in this game was provided by Udacity @ https://github.com/udacity/fend-project-memory-game
