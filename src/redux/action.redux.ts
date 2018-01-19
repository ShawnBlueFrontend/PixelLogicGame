import {ActionType} from "./action_type.enum";

export interface ActionRedux {

  type: ActionType,
  payload?: any

}
