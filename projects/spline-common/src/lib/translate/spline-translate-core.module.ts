import { HttpClient } from '@angular/common/http'
import { InjectionToken, NgModule } from '@angular/core'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'

import { COMMON_ASSETS, DEFAULT_CONFIG, SplineTranslateRootConfig, TranslateLoaderFactory } from './spline-translate.models'


export const SPLINE_TRANSLATE_COMMON_ASSETS = new InjectionToken<string[]>('SPLINE_TRANSLATE_COMMON_ASSETS')
export const SPLINE_TRANSLATE_CONFIG = new InjectionToken<SplineTranslateRootConfig>('SPLINE_TRANSLATE_CONFIG')


@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: TranslateLoaderFactory,
                deps: [HttpClient, SPLINE_TRANSLATE_COMMON_ASSETS],
            },
        }),
    ],
    providers: [
        {
            provide: SPLINE_TRANSLATE_COMMON_ASSETS,
            useValue: COMMON_ASSETS,
        },
        {
            provide: SPLINE_TRANSLATE_CONFIG,
            useValue: DEFAULT_CONFIG,
        },
    ],
    exports: [
        TranslateModule,
    ],
})
export class SplineTranslateCoreModule {

}
