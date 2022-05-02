'use strict';

const NUM_OF_DICE_POSITIONS = 5;
const NUM_OF_DICE_VALUE = 6;
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
const radioButtons = document.getElementsByClassName('radio');
radioButtons.show = (usedRadios, player) => {
  for (const [i, usedRadio] of usedRadios[player - 1].entries()) {
    if (!usedRadio) radioButtons[i].disabled = false;
  }
};
radioButtons.disableAll = () => {
  for (const radioButton of radioButtons) {
    radioButton.disabled = true;
  }
};

const usedRadioButtons = [];
const sample = new Array(8).fill(false);
usedRadioButtons.push(sample); // for First player
usedRadioButtons.push(sample); // for Second player

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
  if (numOfComb[4]) return ['Square', 40, 4 * numOfValues.indexOf(4) + 40];
  if (numOfComb[3] && numOfComb[2]) return ['Full House', 30, sumOfValues + 30];
  if (numOfComb[3]) return ['Three', 15, 3 * numOfValues.indexOf(3) + 15];
  if (numOfComb[2] === 2) {
    const sum = 2 * (numOfValues.indexOf(2) + numOfValues.lastIndexOf(2)) + 10;
    return ['Two Pair', 10, sum];
  }
  if (numOfComb[2]) return ['Two', 5, 2 * numOfValues.indexOf(2) + 5];
  if (numOfValues.slice(2, 6).includes(0)) return ['Chance', 0, sumOfValues];
  return ['Straight', 20, sumOfValues + 20];
};

const throwDices = async () => {
  const checkedDices = checkboxes.getCheckedDices();
  if (!checkedDices.length) {
    console.error('check the dices you want to roll');
    return;
  }
  checkboxes.makeDisable(true);
  throwBtn.disabled = true;
  await roll(checkedDices);
  const values = dices.getValues();
  const [nameComb, bonus, resultSum] = checkComb(values);
  document.getElementById('current-comb').innerHTML = nameComb;
  document.getElementById('bonus').innerHTML = bonus.toString();
  document.getElementById('total').innerHTML = resultSum.toString();
  throwsLeft.value--;
  checkboxes.makeChecked(false);
  if (throwsLeft.value !== 0) {
    throwBtn.disabled = false;
    checkboxes.makeDisable(false);
  }
};

const restart = () => {
  whoseTurn.innerHTML = 'player 1 throws dices';
  throwsLeft.value = 3;
  checkboxes.makeChecked(true);
  checkboxes.makeDisable(false);
  throwBtn.disabled = false;
  throwDices();
};
restart();
