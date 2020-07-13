import { HttpClient } from '@angular/common/http'
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional } from '@angular/core'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { SplineUtilsCoreModule } from 'spline-utils'

import { SPLINE_TRANSLATE_COMMON_ASSETS, SPLINE_TRANSLATE_CONFIG } from './spline-translate-core.module'
import {
    ModuleAssetsFactory,
    SplineTranslateChildConfig,
    SplineTranslateRootConfig,
    TranslateLoaderFactory,
} from './spline-translate.models'


export const SPLINE_TRANSLATE_ASSETS = new InjectionToken<string[]>('SPLINE_TRANSLATE_ASSETS')
export const SPLINE_TRANSLATE_CHILD_CONFIG = new InjectionToken<SplineTranslateChildConfig>('SPLINE_TRANSLATE_CHILD_CONFIG')


@NgModule({
    imports: [
        SplineUtilsCoreModule,
        TranslateModule.forChild({
            useDefaultLang: true,
            loader: {
                provide: TranslateLoader,
                useFactory: TranslateLoaderFactory,
                deps: [HttpClient, SPLINE_TRANSLATE_ASSETS, SPLINE_TRANSLATE_COMMON_ASSETS],
            },
            isolate: true,
        }),
    ],
    exports: [
        TranslateModule,
    ],
})
export class SplineTranslateModule {

    constructor(
        @Optional() @Inject(SPLINE_TRANSLATE_CONFIG) config: SplineTranslateRootConfig, translate: TranslateService,
    ) {
        if (!config) {
            throw new Error(
                'SPLINE_TRANSLATE_CONFIG provider does not exist. Please inject SplineTranslateCoreModule into your root module.',
            )
        }

        translate.setDefaultLang(config.defaultLang)
    }

    static forChild(config: SplineTranslateChildConfig): ModuleWithProviders<SplineTranslateModule> {
        return {
            ngModule: SplineTranslateModule,
            providers: [
                {
                    provide: SPLINE_TRANSLATE_ASSETS,
                    useFactory: ModuleAssetsFactory,
                    deps: [SPLINE_TRANSLATE_CHILD_CONFIG],
                },
                {
                    provide: SPLINE_TRANSLATE_CHILD_CONFIG,
                    useValue: config,
                },
            ],
        }
    }
}
