import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'

import { SplineApiConfigInterceptor } from './interceptors/spline-api-config.interceptor'


@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SplineApiConfigInterceptor,
            multi: true
        }
    ],
})
export class SplineApiConfigModule { }
