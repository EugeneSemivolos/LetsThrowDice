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
  return new Promise(resolve => {
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

const throwDices = async () => {
  const throwBtn = document.getElementById('throw-button');
  throwBtn.disabled = true;
  await roll([1, 2, 3, 4, 5]);
  const values = dices.getValues();
  console.log(values);
};
