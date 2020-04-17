import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: 'events',
        loadChildren: () => import('../modules/events/events.module').then(m => m.EventsModule),
    },
    {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'events'
    }
];

@NgModule({
    // useHash supports github.io demo page, remove in your app
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false,
            scrollPositionRestoration: 'top'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
