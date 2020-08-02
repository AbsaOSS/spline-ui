/*
 * Copyright 2019 ABSA Group Limited
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

import * as _ from 'lodash'
import {
    AttributeSchema,
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
import { TypeHelpers } from 'spline-utils'


export namespace EventOpExpression {

    export function getName(expr: OpExpression, attributeList: AttributeSchema[]): string {
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
                return getText(ar, attributeList)
            }
            case OpExpressionType.Generic:
            case OpExpressionType.GenericLeaf: {
                return (expr as OpExpressionGeneric | OpExpressionGenericLeaf).name
            }
            default:
                throw new Error(`Unknown expression type: ${expr._typeHint}`)
        }
    }

    export function getText(expr: OpExpression, attributeList: AttributeSchema[]): string {
        switch (expr._typeHint) {
            case OpExpressionType.Literal: {
                return (expr as OpExpressionLiteral).value
            }
            case OpExpressionType.Binary: {
                const binaryExpr = expr as OpExpressionBinary
                const leftOperand = getText(binaryExpr.children[0], attributeList)
                const rightOperand = getText(binaryExpr.children[1], attributeList)
                return `${leftOperand} ${binaryExpr.symbol} ${rightOperand}`
            }
            case OpExpressionType.Alias: {
                const ae = expr as OpExpressionAlias
                return `${getText(ae.child, attributeList)} AS  ${ae.alias}`
            }
            case OpExpressionType.UDF: {
                const udf = expr as OpExpressionUDF
                const paramList = _.map(udf.children, child => getText(child, attributeList))
                return `UDF:${udf.name}(${_.join(paramList, ', ')})`
            }
            case OpExpressionType.AttrRef: {
                const attrRef = expr as OpExpressionAttrRef
                return attributeList.find(a => a.id === attrRef.refId).name
            }
            case OpExpressionType.GenericLeaf: {
                return renderAsGenericLeafExpr(expr as OpExpressionGenericLeaf, attributeList)
            }
            case OpExpressionType.Generic: {
                const leafText = renderAsGenericLeafExpr(expr as OpExpressionGenericLeaf, attributeList)
                const childrenTexts = (expr as OpExpressionGeneric).children.map(child => getText(child, attributeList))
                return leafText + _.join(childrenTexts, ', ')
            }
        }
    }

    function renderAsGenericLeafExpr(expression: OpExpressionGenericLeaf, attributeList: AttributeSchema[]): string {
        const paramList = expression.params
            .map(
                (value, name) => {
                    const renderedValue = renderGenericLeafParamValue(value, attributeList)
                    return `${name}=${renderedValue}`
                },
            )
        return _.isEmpty(paramList)
            ? expression.name
            : `${expression.name}[${paramList.join(', ')}]`
    }

    function renderGenericLeafParamValue(paramValue: OpExpression | object | number | string, attributeList: AttributeSchema[]): string {

        if ((paramValue as OpExpression)?._typeHint) {
            return getText(paramValue as OpExpression, attributeList)
        }

        if (TypeHelpers.isArray(paramValue)) {
            return `[${paramValue.map(valueItem => renderGenericLeafParamValue(valueItem, attributeList)).join(', ')}]`
        }

        if (_.isPlainObject(paramValue)) {
            const renderedPairs = Object.entries(paramValue)
                .map(
                    ([key, value]) => `${key}: ${renderGenericLeafParamValue(value, attributeList)}`,
                )
            return `{${renderedPairs.join(', ')}}`
        }

        if (TypeHelpers.isNumber(paramValue)) {
            return paramValue.toString()
        }

        if (TypeHelpers.isString(paramValue)) {
            return paramValue
        }

        throw new Error(`Unknown data type`)
    }

}
