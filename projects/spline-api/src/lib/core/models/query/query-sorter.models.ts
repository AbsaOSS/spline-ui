export namespace QuerySorter {

    export enum SortDir {
        ASC = 'ASC',
        DESC = 'DESC'
    }

    export interface FieldSorter<TFiled = string> {
        field: TFiled
        dir: SortDir
    }

}
