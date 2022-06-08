const numOf = {
  dicePositions: 5,
  diceValue: 6,
  combinations: 8,
  players: 2,
  rounds: 3,
};
const combinations = [
  'Chance', 'Pair',
  'Two Pair', 'Three of a kind',
  'Straight', 'Full House',
  'Four of a kind', 'Poker',
];
const diceSources = [
  './images/dice/dice_1.png',
  './images/dice/dice_2.png',
  './images/dice/dice_3.png',
  './images/dice/dice_4.png',
  './images/dice/dice_5.png',
  './images/dice/dice_6.png',
];
const rollDelay = {
  start: 30,
  acceleration: 1.04,
  end: 150,
};

export { numOf, rollDelay, combinations, diceSources };
