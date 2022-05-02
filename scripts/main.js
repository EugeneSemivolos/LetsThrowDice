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
  let i = 0;
  for (const usedRadio of usedRadios[player - 1]) {
    if (!usedRadio) radioButtons[i].disabled = false;
    i++;
  }
};
radioButtons.disableAll = () => {
  for (const radioButton of radioButtons) {
    radioButton.disabled = true;
  }
};

const usedRadioButtons = [];
usedRadioButtons.push([]);        // for First player
usedRadioButtons.push([]);         // for Second player

const waitForTime = (value, time) => new Promise(resolve => {
  setTimeout(() => resolve(value), time);
});

const roll = async checkedDice => {
  let time = 30;
  while (time < 180) {
    const randNum = x => Math.floor(Math.random() * x);
    const randPos = checkedDice[randNum(checkedDice.length)] - 1;
    const randDice = randNum(NUM_OF_DICE_VALUE);
    dices[randPos].src = await waitForTime(DICE_SOURCES[randDice], time);
    time *= 1.04;
  }
};

const checkComb = inputDices => { //return array [nameComb, bonus, resultSum]
  const numOfValues = new Array(NUM_OF_DICE_VALUE + 1).fill(0);
  delete numOfValues[0];
  const numOfComb = new Array(NUM_OF_DICE_VALUE).fill(0);
  let sumOfValues = 0;
  for (const value of inputDices) {
    numOfValues[value]++;
    sumOfValues += value;
  }
  for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
    numOfComb[numOfValues[i]]++;
  }
  // Poker
  if (numOfComb[5] === 1) {
    return ['Poker', 50, sumOfValues + 50];
  }
  //Straight
  if (numOfValues[2] && numOfValues[3] && numOfValues[4] &&
  numOfValues[5] && (numOfValues[1] || numOfValues[6])) {
    return ['Straight', 20, sumOfValues + 20];
  }
  // Four of a kind
  if (numOfComb[4] === 1) {
    for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
      if (numOfValues[i] === 4) {
        return ['Square', 40, 4 * i + 40];
      }
    }
  }
  // Full House
  if (numOfComb[3] === 1) {
    if (numOfComb[2] === 1) {
      return ['Full House', 30, sumOfValues + 30];
    } else { // Three of a kind
      for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
        if (numOfValues[i] === 3) {
          return ['Three', 15, 3 * i + 15];
        }
      }
    }
  }
  // Two pair
  if (numOfComb[2] === 2) {
    let sum = 0;
    for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
      if (numOfValues[i] === 2) sum += 2 * i;
    }
    return ['Two Pair', 10, sum + 10];
  }
  // Pair
  for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
    if (numOfValues[i] === 2) {
      return ['Two', 5, 2 * i + 5];
    }
  }
  return ['Chance', 0, sumOfValues];
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
