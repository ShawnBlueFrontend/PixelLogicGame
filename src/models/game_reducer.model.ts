import {ReducerRedux} from '../redux/reducer.redux';
import {StateRedux} from '../redux/state.redux';
import {ActionRedux} from '../redux/action.redux';
import {ActionType} from '../redux/action_type.enum';
import {Game} from './game.model';
import * as _ from 'lodash';

export class GameReducer implements ReducerRedux {

  constructor() {
  }

  reduce(state: StateRedux, action: ActionRedux): StateRedux {

    const newState: StateRedux = _.cloneDeep(state);

    switch (action.type) {

      case ActionType.CREATE_NEW_GAME: {
        newState.data.game = new Game(action.payload.gridFactor);
        break;
      }

      case ActionType.CHANGE_GRID_FACTOR: {
        newState.data.game.changeGridFactor(action.payload.gridFactor);
        break;
      }

      case ActionType.CHANGE_GRID_ELEMENT: {
        newState.data.game.changeGridElement(action.payload.gridElement, action.payload.mode);
        break;
      }

    }

    return newState;

  }

}
