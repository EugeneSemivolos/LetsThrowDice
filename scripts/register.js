'use strict';

const inputName1 = document.getElementById('name-player1');
const inputName2 = document.getElementById('name-player2');

const hideForm = async () => {
  document.getElementsByClassName('enter-name')[0].style.transform = 'scale(0)';
};

const register = async () => {
  const name1 = inputName1.value;
  const name2 = inputName2.value;
  if (name1 && name2) {
    playersName.push(name1, name2);
    hideForm();
    setNames();
    await startGame();
  }
};
