import {GridMode} from '../enums/grid_mode.enum';
import {GridElement} from './grid_element.model';

export class Nonogram {

  private _gridFactor: number;

  constructor(gridFactor: number) {
    this._gridFactor = gridFactor;
  }

  public isSolvable(elements, suggestions): boolean {

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

    return this._getAmountOfSolutions(rowsPossibilities, columnsPossibilities) == 1;
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

  private _createTheGrid(): any {

    const output = [];
    const gridFactorAmount = Math.pow(this._gridFactor, 2);

    let rowIndex = 0;
    let columnIndex = 0;

    for (let i = 0; i < gridFactorAmount; i++) {
      if (!output[columnIndex]) {
        output[columnIndex] = [];
      }

      output[columnIndex][rowIndex++] = new GridElement();

      if (rowIndex == this._gridFactor) {
        rowIndex = 0;
        columnIndex++;
      }

    }

    return output;
  }


  private _getAmountOfSolutions(rowsPossibilities: any[], columnsPossibilities: any[]): number {

    const previousSolutions = [];
    let amountOfSolutions = 0;

    for (let iRow = 0; iRow < rowsPossibilities.length; iRow++) {

      for (let i = 0; i < rowsPossibilities[iRow].possibilities.length; i++) {
        const board = this._setInitialBoard(rowsPossibilities[iRow].possibilities[i], iRow, rowsPossibilities);
        amountOfSolutions = this._isGridCorrect(board, columnsPossibilities, previousSolutions) ? ++amountOfSolutions : amountOfSolutions;

        let indexRow = 0;
        let indexRowPoss = 0;

        const resetIndexes = () => {
          indexRow++;
          indexRowPoss = 0;
        };

        do {

          if (indexRow == iRow) {
            resetIndexes();
            continue;
          }

          const row = rowsPossibilities[iRow].possibilities[indexRowPoss];

          if (row) {
            this._addRowToBoard(board, row, indexRow);

            amountOfSolutions = this._isGridCorrect(board, columnsPossibilities, previousSolutions) ? ++amountOfSolutions : amountOfSolutions;

            if (amountOfSolutions >= 2) {
              return amountOfSolutions;
            }

            indexRowPoss++;

          } else {
            resetIndexes();
          }

        } while (indexRow > rowsPossibilities.length);

        amountOfSolutions = this._isGridCorrect(board, columnsPossibilities, previousSolutions) ? ++amountOfSolutions : amountOfSolutions;

        if (amountOfSolutions >= 2) {
          return amountOfSolutions;
        }
      }

    }

    return amountOfSolutions;
  }


  private _setInitialBoard(initialRow: string, initialRowIndex: number, rowsPossibilities: any[]) {

    const board = this._createTheGrid();

    for (let i = 0; i < rowsPossibilities.length; i++) {
      if (initialRowIndex == i) {

        this._addRowToBoard(board, initialRow, i);

        continue;
      }

      this._addRowToBoard(board, rowsPossibilities[i].possibilities[0], i);
    }

    return Object.assign([], board);
  };

  private _addRowToBoard(board, row, rowIndex) {

    const addModeToPosition = (columnIndex, mode) => {
      board[rowIndex][columnIndex].mode = mode;
    };

    for (let indexRowPossChar = 0; indexRowPossChar < row.length; indexRowPossChar++) {
      addModeToPosition(indexRowPossChar, row[indexRowPossChar] == '1' ? GridMode.SELECTED : GridMode.EMPTY);
    }
  };

  private _isGridAlreadeyAdded(board, previousSolutions: any[]): boolean {

    let boardSequence = '';

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        boardSequence += board[i][j].mode == GridMode.SELECTED ? '1' : '0';
      }
      boardSequence += ' - ';
    }

    if (previousSolutions.indexOf(boardSequence) != -1) {
      return true;
    }

    previousSolutions.push(boardSequence);

    return false;
  }

  private _isGridCorrect(board, columnsPossibilities: any[], previousSolutions: any[]): boolean {

    if (this._isGridAlreadeyAdded(board, previousSolutions)) {
      return false; // grid is not correct, because it was already added
    }

    for (let i = 0; i < this._gridFactor; i++) {

      let column = '';

      for (let j = 0; j < this._gridFactor; j++) {
        column += board[j][i].mode == GridMode.SELECTED ? '1' : '0';
      }

      if (columnsPossibilities[i].possibilities.indexOf(column) == -1) {
        return false;
      }

    }

    return true;
  };

}
