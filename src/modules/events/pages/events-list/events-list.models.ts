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

export const EVENTS_DATA_SOURCE = {
    items: [{
        executionEventId: '6155e6db-b5dc-4337-b824-caf1f574e288:k905zb37',
        executionPlanId: '6155e6db-b5dc-4337-b824-caf1f574e288',
        frameworkName: 'spark 2.3.4',
        applicationName: 'Spark shell',
        applicationId: 'local-1586884345983',
        timestamp: 1586884368355,
        dataSourceUri: 'file:/home/wajda/Projects/spline-spark-agent/examples/data/output/batch/job2_stage1_results',
        dataSourceType: 'Parquet',
        append: false
    }, {
        executionEventId: '82e7c14c-dab5-485b-b111-0c2437efd788:k905ruc8',
        executionPlanId: '82e7c14c-dab5-485b-b111-0c2437efd788',
        frameworkName: 'spark 2.4.2',
        applicationName: 'Example 1',
        applicationId: 'local-1586884015559',
        timestamp: 1586884020056,
        dataSourceUri: 'file:/home/wajda/Projects/spline-spark-agent/examples/data/output/batch/job1_results',
        dataSourceType: 'Parquet',
        append: false
    }, {
        executionEventId: 'ae5a5fdd-53f5-4fc9-a7a5-00b876028829:k3pupac0',
        executionPlanId: 'ae5a5fdd-53f5-4fc9-a7a5-00b876028829',
        frameworkName: 'spark 2.2.2',
        applicationName: 'Other Job',
        applicationId: 'local-1575376845833',
        timestamp: 1575376851600,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batchWithDependencies/otherJobResults',
        dataSourceType: 'parquet',
        append: false
    }, {
        executionEventId: 'ef5112c5-c026-4270-96aa-09b0f9bbe890:k3pup0vy',
        executionPlanId: 'ef5112c5-c026-4270-96aa-09b0f9bbe890',
        frameworkName: 'spark 2.2.2',
        applicationName: 'Marek\'s Job',
        applicationId: 'local-1575376831518',
        timestamp: 1575376839358,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batchWithDependencies/gdpPerCapitaUSD',
        dataSourceType: 'parquet',
        append: false
    }, {
        executionEventId: '3d7b7d9d-07f1-4ec9-97cf-e37bf0e09b95:k3puopo8',
        executionPlanId: '3d7b7d9d-07f1-4ec9-97cf-e37bf0e09b95',
        frameworkName: 'spark 2.2.2',
        applicationName: 'Jan\'s Beer Job',
        applicationId: 'local-1575376817552',
        timestamp: 1575376824824,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batchWithDependencies/beerConsCtl',
        dataSourceType: 'parquet',
        append: true
    }, {
        executionEventId: '7112dbdf-b930-4e08-af47-8e743ec93cc7:k3puoeio',
        executionPlanId: '7112dbdf-b930-4e08-af47-8e743ec93cc7',
        frameworkName: 'spark 2.2.2',
        applicationName: 'java example app',
        applicationId: 'local-1575376803370',
        timestamp: 1575376810368,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batch/java-sample.csv',
        dataSourceType: 'csv',
        append: false
    }, {
        executionEventId: '116123f9-5a35-48da-ba8d-d74eb92067e4:k3puo3l9',
        executionPlanId: '116123f9-5a35-48da-ba8d-d74eb92067e4',
        frameworkName: 'spark 2.2.2',
        applicationName: 'Example 3',
        applicationId: 'local-1575376784416',
        timestamp: 1575376796205,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batch/job3_results',
        dataSourceType: 'parquet',
        append: false
    }, {
        executionEventId: 'b004c9a6-fbcf-4b11-a2cf-c54eaa89557b:k3punsr3',
        executionPlanId: 'b004c9a6-fbcf-4b11-a2cf-c54eaa89557b',
        frameworkName: 'spark 2.2.2',
        applicationName: 'Example 2',
        applicationId: 'local-1575376768867',
        timestamp: 1575376782159,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batch/job2_stage2_results',
        dataSourceType: 'parquet',
        append: false
    }, {
        executionEventId: '8e625759-283c-442f-906b-74295b4bae35:k3punocy',
        executionPlanId: '8e625759-283c-442f-906b-74295b4bae35',
        frameworkName: 'spark 2.2.2',
        applicationName: 'Example 2',
        applicationId: 'local-1575376768867',
        timestamp: 1575376776466,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batch/job2_stage1_results',
        dataSourceType: 'parquet',
        append: false
    }, {
        executionEventId: 'a748979c-c82f-4d50-8636-901329a583c3:k3puncov',
        executionPlanId: 'a748979c-c82f-4d50-8636-901329a583c3',
        frameworkName: 'spark 2.2.2',
        applicationName: 'Example 1',
        applicationId: 'local-1575376753487',
        timestamp: 1575376761343,
        dataSourceUri: 'file:/home/ec2-user/spline/examples/data/output/batch/job1_results',
        dataSourceType: 'parquet',
        append: false
    }], totalCount: 18, pageNum: 1, pageSize: 10, totalDateRange: [1573848088476, 1586884368355]
};
