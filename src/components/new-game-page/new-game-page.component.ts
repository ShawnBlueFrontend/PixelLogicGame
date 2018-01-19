import {Component, ChangeDetectionStrategy, OnInit, OnDestroy} from '@angular/core';
import {ReduxService} from '../../services/redux.service';
import {StateRedux} from '../../redux/state.redux';
import {ActionCreatorRedux} from '../../redux/action_creator.redux';
import {GridElement} from '../../models/grid_element.model';
import {GridMode} from '../../enums/grid_mode.enum';
import {Suggestions} from '../../models/game.model';

@Component({
  selector: 'new-game',
  templateUrl: 'new-game-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGamePageComponent implements OnInit, OnDestroy {

  public state: StateRedux;
  public gridFactor: number = 0;
  public grid: GridElement[][] = [];
  public suggestions: Suggestions;

  private _storeSubscription: any;

  constructor(private reduxService: ReduxService) {
  }

  ngOnInit() {

    this.reduxService.store.dispatch(ActionCreatorRedux.createNewGame());

    this._storeSubscription = this.reduxService.store.stateSubject.subscribe((state: StateRedux) => {
      this.state = state;

      this.gridFactor = this.state.data.game.gridFactor;
      this.grid = this.state.data.game.elements;
      this.suggestions = this.state.data.game.suggestions;

      console.log(this.state.data.game.isGameSolvable());
    });

  }

  ngOnDestroy() {
    if (this._storeSubscription) {
      this._storeSubscription.unsubscribe();
    }
  }

  public onGridFactorChanged(): void {
    this.reduxService.store.dispatch(ActionCreatorRedux.changeGridFactor(this.gridFactor));
  }

  public onElementClicked(gridElement: GridElement): void {
    this.reduxService.store.dispatch(ActionCreatorRedux.changeGridElement(gridElement, gridElement.mode == GridMode.SELECTED ? GridMode.EMPTY : GridMode.SELECTED));
  }

  // public onElementRightClicked(gridElement: GridElement): void {
  //   this.reduxService.store.dispatch(ActionCreatorRedux.changeGridElement(gridElement, gridElement.mode == GridMode.EMPTY ? GridMode.EXCLUDED : GridMode.EMPTY));
  // }

}
