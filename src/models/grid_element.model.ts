import {UUID} from 'angular2-uuid';
import {GridMode} from '../enums/grid_mode.enum';

export class GridElement {

  public id: string;
  public mode: GridMode;

  constructor() {
    this.id = UUID.UUID();
    this.mode = GridMode.EMPTY;
  }

}
