import { deploymentPrefix, relativeUrl, Environment } from './shared';


const url = relativeUrl + deploymentPrefix;
export const environmentBase: Environment = {
    production: false,
    deploymentPrefix,
    url,
    appConfigUri: `${url}/assets/config.json`
};
