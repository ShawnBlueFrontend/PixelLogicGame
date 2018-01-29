import {GridMode} from "../enums/grid_mode.enum";

export class Nonogram {

  private _gridFactor: number;

  constructor(gridFactor: number) {
    this._gridFactor = gridFactor;
  }

  public isSolvable(elements, suggestions): boolean {
    let amountOfSolution: number = 0;

    // find all possible solutions foreach row
    // find all possible solutions foreach column
    // match these values

    const rowsPossibilities = [];
    const columnsPossibilities = [];

    for (let i = 0; i < elements.length; i++) {

      rowsPossibilities.push({
        index: i,
        possibilities: this._getRowPossibilities(suggestions, i)
      });

      columnsPossibilities.push({
        index: i,
        possibilities: this._getColumnPossibilities(suggestions, i)
      });

    }

    this._tryToSolveThePuzzle(elements, rowsPossibilities, columnsPossibilities);

    return amountOfSolution == 1;
  }


  private _setInitialValue(suggestion: any): string {

    let initialPossibility = '';

    const add0ToPossibility = () => {
      initialPossibility += '0';
    };
    const add1ToPossibility = () => {
      initialPossibility += '1';
    };

    suggestion.numbers.forEach((number: number) => {

      for (let i = 0; i < number; i++) {
        add1ToPossibility();
      }

      if (initialPossibility.length != this._gridFactor) {
        add0ToPossibility();
      }

    });

    // fill the last 0's
    for (let i = initialPossibility.length; i < this._gridFactor; i++) {
      add0ToPossibility();
    }

    return initialPossibility;
  }

  private _getRowPossibilities(suggestions: any, index: number): string[] {

    const rowSuggestion = suggestions.rows.find(row => row.index == index);
    const initialPossibility = this._setInitialValue(rowSuggestion);

    return this._calculatePossibilities(initialPossibility, rowSuggestion);
  }

  private _getColumnPossibilities(suggestions: any, index: number): string[] {
    const columnSuggestion = suggestions.columns.find(row => row.index == index);
    const initialPossibility = this._setInitialValue(columnSuggestion);

    return this._calculatePossibilities(initialPossibility, columnSuggestion);
  }


  private _calculatePossibilities(initial: string, rowSuggestion: { index: number, numbers: number[] }): string[] {

    const output = [initial];

    if (!rowSuggestion.numbers.length) {
      return output;
    }

    const addOption = (option: string) => {

      if (output.find(element => element == option)) {
        return;
      }

      output.push(option);
    };

    const moveLast0 = (indexOf0: number, toAdd: string = '0') => {

      const valueToChange = initial.slice(0, indexOf0) + initial.slice(indexOf0 + toAdd.length);

      if (indexOf0 == 0) {
        return;
      }

      for (let i = indexOf0 - 1; i >= 0; i--) {

        if (valueToChange[i] == '1' && valueToChange[i - 1] == '1') {
          continue;
        }

        const newValue = valueToChange.slice(0, i) + toAdd + valueToChange.slice(i);

        addOption(newValue);
      }

    };

    const getZerosToAdd = (amount: number): string => {
      let zeros = '';

      if (!amount) {
        amount = 1;
      }

      for (let i = 0; i < amount; i++) {
        zeros += '0';
      }
      return zeros;
    };

    for (let i = initial.length - 1; i >= 0; i--) {

      let number = '';
      let isPreviousAlso0: boolean = false;
      let counter: number = 0;

      do {
        number = initial[i - counter];
        isPreviousAlso0 = initial[i - counter - 1] == '0';
        const isBetween1s = initial[i - counter - 1] == '1' && initial[i - counter + 1] == '1';

        if (isBetween1s || number != '0') {
          break;
        }

        moveLast0(i - counter, getZerosToAdd(counter + 1));

        counter++;
      } while (isPreviousAlso0);

    }

    return output;
  }

  private _tryToSolveThePuzzle(elements, rowPossibilities, columnPossibilities): void {


    const newRowPos = Object.assign([], rowPossibilities);
    const newColPos = Object.assign([], columnPossibilities);

    // 1. start empty board
    const newBoard = Object.assign([], elements);
    console.log(elements);

    let rowCounter = 0;

    const addRow = (rowIndex, rowPoss) => {

      for (let i = 0; i < rowPoss.length; i++) {
        newBoard[rowIndex][i].mode = rowPoss[i] == '1' ? GridMode.SELECTED : GridMode.EMPTY;
      }

      if (!isPuzzleStillPossible()) {
        for (let i = 0; i < rowPoss.length; i++) {
          newBoard[rowIndex][i].mode = GridMode.EMPTY;
        }

        return false;
      }

      return true;
    };

    const addCol = (colIndex, colPoss) => {

    };

    const isPuzzleStillPossible = (): boolean => {

      // match the rows with the column poss

      for (let i = 0; i < newBoard.length; i++) {

        let column = '';

        for (let j = 0; j < newBoard.length; j++) {
          column += newBoard[i][j].mode == GridMode.SELECTED ? '1' : '0';
        }

        console.log(`${i}`, column);

      }
      console.log('');

      return true;
    };

    do {

      for (let i = newRowPos[rowCounter].possibilities.length - 1; i >= 0; i--) {
        const canAddRow = addRow(rowCounter, newRowPos[rowCounter].possibilities[i]);

        if (canAddRow) {
          // continue to the next row
          // console.log('continue to the next row')

        } else {
          // remove possibility
          // continue to next possibility
          newRowPos[rowCounter].possibilities.splice(i, 1);

          // console.log('continue to the next poss');
        }
      }


    } while (++rowCounter < newRowPos.length && this._hasPossibilities(newRowPos) && this._hasPossibilities(newColPos));

    /*
    1. start empty board
    2. Add 1 row (first possibility)
    3. Match it if it's even possible with the column constraints (row 1 ==> all columns position 1 merged ==> row n columns pos n merged)
    4. Matches? Yes: continue with the next row ; NO: take another row possibility (if no possibilities left, go back to the previous row, and take another possibility)
    5. If no possibilities for row n ==> no possibilities
    6. return to 2 with different row
    7. If to much possibilities for row n ==> not solvable
     */
  }

  private _hasPossibilities = (possibilities): boolean => possibilities.some((possibilty) => possibilty.possibilities.length);

}
