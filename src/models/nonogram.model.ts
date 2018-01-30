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


    let amountOfSolutions = 0;

    const addModeToPosition = (board, rowIndex, columnIndex, mode) => {
      board[rowIndex][columnIndex].mode = mode;
    };

    const fillBoard = (row, rowIndex) => {

      if (row.indexOf('1') == -1) {
        return;
      }

      console.log(row, rowIndex);

      const newBoard = this._createTheGrid();


      for (let i = 0; i < rowsPossibilities.length; i++) {

        if (i == rowIndex) {

          for (let indexRowPossChar = 0; indexRowPossChar < row.length; indexRowPossChar++) {
            addModeToPosition(newBoard, rowIndex, indexRowPossChar, row[indexRowPossChar] == '1' ? GridMode.SELECTED : GridMode.EMPTY);
          }

          console.log(Object.assign({}, newBoard));

          continue;
        }


        for (let j = 0; j < rowsPossibilities[i].possibilities.length; j++) {
          // console.log(rowsPossibilities[i].possibilities[j]);
        }

      }

      amountOfSolutions = this._isGridCorrect(newBoard, columnsPossibilities) ? amountOfSolutions++ : amountOfSolutions;

      if (amountOfSolutions > 1) {
        return amountOfSolutions;
      }

    };

    for (let iRow = 0; iRow < rowsPossibilities.length; iRow++) {

      rowsPossibilities[iRow].possibilities.forEach((rowPoss) => {
        this._fillBoardForEachRow(rowPoss, iRow, rowsPossibilities, columnsPossibilities);
      });

    }


    return amountOfSolutions;
  }

  private _fillBoardForEachRow = (row, rowIndex, rowsPossibilities: any[], columnsPossibilities): number => {

    const addModeToPosition = (board, rowI, columnIndex, mode) => {
      board[rowI][columnIndex].mode = mode;
    };

    let amountOfPossibilitiesLeft = rowsPossibilities.reduce((oldValue, data) => data.index != rowIndex ? oldValue += data.possibilities.length : oldValue, 0);
    let amountOfGridCorrect = 0;

    do {

      const newBoard = this._createTheGrid();

      for (let i = 0; i < rowsPossibilities.length; i++) {

        if (i == rowIndex) {
          for (let indexRowPossChar = 0; indexRowPossChar < row.length; indexRowPossChar++) {
            addModeToPosition(newBoard, rowIndex, indexRowPossChar, row[indexRowPossChar] == '1' ? GridMode.SELECTED : GridMode.EMPTY);
          }
          continue;
        }

        // add a row possibility we didnt had before
        // loop over rows
        // loop over possibilities
        
        console.log(rowsPossibilities[i]);
      }

      console.log(Object.assign({}, newBoard));

      amountOfGridCorrect = this._isGridCorrect(newBoard, columnsPossibilities) ? amountOfGridCorrect++ : amountOfGridCorrect;

      if (amountOfGridCorrect > 1) {
        return amountOfGridCorrect;
      }

    } while (amountOfPossibilitiesLeft-- == 0);


    return amountOfGridCorrect;

  };

  private _isGridCorrect = (board, columnsPossibilities: any[]): boolean => {


    return true;
  };

}
