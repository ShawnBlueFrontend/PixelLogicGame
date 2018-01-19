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

  private _getRowPossibilities(index: number): string[] {

    const output = [];

    const rowSuggestion = this.suggestions.rows.find(row => row.index == index);


    let initialPossibility = '';

    const add0ToPossibility = () => {
      initialPossibility += '0';
    };
    const add1ToPossibility = () => {
      initialPossibility += '1';
    };

    rowSuggestion.numbers.forEach((number: number) => {

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

    // output.push(initialPossibility);

    if (initialPossibility[initialPossibility.length - 1] == '0') {
      // console.log('INITIAL', initialPossibility);
      const a = this._put0BeforeEach1(initialPossibility, rowSuggestion.numbers.length, output);
      if (a.length) console.log(a);
    }


    // first: get the last 0 from initial and put this BEFORE each 0 and continue until you don't have any more 0's

    // after that: get the last 0 from initial and put this AFTER each 0 and continue until you don't have any more 0's


    // console.log(initialPossibility);

    return output;
  }

  private _put0BeforeEach1(value: string, amountOfNumbers: number, output: string[], amountAlreadyAdded: number = 0) {

    const beforeLast0 = value.slice(0, value.length - 1);

    const idxOfFirst1 = beforeLast0.indexOf('1', amountAlreadyAdded);
    const newValue = [value.slice(0, idxOfFirst1), '0', value.slice(idxOfFirst1, value.length - 1)].join('');
    const isAlreadyAdded = (stringToCheck: string): boolean => { // false when not yet added
      return output.find(s => s == stringToCheck) != null;
    };

    if (value.indexOf('1') == -1) { // no 1 found
      // console.log('no 1 found');
      return output;
    }

    if (!isAlreadyAdded(value)) {
      output.push(value);
      return this._put0BeforeEach1(newValue, amountOfNumbers, output, amountAlreadyAdded);
    }

    if (amountAlreadyAdded == amountOfNumbers && value[value.length - 1] == '0') {
      // console.log('amount already added and 0 last');
      return this._put0BeforeEach1(newValue, amountOfNumbers, output, amountAlreadyAdded);
    }

    if (amountAlreadyAdded == amountOfNumbers && value[value.length - 1] == '1') {
      // console.log('amount already added and 0 last');
      return output;
    }

    if (amountAlreadyAdded) {
      // console.log(value);
      isAlreadyAdded(value);
    }

    if (isAlreadyAdded(value)) {
      // console.log('is already added ');
      return output;
    }


    // console.log(idxOfFirst1, newValue);
    output.push(newValue);
    amountAlreadyAdded++;
    return this._put0BeforeEach1(newValue, amountOfNumbers, output, amountAlreadyAdded);


  }

  private _getColumnPossibilities(index: number): string[] {

    return [];
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
