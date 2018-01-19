import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class RouterService {

  constructor(private router: Router) {
  }

  public navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }
}
