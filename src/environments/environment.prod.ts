import { environmentBase } from './environment.base';
import { Environment } from './shared';


export const environment: Environment = {
    ...environmentBase,
    production: true,
};
