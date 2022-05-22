import { NUM_OF } from './config.js';

//header
const restartButton = document.getElementById('restart');
const playersName = [
  document.querySelector('.name-1'),
  document.querySelector('.name-2'),
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

//center
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

const dices = document.getElementsByClassName('dice-value');
dices.getValueOfDiceOnPos = (pos) => {
  const diceSrs = dices[pos].src;
  const len = diceSrs.length;
  const posOfValueFromRight = 5;
  return diceSrs[len - posOfValueFromRight];
};
dices.getValues = () => {
  const values = [];
  for (let i = 0; i < NUM_OF.DICE_POSITIONS; i++) {
    values.push(dices.getValueOfDiceOnPos(i));
  }
  return values.map((e) => parseInt(e));
};

const checkboxes = document.getElementsByClassName('checkbox');
checkboxes.getCheckedDices = () => {
  const values = [];
  for (const checkbox of checkboxes) {
    values.push(checkbox.checked);
  }
  return values.reduce((acc, cur, i) => (cur ? [...acc, i + 1] : acc), []);
};
checkboxes.map = (callback) => {
  for (const checkbox of checkboxes) {
    callback(checkbox);
  }
};
checkboxes.makeChecked = (isChecked) => {
  checkboxes.map((checkbox) => { checkbox.checked = isChecked; });
};
checkboxes.makeDisable = (isDisabled) => {
  checkboxes.map((checkbox) => { checkbox.disabled = isDisabled; });
};

const throwBtn = document.getElementById('throw-button');
const finishBtn = document.getElementById('finish-button');

const table = [[], []];
table.init = () => {
  for (let i = 0; i < NUM_OF.PLAYERS; i++) {
    for (let j = 0; j < NUM_OF.COMBINATIONS; j++) {
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

const radioButtons = document.getElementsByClassName('radio');
radioButtons.show = (usedRadios, player) => {
  for (const [i, usedRadio] of usedRadios[player].entries()) {
    if (!usedRadio) radioButtons[i].disabled = false;
  }
};
radioButtons.disableAll = () => {
  for (const radioButton of radioButtons) {
    radioButton.disabled = true;
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
    new Array(8).fill(false),
    new Array(8).fill(false),
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
