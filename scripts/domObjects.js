import { map, getDiceValueFromSrc } from './utils.js';

export const playersName = [
  'player 1',
  'player 2',
];
export const restartButton = document.getElementById('restart');
export const whoseTurn = document.getElementById('whose-turn');
export const throwBtn = document.getElementById('throw-button');
export const finishBtn = document.getElementById('finish-button');
export const currentTotal = document.getElementById('total');
export const currentComb = document.getElementById('current-comb');
export const currentBonus = document.getElementById('bonus');
export const totals = [
  document.getElementById('total-1'),
  document.getElementById('total-2'),
];

export const throwsLeft = document.getElementById('throws-left');

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

checkboxes.getPosOfCheckedDices = () => {
  const result = [];
  for (const [i, checkbox] of checkboxes.entries()) {
    if (checkbox.checked) result.push(i + 1);
  }
  return result;
};

const table = [[], []];

table.clear = () => {
  for (const section of table) {
    for (const cell of section) {
      cell.innerHTML = '*';
    }
  }
};

const usedRadioButtons = [];

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

export { dices, checkboxes, table, radioButtons, usedRadioButtons };
