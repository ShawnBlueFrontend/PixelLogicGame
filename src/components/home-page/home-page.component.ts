import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterService} from '../../router/router.service';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {

  constructor( private routerService: RouterService) {
  }

  public createNewGame(): void {
    this.routerService.navigateToRoute('new-game');
  }
}
