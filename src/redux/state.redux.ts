import {Game} from '../models/game.model';

export class StateRedux {

  public data: {
    game?: Game
  };

  constructor() {
    this.data = {};
  }

}
