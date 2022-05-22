import { NUM_OF, COMBINATIONS, DICE_SOURCES, DELAY } from './config.js';
import * as doc from './docObjects.js';

let player = 0;

const setRightBoard = (curComb, bonus, total) => {
  doc.currentComb.innerHTML = curComb;
  doc.currentBonus.innerHTML = bonus;
  doc.currentTotal.innerHTML = total;
};

const sleep = (time) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

const roll = async (checkedDice) => {
  let delay = DELAY.START;
  const randNum = (max) => Math.floor(Math.random() * max);

  while (delay < DELAY.END) {
    const randPos = checkedDice[randNum(checkedDice.length)] - 1;
    const randDice = randNum(NUM_OF.DICE_VALUE);
    await sleep(delay);
    doc.dices[randPos].src = DICE_SOURCES[randDice];
    delay *= DELAY.ACCELERATION;
  }
};

const firstRolling = async () => {
  doc.throwsLeft.value = 3;
  doc.whoseTurn.innerHTML = `${doc.playersName[player]} throws dices`;
  setRightBoard('...', 0, 0);
  doc.checkboxes.makeChecked(true);
  doc.throwBtn.disabled = false;
  await throwDices();
  doc.radioButtons.show(doc.usedRadioButtons, player);
};

const processComb = (inputDices) => {
  const numOfValues = new Array(NUM_OF.DICE_VALUE + 1).fill(0);
  const numOfComb = new Array(NUM_OF.DICE_VALUE).fill(0);
  //numOfComb means number of pairs or triplets or ect
  let sumOfValues = 0;
  for (const value of inputDices) {
    numOfValues[value]++;
    sumOfValues += value;
  }
  for (let i = 1; i <= NUM_OF.DICE_VALUE; i++) {
    numOfComb[numOfValues[i]]++;
  }
  return { numOfComb, numOfValues, sumOfValues };
};

const checkComb = (inputDices) => { //return array [nameComb, bonus, resultSum]
  const { numOfComb, numOfValues, sumOfValues } = processComb(inputDices);
  const [,, pair, triple, square, poker] = numOfComb;

  if (poker) return ['Poker', 50, sumOfValues + 50];
  if (square) return ['Four of a kind', 40, 4 * numOfValues.indexOf(4) + 40];
  if (triple && pair) return ['Full House', 30, sumOfValues + 30];
  if (triple) return ['Three of a kind', 15, 3 * numOfValues.indexOf(3) + 15];
  if (pair === 2) {
    const sum = 2 * (numOfValues.indexOf(2) + numOfValues.lastIndexOf(2)) + 10;
    return ['Two Pair', 10, sum];
  }
  if (pair) return ['Pair', 5, 2 * numOfValues.indexOf(2) + 5];
  if (numOfValues.slice(2, 6).includes(0)) return ['Chance', 0, sumOfValues];
  return ['Straight', 20, sumOfValues + 20];
};

async function throwDices() {
  const checkedDices = doc.checkboxes.getCheckedDices();
  if (!checkedDices.length)
    return console.error('check the dices you want to roll');

  doc.checkboxes.makeDisable(true);
  doc.throwBtn.disabled = true;
  doc.finishBtn.disabled = true;
  await roll(checkedDices);
  const values = doc.dices.getValues();
  setRightBoard(...checkComb(values));
  doc.finishBtn.disabled = false;
  doc.throwsLeft.value--;
  doc.checkboxes.makeChecked(false);
  if (doc.throwsLeft.value !== 0) {
    doc.throwBtn.disabled = false;
    doc.checkboxes.makeDisable(false);
  }
}

const findOutWinner = () => {
  doc.checkboxes.makeDisable(true);
  doc.throwBtn.disabled = true;
  doc.finishBtn.disabled = true;
  const res1 = parseInt(doc.totals[0].innerHTML);
  const res2 = parseInt(doc.totals[1].innerHTML);
  if (res1 > res2) doc.whoseTurn.innerHTML = `${doc.playersName[0]} Won!`;
  else if (res1 < res2) doc.whoseTurn.innerHTML = `${doc.playersName[1]} Won!`;
  else doc.whoseTurn.innerHTML = 'Draw!';
};

async function recordResult() {
  const checkedRadio = doc.radioButtons.find((radio) => radio.checked);
  if (!checkedRadio) return console.error('make your choice');

  const indexOfComb = COMBINATIONS.indexOf(doc.currentComb.innerHTML).toString();
  if (checkedRadio.value === indexOfComb) {
    const prevSum = parseInt(doc.totals[player].innerHTML);
    const total = parseInt(document.getElementById('total').innerHTML);
    doc.totals[player].innerHTML = (prevSum + total).toString();
    doc.table[player][checkedRadio.value].innerHTML = doc.currentTotal.innerHTML;
  } else {
    doc.table[player][checkedRadio.value].innerHTML = '0';
  }
  doc.usedRadioButtons[player][checkedRadio.value] = true;

  const isGameOver = !doc.usedRadioButtons[1].includes(false);
  if (isGameOver) {
    findOutWinner();
  } else {
    player = (player + 1) % 2;
    doc.radioButtons.disableAll();
    await firstRolling();
  }
}

export async function restart() {
  doc.table.clear();
  player = 0;
  doc.usedRadioButtons.reset();
  doc.radioButtons.disableAll();
  doc.totals.reset();
  await firstRolling();
}

window.addEventListener('DOMContentLoaded', () => {
  doc.throwBtn.addEventListener('click', throwDices);
  doc.finishBtn.addEventListener('click', recordResult);
  doc.restartButton.addEventListener('click', restart);
});
