import {StateRedux} from './state.redux';
import {ActionRedux} from './action.redux';
import {ReducerRedux} from './reducer.redux';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class StoreRedux {

  public stateSubject: BehaviorSubject<StateRedux>;

  private _reducer: ReducerRedux;
  private _state: StateRedux;

  constructor(reducer: ReducerRedux) {
    this._reducer = reducer;

    this._state = new StateRedux();

    this.stateSubject = new BehaviorSubject<StateRedux>(this._state);
  }


  public getState(): StateRedux {
    return this._state;
  }

  public dispatch(action: ActionRedux): void {
    this._state = this._reducer.reduce(this._state, action);

    this._triggerStoreSubbject();
  };

  private _triggerStoreSubbject(): void {
    this.stateSubject.next(this._state);
  }
}
