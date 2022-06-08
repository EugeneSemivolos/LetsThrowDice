import { numOf } from './config.js';
import { map, getDiceValueFromSrc } from './utils.js';

//header
const restartButton = document.getElementById('restart');

const playersName = [
  'player 1',
  'player 2',
];

//left board
const totals = [
  document.getElementById('total-1'),
  document.getElementById('total-2'),
];

totals.reset = () => {
  totals[0].innerHTML = '0';
  totals[1].innerHTML = '0';
};

const whoseTurn = document.getElementById('whose-turn');

//center panel
const throwsLeft = document.getElementById('throws-left');

Object.defineProperty(throwsLeft, 'value', {
  get() {
    return this.val;
  },
  set(x) {
    this.innerHTML = x;
    this.val = x;
  },
});

const dices = document.querySelectorAll('.dice-value');

dices.getValues = () => map(dices, (dice) => getDiceValueFromSrc(dice.src));

const checkboxes = document.querySelectorAll('.checkbox');

checkboxes.getCheckedDices = () => {
  const result = [];
  for (const checkbox of checkboxes) {
    if (checkbox.checked) result.push(checkbox);
  }
  return result;
};

const throwBtn = document.getElementById('throw-button');
const finishBtn = document.getElementById('finish-button');

const table = [[], []];

table.init = () => {
  for (let i = 0; i < numOf.players; i++) {
    for (let j = 0; j < numOf.combinations; j++) {
      const cell = document.getElementById(i.toString() + j.toString());
      table[i].push(cell);
    }
  }
};

table.clear = () => {
  for (const section of table) {
    for (const cell of section) {
      cell.innerHTML = '*';
    }
  }
};

const radioButtons = document.querySelectorAll('.radio');

radioButtons.show = (usedRadios, player) => {
  for (const [i, usedRadio] of usedRadios[player].entries()) {
    if (!usedRadio) radioButtons[i].disabled = false;
  }
};

radioButtons.find = (callback) => {
  for (const radioButton of radioButtons) {
    if (callback(radioButton) === true) return radioButton;
  }
};

const usedRadioButtons = [];

usedRadioButtons.init = () => {
  usedRadioButtons.push(
    new Array(numOf.combinations).fill(false),
    new Array(numOf.combinations).fill(false),
  );
};

usedRadioButtons.reset = () => {
  usedRadioButtons[0].fill(false);
  usedRadioButtons[1].fill(false);
};

//right board
const currentTotal = document.getElementById('total');
const currentComb = document.getElementById('current-comb');
const currentBonus = document.getElementById('bonus');

export { playersName, totals, whoseTurn, throwsLeft, dices, checkboxes,
  throwBtn, finishBtn, table, radioButtons, usedRadioButtons,
  currentTotal, currentComb, currentBonus, restartButton };
