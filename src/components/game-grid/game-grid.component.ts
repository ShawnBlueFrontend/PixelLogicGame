import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import {GridElement} from '../../models/grid_element.model';
import {Suggestions} from '../../models/game.model';

@Component({
  selector: 'game-grid',
  templateUrl: 'game-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class GameGridComponent {

  @Input() grid: GridElement[][];
  @Input() suggestions: Suggestions;

  @Output() onElementClicked: EventEmitter<any>;
  @Output() onElementRightClicked: EventEmitter<any>;

  constructor() {
    this.onElementClicked = new EventEmitter<any>();
    this.onElementRightClicked = new EventEmitter<any>();
  }

  public getGridWidth(): string {
    return `${this.grid.length * 30}px`;
  }

  public getSuggestionsRowWidth(): string {
    return `${(this.grid.length * 10)}px`;
  }

  public getSuggestionsColumnHeight(): string {

    let maxAmountOfNumbers = 0;

    this.suggestions.columns.forEach((suggestion) => {
      const suggestionNumbersLength = suggestion.numbers.length;

      if (maxAmountOfNumbers < suggestionNumbersLength) {
        maxAmountOfNumbers = suggestionNumbersLength;
      }
    });

    if (!maxAmountOfNumbers) {
      maxAmountOfNumbers = 1;
    }

    return `${maxAmountOfNumbers * 18}px`;
  }

  public getNumbers(numbers: number[], type?: string): string {
    let output = '';
    numbers.forEach(n => {

      if (type == 'col') {
        output += `<span>${n}</span>`;

      } else {
        output += `${n} `;
      }

    });

    if (!output.length) {
      output = '0';
    }
    return output;
  }


  public selectElement(gridElement: GridElement): void {
    this.onElementClicked.next(gridElement);
  }

  public excludeElement(gridElement: GridElement): boolean {
    this.onElementRightClicked.next(gridElement);
    return false;
  }

}
