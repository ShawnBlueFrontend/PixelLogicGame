import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {ReduxService} from '../services/redux.service';
import {NewGamePageComponent} from '../components/new-game-page/new-game-page.component';
import {FormsModule} from '@angular/forms';
import {AppRouterModule} from '../router/router.module';
import {HomePageComponent} from '../components/home-page/home-page.component';
import {GameGridComponent} from '../components/game-grid/game-grid.component';

const components = [
  GameGridComponent
];

const pages = [
  HomePageComponent,
  NewGamePageComponent
];

@NgModule({
  declarations: [
    AppComponent,
    components,
    pages
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule
  ],
  providers: [
    ReduxService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
