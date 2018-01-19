import {Routes} from '@angular/router';
import {NewGamePageComponent} from '../components/new-game-page/new-game-page.component';
import {HomePageComponent} from '../components/home-page/home-page.component';

export const ROUTES: Routes = [

  {path: '', pathMatch: 'full', redirectTo: 'home'},

  {path: 'home', component: HomePageComponent},
  {path: 'new-game', component: NewGamePageComponent},

  {path: '**', pathMatch: 'full', redirectTo: 'home'}

];

