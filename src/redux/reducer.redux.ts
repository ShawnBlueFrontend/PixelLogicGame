import {StateRedux} from "./state.redux";
import {ActionRedux} from "./action.redux";

export interface ReducerRedux {

  reduce(state: StateRedux, action: ActionRedux): StateRedux;

}
