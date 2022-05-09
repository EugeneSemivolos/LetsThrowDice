'use strict';

const playersName = [];
let player = 0;

const setRightBoard = (currentComb, bonus, total) => {
  document.getElementById('current-comb').innerHTML = currentComb;
  document.getElementById('bonus').innerHTML = bonus;
  document.getElementById('total').innerHTML = total;
};

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time);
});

const roll = async checkedDice => {
  let delay = DELAY.START;
  while (delay < DELAY.END) {
    const randNum = x => Math.floor(Math.random() * x);
    const randPos = checkedDice[randNum(checkedDice.length)] - 1;
    const randDice = randNum(NUM_OF.DICE_VALUE);
    await sleep(delay);
    dices[randPos].src = DICE_SOURCES[randDice];
    delay *= DELAY.ACCELERATION;
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

const processComb = inputDices => {
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

const checkComb = inputDices => { //return array [nameComb, bonus, resultSum]
  const { numOfComb, numOfValues, sumOfValues } = processComb(inputDices);

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
  if (!checkedDices.length)
    return console.error('check the dices you want to roll');

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

async function recordResult() {
  const checkedRadio = radioButtons.find(radio => radio.checked);
  if (!checkedRadio) return console.error('make your choice');

  const indexOfComb = COMBINATIONS.indexOf(currentComb.innerHTML).toString();
  if (checkedRadio.value === indexOfComb) {
    const prevSum = parseInt(totals[player].innerHTML);
    const total = parseInt(document.getElementById('total').innerHTML);
    totals[player].innerHTML = (prevSum + total).toString();
    table[player][checkedRadio.value].innerHTML = currentTotal.innerHTML;
  } else {
    table[player][checkedRadio.value].innerHTML = '0';
  }
  usedRadioButtons[player][checkedRadio.value] = true;

  const isGameOver = !usedRadioButtons[1].includes(false);
  if (isGameOver) {
    findOutWinner();
  } else {
    player = (player + 1) % 2;
    radioButtons.disableAll();
    await firstRolling();
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
