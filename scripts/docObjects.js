import { NUM_OF } from './config.js';

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

const checkboxes = document.querySelectorAll('.checkbox');
checkboxes.map = (callback) => {
  const values = [];
  for (const checkbox of checkboxes) {
    values.push(callback(checkbox));
  }
  return values;
};
checkboxes.getCheckedDices = () => {
  const result = [];
  const values = checkboxes.map((checkbox) => checkbox.checked);
  for (const [i, isChecked] of values.entries()) {
    if (isChecked) result.push(i + 1);
  }
  return result;
};
checkboxes.set = (key, value) => {
  checkboxes.map((checkbox) => { checkbox[key] = value; });
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

const radioButtons = document.querySelectorAll('.radio');
radioButtons.show = (usedRadios, player) => {
  for (const [i, usedRadio] of usedRadios[player].entries()) {
    if (!usedRadio) radioButtons[i].disabled = false;
  }
};
radioButtons.set = (key, value) => {
  for (const radioButton of radioButtons) {
    radioButton[key] = value;
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
    new Array(NUM_OF.COMBINATIONS).fill(false),
    new Array(NUM_OF.COMBINATIONS).fill(false),
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
