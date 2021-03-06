import { table, usedRadioButtons, playersName } from './domObjects.js';
import { restart } from './main.js';
import { numOf } from './config.js';

const hideForm = () => {
  document.querySelector('.enter-name').style.transform = 'scale(0)';
};

const setNames = (...inputNames) => {
  for (const [i, inputName] of inputNames.entries()) {
    const nameFields = document.querySelectorAll(`.name-${i + 1}`);
    for (const nameField of nameFields) {
      nameField.innerHTML = inputName;
    }
    playersName[i] = inputName;
  }
};

const initTable = () => {
  for (let i = 0; i < numOf.players; i++) {
    for (let j = 0; j < numOf.combinations; j++) {
      const cell = document.getElementById(i.toString() + j.toString());
      table[i].push(cell);
    }
  }
};

const initUsedRadioBtns = () => {
  usedRadioButtons.push(
    new Array(numOf.combinations).fill(false),
    new Array(numOf.combinations).fill(false),
  );
};

const startGame = async () => {
  initTable();
  initUsedRadioBtns();
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

  const inputAreas = document.querySelectorAll('.form__input');
  for (const inputArea of inputAreas) {
    inputArea.addEventListener('blur', (event) => {
      if (event.target.value !== '') {
        event.target.nextElementSibling.classList.add('filled');
      } else {
        event.target.nextElementSibling.classList.remove('filled');
      }
    });
  }
});
