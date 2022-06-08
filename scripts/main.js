import { numOf, diceSources, rollDelay, combinations } from './config.js';
import * as dom from './domObjects.js';
import { sleep, setAttribute, randNum } from './utils.js';

let player = 0;

const setRightBoard = (curComb, bonus, total) => {
  dom.currentComb.innerHTML = curComb;
  dom.currentBonus.innerHTML = bonus;
  dom.currentTotal.innerHTML = total;
};

const roll = async (checkedDices) => {
  checkedDices = checkedDices.map((dice, i) => i + 1);

  let delay = rollDelay.start;
  while (delay < rollDelay.end) {
    await sleep(delay);
    const randPos = checkedDices[randNum(checkedDices.length)] - 1;
    const randDice = randNum(numOf.diceValue);
    dom.dices[randPos].src = diceSources[randDice];
    delay *= rollDelay.acceleration;
  }
};

const firstRolling = async () => {
  dom.throwsLeft.value = numOf.rounds;
  dom.whoseTurn.innerHTML = `${dom.playersName[player]} throws dices`;
  setRightBoard('...', 0, 0);
  setAttribute(dom.checkboxes, 'checked', true);
  dom.throwBtn.disabled = false;
  await throwDices();
  dom.radioButtons.show(dom.usedRadioButtons, player);
};

const processComb = (inputDices) => {
  const numOfValues = new Array(numOf.diceValue + 1).fill(0);
  const numOfComb = new Array(numOf.diceValue).fill(0);
  //numOfComb means number of pairs or triplets or ect
  let sumOfValues = 0;
  for (const value of inputDices) {
    numOfValues[value]++;
    sumOfValues += value;
  }
  for (let i = 1; i <= numOf.diceValue; i++) {
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
  const checkedDices = dom.checkboxes.getCheckedDices();
  if (!checkedDices.length)
    return console.error('check the dices you want to roll');

  setAttribute(dom.radioButtons, 'checked', 0);
  setAttribute(dom.checkboxes, 'disabled', true);
  dom.throwBtn.disabled = true;
  dom.finishBtn.disabled = true;

  await roll(checkedDices);

  const values = dom.dices.getValues();
  setRightBoard(...checkComb(values));
  dom.throwsLeft.value--;
  setAttribute(dom.checkboxes, 'checked', false);
  dom.finishBtn.disabled = false;
  if (dom.throwsLeft.value !== 0) {
    dom.throwBtn.disabled = false;
    setAttribute(dom.checkboxes, 'disabled', false);
  }
}

const findOutWinner = () => {
  setAttribute(dom.checkboxes, 'disabled', true);
  dom.throwBtn.disabled = true;
  dom.finishBtn.disabled = true;
  const res1 = parseInt(dom.totals[0].innerHTML);
  const res2 = parseInt(dom.totals[1].innerHTML);
  if (res1 > res2) dom.whoseTurn.innerHTML = `${dom.playersName[0]} Won!`;
  else if (res1 < res2) dom.whoseTurn.innerHTML = `${dom.playersName[1]} Won!`;
  else dom.whoseTurn.innerHTML = 'Draw!';
};

async function recordResult() {
  const checkedRadio = dom.radioButtons.find((radio) => radio.checked);
  if (!checkedRadio) return console.error('make your choice');

  const indexOfComb = combinations.indexOf(dom.currentComb.innerHTML);
  if (checkedRadio.value === indexOfComb.toString()) {
    const prevSum = parseInt(dom.totals[player].innerHTML);
    const total = parseInt(document.getElementById('total').innerHTML);
    dom.totals[player].innerHTML = (prevSum + total).toString();
    dom.table[player][checkedRadio.value].innerHTML = dom.currentTotal.innerHTML;
  } else {
    dom.table[player][checkedRadio.value].innerHTML = '0';
  }
  dom.usedRadioButtons[player][checkedRadio.value] = true;

  const isGameOver = !dom.usedRadioButtons[1].includes(false);
  if (isGameOver) {
    findOutWinner();
  } else {
    player = (player + 1) % 2;
    setAttribute(dom.radioButtons, 'disabled', true);
    await firstRolling();
  }
}

export async function restart() {
  setAttribute(dom.radioButtons, 'checked', 0);
  setAttribute(dom.radioButtons, 'disabled', true);
  player = 0;
  dom.usedRadioButtons.reset();
  dom.totals.reset();
  await firstRolling();
}

window.addEventListener('DOMContentLoaded', () => {
  dom.throwBtn.addEventListener('click', throwDices);
  dom.finishBtn.addEventListener('click', recordResult);
  dom.restartButton.addEventListener('click', restart);
});

