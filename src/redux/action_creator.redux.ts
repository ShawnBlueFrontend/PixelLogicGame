import {ActionRedux} from './action.redux';
import {ActionType} from './action_type.enum';
import {GridElement} from '../models/grid_element.model';
import {GridMode} from '../enums/grid_mode.enum';

export class ActionCreatorRedux {

  public static createNewGame = (gridFactor: number = 2): ActionRedux => {
    return {
      type: ActionType.CREATE_NEW_GAME,
      payload: {
        gridFactor
      }
    };
  };

  public static changeGridFactor = (gridFactor: number): ActionRedux => {
    return {
      type: ActionType.CHANGE_GRID_FACTOR,
      payload: {
        gridFactor
      }
    };
  };

  public static changeGridElement = (gridElement: GridElement, mode: GridMode): ActionRedux => {
    return {
      type: ActionType.CHANGE_GRID_ELEMENT,
      payload: {
        gridElement,
        mode
      }
    };
  };

}
