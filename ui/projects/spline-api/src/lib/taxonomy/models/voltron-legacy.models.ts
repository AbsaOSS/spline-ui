export interface VoltronEntity {
    graphEntityId: number
    entityName: string
    label: string
    name: string
    description: string
    acronym: string
    hasLineage: boolean
    childHasLineage: boolean
    hasAssociation: boolean
    hasTechnicalAssociation: boolean
    childHasAssociation: boolean
    hasTerms: boolean
    isCde: boolean
    isBcbs: boolean
    hasBrokenCde: boolean
    brid: string
    fullName: string
    surname: string
    owner: string
    steward: string
    associations: VoltronEntity[]
    nested: VoltronEntity[]
    properties: VoltronEntityProperty[]
    replicationEntityId: string
}

export interface VoltronEntityProperty {
    propertyType: string
    value: string
}

export interface VoltronEntityHierarchy {
    entity: VoltronEntity
    children: VoltronEntityHierarchy[]
}
