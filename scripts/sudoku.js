class Sudoku {

// given a sudoku cell, returns the row
  static #getRow(cell) {
    return Math.floor(cell / 9);
  }

// given a sudoku cell, returns the column
  static #getCol(cell) {
    return cell % 9;
  }

// given a sudoku cell, returns the 3x3 block
  static #getBlock(cell) {
    return Math.floor(this.#getRow(cell) / 3) * 3 + Math.floor(this.#getCol(cell) / 3);
  }

// given a number, a row and a sudoku, returns true if the number can be placed in the row
  static #isPlaceableInARow(number, row, sudoku) {
    for (let i = 0; i <= 8; i++) {
      if (sudoku[row * 9 + i] === number) {
        return false;
      }
    }

    return true;
  }

// given a number, a column and a sudoku, returns true if the number can be placed in the column
  static #isPlaceableInACol(number, col, sudoku) {
    for (let i = 0; i <= 8; i++) {
      if (sudoku[col + 9 * i] === number) {
        return false;
      }
    }

    return true;
  }

// given a number, a 3 x 3 block and a sudoku, returns true if the number can be placed in the block
  static #isPlaceableInABlock(number, block, sudoku) {
    for (let i = 0; i <= 8; i++) {
      if (sudoku[Math.floor(block / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (block % 3)] === number) {
        return false;
      }
    }

    return true;
  }

// given a cell, a number and a sudoku, returns true if the number can be placed in the cell
  static #isPossibleNumber(cell, number, sudoku) {
    const row = this.#getRow(cell);
    const col = this.#getCol(cell);
    const block = this.#getBlock(cell);

    return this.#isPlaceableInARow(number, row, sudoku) &&
           this.#isPlaceableInACol(number, col, sudoku) &&
           this.#isPlaceableInABlock(number, block, sudoku);
  }

// given a row and a sudoku, returns true if it's a legal row
  static #isCorrectRow(row, sudoku) {
    const rightSequence = '123456789';
    const rowTemp = [];
    for (let i = 0; i <= 8; i++) {
      rowTemp[i] = sudoku[row * 9 + i];
    }

    return rowTemp.sort().join('') === rightSequence;
  }

// given a column and a sudoku, returns true if it's a legal column
  static #isCorrectCol(col, sudoku) {
    const rightSequence = '123456789';
    const colTemp = [];
    for (let i = 0; i <= 8; i++) {
      colTemp[i] = sudoku[col + i * 9];
    }

    return colTemp.sort().join('') === rightSequence;
  }

// given a 3x3 block and a sudoku, returns true if it's a legal block
  static #isCorrectBlock(block, sudoku) {
    const rightSequence = '123456789';
    const blockTemp = [];
    for (let i = 0; i <= 8; i++) {
      blockTemp[i] = sudoku[Math.floor(block / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (block % 3)];
    }

    return blockTemp.sort().join('') === rightSequence;
  }

// given a sudoku, returns true if the sudoku is solved
  static #isSolvedSudoku(sudoku) {
    for (let i = 0; i <= 8; i++) {
      if (!this.#isCorrectBlock(i, sudoku) || !this.#isCorrectRow(i, sudoku) || !this.#isCorrectCol(i, sudoku)) {
        return false;
      }
    }

    return true;
  }

// given a cell and a sudoku, returns an array with all possible values we can write in the cell
  static #determinePossibleValues(cell, sudoku) {
    const possible = [];
    for (let i = 1; i <= 9; i++) {
      if (this.#isPossibleNumber(cell, i, sudoku)) {
        possible.unshift(i);
      }
    }

    return possible;
  }

// given an array of possible values assignable to a cell, returns a random value picked from the array
  static #determineRandomPossibleValue(possible, cell) {
    const randomPicked = Math.floor(Math.random() * possible[cell].length);
    return possible[cell][randomPicked];
  }

// given a sudoku, returns a two dimension array with all possible values 
  static #scanSudokuForUnique(sudoku) {
    const possible = [];
    for (let i = 0; i <= 80; i++) {
      if (sudoku[i] === 0) {
        possible[i] = this.#determinePossibleValues(i, sudoku);
        if (possible[i].length === 0) {
          return false;
        }
      }
    }

    return possible;
  }

// given an array and a number, removes the number from the array
  static #removeAttempt(attemptArray, number) {
    const newArray = [];
    for (let i = 0; i < attemptArray.length; i++) {
      if (attemptArray[i] !== number) {
        newArray.unshift(attemptArray[i]);
      }
    }

    return newArray;
  }

// given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
  static #nextRandom(possible) {
    let max = 9;
    let minChoices = 0;
    for (let i = 0; i <= 80; i++) {
      if (possible[i] !== undefined) {
        if ((possible[i].length <= max) && (possible[i].length > 0)) {
          max = possible[i].length;
          minChoices = i;
        }
      }
    }

    return minChoices;
  }

  // translates complexity to the chance for number to appear on board
  mapComplexityToRandomness = {
    veryEasy : 0.8,
    easy     : 0.7,
    medium   : 0.6,
    hard     : 0.5,
    veryHard : 0.4,
    inhuman  : 0.35
  };

  // given a sudoku and complexity, replaces some elements in solved sudoku with zeroes
  replaceWithZeroes(sudoku, complexity) {
    const unsolvedSudoku = [];
    const chanceToBeShown = this.mapComplexityToRandomness[complexity];
    for (let i = 0; i < sudoku.length; i++) {
      unsolvedSudoku[i] = Math.random() < chanceToBeShown ? sudoku[i] : 0;
    }

    return unsolvedSudoku;
  }

// given complexity, creates a sudoku and returns both solved and unsolved ones
  create(complexity) {
    let sudoku = new Array(81).fill(0);
    const saved = [];
    const savedSudoku = [];
    let i = 0;
    let nextMove;
    let whatToTry;
    let attempt;
    while (!Sudoku.#isSolvedSudoku(sudoku)) {
      i++;
      nextMove = Sudoku.#scanSudokuForUnique(sudoku);
      if (nextMove === false) {
        nextMove = saved.pop();
        sudoku = savedSudoku.pop();
      }
      whatToTry = Sudoku.#nextRandom(nextMove);
      attempt = Sudoku.#determineRandomPossibleValue(nextMove, whatToTry);
      if (nextMove[whatToTry].length > 1) {
        nextMove[whatToTry] = Sudoku.#removeAttempt(nextMove[whatToTry], attempt);
        saved.push(nextMove.slice());
        savedSudoku.push(sudoku.slice());
      }
      sudoku[whatToTry] = attempt;
    }

    return {
      solved: sudoku,
      unsolved: this.replaceWithZeroes(sudoku, complexity)
    };
  }
}
