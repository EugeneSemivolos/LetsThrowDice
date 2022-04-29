const NUM_OF_DICE_POSITIONS = 5;
const NUM_OF_DICE = 6;
const DICE_SOURCES = [
  "./images/dice/dice_1.png",
  "./images/dice/dice_2.png",
  "./images/dice/dice_3.png",
  "./images/dice/dice_4.png",
  "./images/dice/dice_5.png",
  "./images/dice/dice_6.png",
];

const waitForTime = (value, time) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), time);
  });
};

const roll = async (checkedDice) => {
  let time = 30;
  while (time < 180) {
    const randPos = checkedDice[Math.floor(Math.random()*checkedDice.length)] - 1;
    const randDice = Math.floor(Math.random()*NUM_OF_DICE);
    dices[randPos].src = await waitForTime(DICE_SOURCES[randDice], time);
    time *= 1.04;
  }
};
roll([1, 3, 5]);
