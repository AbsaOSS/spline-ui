import { VoltronEntityHierarchy } from './voltron-legacy.models'


export type VoltronTaxonomyTree = VoltronEntityHierarchy[]

export type VoltronTaxonomyTreeDto = {
    hierarchies: VoltronEntityHierarchy
}

export function toVoltronTaxonomyTree(entityDto: VoltronTaxonomyTreeDto): VoltronTaxonomyTree {
    return [entityDto.hierarchies]
}
