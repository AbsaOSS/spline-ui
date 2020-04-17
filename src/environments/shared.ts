export const relativeUrl = '.';
export const deploymentPrefix = '/app';

export interface Environment {
    production: boolean;
    deploymentPrefix: string;
    url: string;
    appConfigUri: string;
}
