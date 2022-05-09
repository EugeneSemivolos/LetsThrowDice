'use strict';

const NUM_OF = {
  DICE_POSITIONS: 5,
  DICE_VALUE: 6,
  COMBINATIONS: 8,
  PLAYERS: 2,
};
const COMBINATIONS = [
  'Chance', 'Pair',
  'Two Pair', 'Three of a kind',
  'Straight', 'Full House',
  'Four of a kind', 'Poker',
];
const DICE_SOURCES = [
  './images/dice/dice_1.png',
  './images/dice/dice_2.png',
  './images/dice/dice_3.png',
  './images/dice/dice_4.png',
  './images/dice/dice_5.png',
  './images/dice/dice_6.png',
];
const DELAY = {
  START: 30,
  ACCELERATION: 1.04,
  END: 180,
};
