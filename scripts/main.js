const NUM_OF_DICE_POSITIONS = 5;
const NUM_OF_DICE_VALUE = 6;
const DICE_SOURCES = [
  "./images/dice/dice_1.png",
  "./images/dice/dice_2.png",
  "./images/dice/dice_3.png",
  "./images/dice/dice_4.png",
  "./images/dice/dice_5.png",
  "./images/dice/dice_6.png",
];

const dices = document.getElementsByTagName('img');

dices.getValueOfDiceOnPos = (pos) => {
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
  return values.map((e) => (parseInt(e)));
};

const waitForTime = (value, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), time);
  });
};
const roll = async (checkedDice) => {
  let time = 30;
  while (time < 180) {
    const randPos = checkedDice[Math.floor(Math.random()*checkedDice.length)] - 1;
    const randDice = Math.floor(Math.random()*NUM_OF_DICE_VALUE);
    dices[randPos].src = await waitForTime(DICE_SOURCES[randDice], time);
    time *= 1.04;
  }
};

const checkComb = (inputDices) => { //return array [nameComb, bonus, resultSum]
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
    return ["Poker", 50, sumOfValues + 50];
  }
  //Straight
  if (numOfValues[2] && numOfValues[3] && numOfValues[4] &&
  numOfValues[5] && (numOfValues[1] || numOfValues[6])) {
    return ["Straight", 20, sumOfValues + 20];
  }
  // Four of a kind
  if (numOfComb[4] === 1) {
    for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
      if (numOfValues[i] === 4) {
        return ["Square", 40, 4 * i + 40];
      }
    }
  }
  // Full House
  if (numOfComb[3] === 1) {
    if (numOfComb[2] === 1) {
      return ["Full House", 30, sumOfValues + 30];
    } else { // Three of a kind
      for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
        if (numOfValues[i] === 3) {
          return ["Three", 15, 3 * i + 15];
        }
      }
    }
  }
  // Two pair
  if (numOfComb[2] === 2) {
    let sum = 0;
    for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
      if (numOfValues[i] === 2) sum += 2*i;
    }
    return ["Two Pair", 10, sum + 10];
  }
  // Pair
  for (let i = 1; i <= NUM_OF_DICE_VALUE; i++) {
    if (numOfValues[i] === 2) {
      return ["Two", 5, 2 * i + 5]
    }
  }
  return ["Chance", 0, sumOfValues];
}

const throwDices = async () => {
  const throwBtn = document.getElementById('throw-button');
  throwBtn.disabled = true;
  await roll([1, 2, 3, 4, 5]);
  const values = dices.getValues();
  console.log(values);
  const [nameComb, bonus, resultSum] = checkComb(values);
  document.getElementById('current-comb').innerHTML = nameComb;
  document.getElementById('bonus').innerHTML = bonus.toString();
  document.getElementById('total').innerHTML = resultSum.toString();
  throwBtn.disabled = false;
};
