import { environment } from '@env/environment'


export const API_SPLINE_CONSUMER = '@splineConsumerApi'

export const API_BASE_PATH_MAP = Object.freeze({
    [API_SPLINE_CONSUMER]: environment.splineConsumerApi.fullPath,
})

export function getApiBasePath(alias: string): string {
    return API_BASE_PATH_MAP[alias]
        ? API_BASE_PATH_MAP[alias]
        : ''
}
