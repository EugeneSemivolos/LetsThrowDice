import { table, usedRadioButtons } from './docObjects.js';
import { restart } from './main.js';

const hideForm = () => {
  document.querySelector('.enter-name').style.transform = 'scale(0)';
};

const setNames = (name1, name2) => {
  const names1 = document.getElementsByClassName('name-1');
  for (const name of names1) {
    name.innerHTML = name1;
  }
  const names2 = document.getElementsByClassName('name-2');
  for (const name of names2) {
    name.innerHTML = name2;
  }
};

const startGame = async () => {
  table.init();
  usedRadioButtons.init();
  await restart();
};

async function register() {
  const name1 = document.getElementById('input-name1').value;
  const name2 = document.getElementById('input-name2').value;
  if (name1 && name2) {
    hideForm();
    setNames(name1, name2);
    await startGame();
  } else {
    console.error('Enter name!');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const registerButton = document.querySelector('.form__button');
  registerButton.addEventListener('click', register);
});
