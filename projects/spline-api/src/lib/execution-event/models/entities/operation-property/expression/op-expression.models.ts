/*
 * Copyright 2020 ABSA Group Limited
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


import { OpExpressionType } from './op-expression-type.models'


export type OpExpression =
    | OpExpressionCommon
    | OpExpressionAttrRef
    | OpExpressionGeneric
    | OpExpressionGenericLeaf
    | OpExpressionAlias
    | OpExpressionBinary
    | OpExpressionUDF
    | OpExpressionLiteral

export type OpExpressionCommon =
    {
        _typeHint: OpExpressionType
    }
    & Record<string, any>

export type OpExpressionAttrRef =
    {
        refId: string
    }
    & OpExpressionCommon

export type OpExpressionGeneric =
    {
        params: Record<string, any> | null
        exprType: string
        children: OpExpression[]
        dataTypeId: string
        name: string
    }
    & OpExpressionCommon


export type OpExpressionGenericLeaf =
    {
        params: Record<string, any> | null
        exprType: string
        dataTypeId: string
        name: string
    }
    & OpExpressionCommon

export type OpExpressionAlias =
    {
        child: OpExpression
        alias: string
    }
    & OpExpressionCommon

export type OpExpressionBinary =
    {
        children: OpExpression[]
        dataTypeId: string
        symbol: string
    }
    & OpExpressionCommon

export type OpExpressionUDF =
    {
        children: OpExpression[]
        dataTypeId: string
        name: string
    }
    & OpExpressionCommon

export type OpExpressionLiteral =
    {
        dataTypeId: string
        value: string
    }
    & OpExpressionCommon

