/*
 * Copyright (c) 2020 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    AttrSchemasCollection,
    OpExpression,
    OpExpressionAlias,
    OpExpressionAttrRef,
    OpExpressionBinary,
    OpExpressionGeneric,
    OpExpressionGenericLeaf,
    OpExpressionLiteral,
    OpExpressionType,
    OpExpressionUDF,
} from 'spline-api'

import { SplineExpressionValue } from './spline-expression-value.models'


export namespace SplineExpressionTree {

    export type TreeNode = {
        name: string
        expanded?: boolean
        children?: TreeNode[]
    }

    export type Tree = TreeNode[]

    export function toTree(expression: OpExpression, attrSchemasCollection: AttrSchemasCollection, level = 1): Tree {

        const children = expression?.children
            ? expression?.children.map(child => toTree(child, attrSchemasCollection, level + 1)[0])
            : undefined

        return [{
            name: getNodeName(expression, attrSchemasCollection),
            children,
            expanded: true
        }]
    }

    export function getNodeName(expr: OpExpression, attrSchemasCollection: AttrSchemasCollection): string {
        switch (expr._typeHint) {
            case OpExpressionType.Literal: {
                return (expr as OpExpressionLiteral).value
            }
            case OpExpressionType.Binary: {
                return (expr as OpExpressionBinary).symbol
            }
            case OpExpressionType.Alias: {
                return (expr as OpExpressionAlias).alias
            }
            case OpExpressionType.UDF: {
                return `UDF:${(expr as OpExpressionUDF).name}`
            }
            case OpExpressionType.AttrRef: {
                const ar = expr as OpExpressionAttrRef
                return SplineExpressionValue.expressionToString(ar, attrSchemasCollection)
            }
            case OpExpressionType.Generic:
            case OpExpressionType.GenericLeaf: {
                return (expr as OpExpressionGeneric | OpExpressionGenericLeaf).name
            }
            default:
                throw new Error(`Unknown expression type: ${expr._typeHint}`)
        }
    }

}
