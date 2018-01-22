import {UUID} from 'angular2-uuid';
import {GridElement} from './grid_element.model';
import {GridMode} from '../enums/grid_mode.enum';

export class Game {

  public id: string;
  public elements: GridElement[][];
  public gridFactor: number;

  public suggestions: Suggestions;

  constructor(gridFactor: number = 0) {
    this.id = UUID.UUID();

    this.gridFactor = gridFactor;

    this._createTheGrid();
  }

  public changeGridFactor(gridFactor: number): void {
    this.gridFactor = gridFactor;

    this._createTheGrid();
  }

  public changeGridElement(gridElement: GridElement, mode: GridMode): void {

    const [idxColumn, idxRow] = this._findIdxOfGridElement(gridElement);

    if (idxColumn == -1 || idxRow == -1) {
      return;
    }

    this.elements[idxColumn][idxRow].mode = mode;

    this._setSuggestions();
  }

  public isGameSolvable(): boolean {

    let amountOfSolution: number = 0;

    // find all possible solutions foreach row
    // find all possible solutions foreach column
    // match these values

    const rowsPossibilities: { index: number, possibilities: string[] }[] = [];
    const columnsPossibilities: { index: number, possibilities: string[] }[] = [];

    for (let i = 0; i < this.elements.length; i++) {

      rowsPossibilities.push({
        index: i,
        possibilities: this._getRowPossibilities(i)
      });

      columnsPossibilities.push({
        index: i,
        possibilities: this._getColumnPossibilities(i)
      });

    }

    console.log(rowsPossibilities);
    console.log(columnsPossibilities);

    // remove all the possibilities that are not possible

    const isPossibleInColumn = (index: number, rowPossibility: string): boolean => {
      // console.log(rowPossibility);

      columnsPossibilities[index].possibilities.find(possibility =>);

      return true;
    };

    const isPossibleInRow = (index: number, columnPossibility: string): boolean => {
      // console.log(columnPossibility);

      console.log(index, columnPossibility);
      columnsPossibilities.forEach(column => {

      });


      return true;
    };

    const matchPossibilities = (item, type = 'col' || 'row') => {
      for (let i = item.possibilities.length - 1; i >= 0; i--) {

        const possibility = item.possibilities[i];

        if (possibility.indexOf('1') == -1) {
          continue;
        }

        console.log(possibility);

        switch (type) {

          case 'row': {
            if (!isPossibleInColumn(i, possibility)) {
              item.possibilities.splice(i, 1);
            }
            break;
          }

          case 'col': {
            if (!isPossibleInRow(i, possibility)) {
              item.possibilities.splice(i, 1);
            }
            break;
          }
        }

      }
    };

    rowsPossibilities.forEach((row) => {
      matchPossibilities(row, 'row');
    });
    columnsPossibilities.forEach((col) => {
      matchPossibilities(col, 'col');
    });

    return amountOfSolution == 1;
  }

  private _findIdxOfGridElement(gridElement: GridElement): [number, number] {

    let idxColumn = -1;
    let idxRow = -1;

    for (let i = 0; i < this.elements.length; i++) {

      idxRow = this.elements[i].findIndex(element => element.id == gridElement.id);

      if (idxRow > -1) {
        idxColumn = i;

        break;
      }

    }

    return [idxColumn, idxRow];
  };

  private _createTheGrid(): void {

    this.elements = [];
    const gridFactorAmount = Math.pow(this.gridFactor, 2);

    let rowIndex = 0;
    let columnIndex = 0;

    for (let i = 0; i < gridFactorAmount; i++) {
      if (!this.elements[columnIndex]) {
        this.elements[columnIndex] = [];
      }

      this.elements[columnIndex][rowIndex++] = new GridElement();

      if (rowIndex == this.gridFactor) {
        rowIndex = 0;
        columnIndex++;
      }

    }

    this._setSuggestions();

  }

  private _setSuggestions(): void {
    this.suggestions = {
      columns: [],
      rows: []
    };

    for (let i = 0; i < this.elements.length; i++) {

      const column = [];
      for (let j = 0; j < this.elements.length; j++) {
        column.push(this.elements[j][i]);
      }

      this._setRowSuggestions(this.elements[i], i);
      this._setColumSuggestions(column, i);
    }

  }

  private _setRowSuggestions(row: GridElement[], index: number): void {
    const rowSuggestions = [];
    let amountSelectedAfterEachOther = 0;

    row.forEach((element: GridElement, i: number) => {

      if (element.mode == GridMode.SELECTED) {
        amountSelectedAfterEachOther++;

        if (i == row.length - 1) {
          rowSuggestions.push(amountSelectedAfterEachOther);
        }
      }

      if (element.mode == GridMode.EMPTY && amountSelectedAfterEachOther > 0) {
        rowSuggestions.push(amountSelectedAfterEachOther);

        amountSelectedAfterEachOther = 0;
      }

    });

    this.suggestions.rows.push({
      index: index,
      numbers: rowSuggestions
    });

  }

  private _setColumSuggestions(column: GridElement[], index: number): void {
    const columnSuggestions = [];
    let amountSelectedAfterEachOther = 0;

    column.forEach((element: GridElement, i: number) => {

      if (element.mode == GridMode.SELECTED) {
        amountSelectedAfterEachOther++;

        if (i == column.length - 1) {
          columnSuggestions.push(amountSelectedAfterEachOther);
        }
      }

      if (element.mode == GridMode.EMPTY && amountSelectedAfterEachOther > 0) {
        columnSuggestions.push(amountSelectedAfterEachOther);

        amountSelectedAfterEachOther = 0;
      }

    });

    this.suggestions.columns.push({
      index: index,
      numbers: columnSuggestions
    });

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

      if (initialPossibility.length != this.gridFactor) {
        add0ToPossibility();
      }

    });

    // fill the last 0's
    for (let i = initialPossibility.length; i < this.gridFactor; i++) {
      add0ToPossibility();
    }

    return initialPossibility;
  }

  private _getRowPossibilities(index: number): string[] {

    const rowSuggestion = this.suggestions.rows.find(row => row.index == index);
    const initialPossibility = this._setInitialValue(rowSuggestion);

    return this._calculatePossibilities(initialPossibility, rowSuggestion);
  }

  private _getColumnPossibilities(index: number): string[] {
    const columnSuggestion = this.suggestions.columns.find(row => row.index == index);
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

}

export interface Suggestions {
  columns: {
    index: number,
    numbers: number[]
  }[],
  rows: {
    index: number,
    numbers: number[]
  }[]
}
