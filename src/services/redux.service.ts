import {Injectable} from '@angular/core';
import {StoreRedux} from '../redux/store.redux';
import {GameReducer} from '../models/game_reducer.model';
import {RouterService} from '../router/router.service';

@Injectable()
export class ReduxService {

  private _store: StoreRedux;

  constructor() {
    this._store = new StoreRedux(new GameReducer());
  }

  get store(): StoreRedux {
    return this._store;
  }
}
