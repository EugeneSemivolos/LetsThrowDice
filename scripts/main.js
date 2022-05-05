'use strict';

const NUM_OF_DICE_POSITIONS = 5;
const NUM_OF_DICE_VALUE = 6;
const NUM_OF_COMBINATIONS = 8;
const NUM_OF_PLAYERS = 2;
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
const START_DELAY = 30;
const DELAY_ACCELERATION = 1.04;
const END_DELAY = 180;

const playersName = [];

let player = 0;
const totals = [
  document.getElementById('total-1'),
  document.getElementById('total-2'),
];
totals.reset = () => {
  totals[0].innerHTML = '0';
  totals[1].innerHTML = '0';
};
const table = [[], []];
table.init = () => {
  for (let i = 0; i < NUM_OF_PLAYERS; i++) {
    for (let j = 0; j < NUM_OF_COMBINATIONS; j++) {
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

const dices = document.getElementsByClassName('dice-value');
dices.getValueOfDiceOnPos = pos => {
  const diceSrs = dices[pos].src;
  const len = diceSrs.length;
  const posOfValueFromRight = 5;
  return diceSrs[len - posOfValueFromRight];
};
dices.getValues = () => {
  const values = [];
  for (let i = 0; i < NUM_OF_DICE_POSITIONS; i++) {
    values.push(dices.getValueOfDiceOnPos(i));
  }
  return values.map(e => parseInt(e));
};

const checkboxes = document.getElementsByClassName('checkbox');
checkboxes.getCheckedDices = () => {
  const values = [];
  for (const checkbox of checkboxes) {
    values.push(checkbox.checked);
  }
  return values.reduce((acc, cur, i) => (cur ? [...acc, i + 1] : acc), []);
};
checkboxes.map = callback => {
  for (const checkbox of checkboxes) {
    callback(checkbox);
  }
};
checkboxes.makeChecked = isChecked => {
  checkboxes.map(checkbox => { checkbox.checked = isChecked; });
};
checkboxes.makeDisable = isDisabled => {
  checkboxes.map(checkbox => { checkbox.disabled = isDisabled; });
};

const whoseTurn = document.getElementById('whose-turn');
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

const throwBtn = document.getElementById('throw-button');
const finishBtn = document.getElementById('finish-button');
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
radioButtons.find = callback => {
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

const setNames = () => {
  const names1 = document.getElementsByClassName('name-1');
  for (const name of names1) {
    name.innerHTML = playersName[0];
  }
  const names2 = document.getElementsByClassName('name-2');
  for (const name of names2) {
    name.innerHTML = playersName[1];
  }
};

const setRightBoard = (currentComb, bonus, total) => {
  document.getElementById('current-comb').innerHTML = currentComb;
  document.getElementById('bonus').innerHTML = bonus;
  document.getElementById('total').innerHTML = total;
};

const findOutWinner = () => {
  checkboxes.makeDisable(true);
  throwBtn.disabled = true;
  finishBtn.disabled = true;
  const res1 = parseInt(totals[0].innerHTML);
  const res2 = parseInt(totals[1].innerHTML);
  if (res1 > res2) whoseTurn.innerHTML = `${playersName[0]} Won!`;
  else if (res1 < res2) whoseTurn.innerHTML = `${playersName[1]} Won!`;
  else whoseTurn.innerHTML = 'Draw!';
};

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time);
});
const roll = async checkedDice => {
  let delay = START_DELAY;
  while (delay < END_DELAY) {
    const randNum = x => Math.floor(Math.random() * x);
    const randPos = checkedDice[randNum(checkedDice.length)] - 1;
    const randDice = randNum(NUM_OF_DICE_VALUE);
    await sleep(delay);
    dices[randPos].src = DICE_SOURCES[randDice];
    delay *= DELAY_ACCELERATION;
  }
};
const firstRolling = async () => {
  throwsLeft.value = 3;
  whoseTurn.innerHTML = `${playersName[player]} throws dices`;
  setRightBoard('...', 0, 0);
  checkboxes.makeChecked(true);
  throwBtn.disabled = false;
  await throwDices();
  radioButtons.show(usedRadioButtons, player);
};

const checkComb = inputDices => { //return array [nameComb, bonus, resultSum]
  const numOfValues = new Array(NUM_OF_DICE_VALUE + 1).fill(0);
  const numOfComb = new Array(NUM_OF_DICE_VALUE).fill(0);
  //numOfComb means number of pairs or triplets or ect
  let sumOfValues = 0;
  for (const value of inputDices) {
    numOfValues[value]++;
    sumOfValues += value;
  }
  for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
    numOfComb[numOfValues[i]]++;
  }
  if (numOfComb[5]) return ['Poker', 50, sumOfValues + 50];
  if (numOfComb[4]) return ['Four of a kind', 40, 4 * numOfValues.indexOf(4) + 40];
  if (numOfComb[3] && numOfComb[2]) return ['Full House', 30, sumOfValues + 30];
  if (numOfComb[3]) return ['Three of a kind', 15, 3 * numOfValues.indexOf(3) + 15];
  if (numOfComb[2] === 2) {
    const sum = 2 * (numOfValues.indexOf(2) + numOfValues.lastIndexOf(2)) + 10;
    return ['Two Pair', 10, sum];
  }
  if (numOfComb[2]) return ['Pair', 5, 2 * numOfValues.indexOf(2) + 5];
  if (numOfValues.slice(2, 6).includes(0)) return ['Chance', 0, sumOfValues];
  return ['Straight', 20, sumOfValues + 20];
};

async function throwDices() {
  const checkedDices = checkboxes.getCheckedDices();
  if (!checkedDices.length) {
    console.error('check the dices you want to roll');
    return;
  }
  checkboxes.makeDisable(true);
  throwBtn.disabled = true;
  finishBtn.disabled = true;
  await roll(checkedDices);
  const values = dices.getValues();
  setRightBoard(...checkComb(values));
  finishBtn.disabled = false;
  throwsLeft.value--;
  checkboxes.makeChecked(false);
  if (throwsLeft.value !== 0) {
    throwBtn.disabled = false;
    checkboxes.makeDisable(false);
  }
}

async function recordResult() {
  const checkedRadio = radioButtons.find(radio => radio.checked);
  if (!checkedRadio) return console.error('make your choice');
  const checkedValue = checkedRadio.value;
  const currentComb = document.getElementById('current-comb').innerHTML;
  const currentTotal = document.getElementById('total').innerHTML;
  const indexOfComb = COMBINATIONS.indexOf(currentComb).toString();
  if (checkedValue === indexOfComb) {
    const prevSum = parseInt(totals[player].innerHTML);
    const total = parseInt(document.getElementById('total').innerHTML);
    totals[player].innerHTML = (prevSum + total).toString();
    table[player][checkedValue].innerHTML = currentTotal;
  } else {
    table[player][checkedValue].innerHTML = '0';
  }
  usedRadioButtons[player][checkedValue] = true;
  if (usedRadioButtons[1].includes(false)) {
    player = (player + 1) % 2;
    radioButtons.disableAll();
    await firstRolling();
  } else {
    findOutWinner();
  }
}

async function restart() {
  table.clear();
  player = 0;
  usedRadioButtons.reset();
  radioButtons.disableAll();
  totals.reset();
  await firstRolling();
}

const startGame = async () => {
  table.init();
  usedRadioButtons.init();
  await restart();
};
