import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ROUTES} from './routes';
import {RouterService} from './router.service';

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
  providers: [RouterService]
})
export class AppRouterModule {
}
