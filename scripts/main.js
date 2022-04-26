const dice = document.getElementsByTagName('img');
const DICE_SOURCES = [
  "./images/dice/dice_1.png",
  "./images/dice/dice_2.png",
  "./images/dice/dice_3.png",
  "./images/dice/dice_4.png",
  "./images/dice/dice_5.png",
  "./images/dice/dice_6.png",
];

const waitForSecond = (value) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), 50);
  });

};

(async () => {
  let k = 0;
  while (k !== 10) {
    for (const source of DICE_SOURCES) {
      const i = Math.floor(Math.random()*6);
      dice[i].src = await waitForSecond(source);
    }
    k++;
  }
})();
