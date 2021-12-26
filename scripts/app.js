let sudoku;
const sudokuObject = new Sudoku();
const board = document.getElementById('sudoku');
const solverButton = document.getElementById('solver');
const generatorButtonVeryEasy = document.getElementById('generator-very_easy');
const generatorButtonEasy = document.getElementById('generator-easy');
const generatorButtonMedium = document.getElementById('generator-medium');
const generatorButtonHard = document.getElementById('generator-hard');
const generatorButtonVeryHard = document.getElementById('generator-very_hard');
const generatorButtonInhuman = document.getElementById('generator-inhuman');
const NUMBER_OF_FIELDS = 81;

const paintEmptyBoard = () => {
  for (let i = 0; i < NUMBER_OF_FIELDS; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '9';
    if (
      ((i % 9 === 0 || i % 9 === 1 || i % 9 === 2) && i < 21) ||
      ((i % 9 === 6 || i % 9 === 7 || i % 9 === 8) && i < 27) ||
      ((i % 9 === 0 || i % 9 === 1 || i % 9 === 2) && i > 53) ||
      ((i % 9 === 6 || i % 9 === 7 || i % 9 === 8) && i > 53) ||
      ((i % 9 === 3 || i % 9 === 4 || i % 9 === 5) && (i > 27 && i < 53))
    ) {
      input.classList.add('odd-section');
    }
    board.appendChild(input);
  }
};

const populate = (sol, checkSolution) => {
  const inputs = document.querySelectorAll('input');
  if (sol.length > 0) {
    inputs.forEach((input, i) => {
      if (checkSolution && sol[i] !== input.value) {
        input.classList.add('incorrect');
      }
      if (sol[i] === '.') {
        input.value = '';
      } else {
        input.value = sol[i];
      }
    });
  }
};

const generate = (complexity = 'medium') => {
  board.innerHTML = '';
  sudoku = sudokuObject.create(complexity);
  paintEmptyBoard();
  populate(sudoku.unsolved, false);
};

generate('medium');
solverButton.addEventListener('click', () => populate(sudoku.solved, true));
generatorButtonVeryEasy.addEventListener('click', () => generate('veryEasy'));
generatorButtonEasy.addEventListener('click', () => generate('easy'));
generatorButtonMedium.addEventListener('click', () => generate('medium'));
generatorButtonHard.addEventListener('click', () => generate('hard'));
generatorButtonVeryHard.addEventListener('click', () => generate('veryHard'));
generatorButtonInhuman.addEventListener('click', () => generate('inhuman'));
