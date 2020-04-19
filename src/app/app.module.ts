import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { SplineLayoutCommonModule } from 'spline-common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


export const metaReducers: MetaReducer<any>[] =
    !environment.production
        ? [storeFreeze]
        : [];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        AppRoutingModule,
        // NGRX store
        StoreModule.forRoot(
            {}, { metaReducers },
        ),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 100 }) : [],
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router',
        }),
        SplineLayoutCommonModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
