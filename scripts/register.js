'use strict';

const hideForm = () => {
  document.getElementsByClassName('enter-name')[0].style.transform = 'scale(0)';
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

const startGame = async () => {
  table.init();
  usedRadioButtons.init();
  await restart();
};

async function register() {
  const name1 = document.getElementById('name-player1').value;
  const name2 = document.getElementById('name-player2').value;
  if (name1 && name2) {
    playersName.push(name1, name2);
    hideForm();
    setNames();
    await startGame();
  }
}
