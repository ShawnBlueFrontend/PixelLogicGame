import {UUID} from 'angular2-uuid';
import {GridElement} from './grid_element.model';
import {GridMode} from '../enums/grid_mode.enum';
import {Nonogram} from './nonogram.model';

export class Game {

  public id: string;
  public elements: GridElement[][];
  public gridFactor: number;

  public suggestions: Suggestions;

  private _nonogram: Nonogram;

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
    return this._nonogram.isSolvable(this.elements, this.suggestions);
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
    this._nonogram = new Nonogram(this.gridFactor);

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
