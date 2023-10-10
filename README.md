# Build-It with AWS Fargate and Amazon DynamoDB

This is a reference architecture for the Build-It application. 

## Architecture
This project contains a sample AWS Cloud Development Kit (AWS CDK) template for deploying an AWS Fargate service running on an Amazon Elastic Container Service (ECS) cluster with an Application Load Balancer in-front. The AWS Fargate service makes puts to a DynamoDB table. 

## Web Application
The web application in the [`/src`](./cdk/src/) folder is written in TypeScript. It uses the `Express` framework and contains two routes. The base route reponds to a GET request at `/` and returns a simple greeting. The die roll reponds to a POST at `/rollDie` returns a random number between 1-6 with a certain chance of failure.

## CDK template
The [CDK template](./cdk/lib/cdk-stack.ts) contains constructs such as `Vpc`, `GatewayVpcEndpointAwsService`, `Cluster`, `ContainerImage`, and  `ApplicationLoadBalancedFargateService` that enable you to deploy resources to your AWS account. The CDK templ uses the `ecs.ContainerImage.fromAsset` method that allows you to reference an image that's constructed directly from sources on disk.

CDK injects environment variables into the Fargate service so that the web app may reference the DynamoDB table name and the AWS region for the putItem request to the DynamoDB table.

This project also shows how to set up a DynamoDB Gateway Endpoint to the VPC. A VPC Endpoint policy is created to only allow the Fargate task definition to perform `PutItem` actions through the VPC endpoint.

## Requirements

- [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and log in. The IAM user that you use must have sufficient permissions to make necessary AWS service calls and manage AWS resources.
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed and configured
- [Git Installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/cli.html) installed and configured

## Deployment Instructions

1. Create a new directory, navigate to that directory in a terminal and clone the GitHub repository:
   ```bash
   git clone https://github.com/dancfox/build-it-fargate
   ```
2. Change directory to the pattern directory:
   ```bash
   cd build-it-fargate/cdk
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. From the command line, configure AWS CDK:
   ```bash
   cdk bootstrap ACCOUNT-NUMBER/REGION # e.g.
   ```
5. From the `cdk` directory, use AWS CDK to deploy the AWS resources for the pattern as specified in the `lib/cdk-stack.ts` file:
   ```bash
   cdk deploy
   ```
6. Note the outputs from the CDK deployment process. This contains the service endpoint that is used to make GET requests to the healthcheck endpoint and POST requests to the `/rollDie` endpoint.

## How it works

- The image is constructed directly from sources on disk when `cdk deploy` is executed
- The image is automatically pushed to Amazon ECR
- The DynamoDB table is created
- The ECS cluster is created
- The Networking resources are created
- The Fargate Service and the Task Definitions are created. This also passes the environment variables (DynamoDB table name and region) to the image

## Testing

Retrieve the Fargate Service endpoint from the `cdk deploy` output. Example of the output is:

```
CdkStack.MyFargateServiceServiceURL1234567D = http://CdkSt-MyFar-123456789ABC-123456789.ap-southeast-2.elb.amazonaws.com
```

Send requests to the endpoint. For example:

```bash

# send a GET request to the root
curl --location --request POST '<REPLACE WITH FARGATE SERVICE URL>' \

# send a POST request to the `rollDie` location
curl --location --request POST '<REPLACE WITH FARGATE SERVICE URL>/rollDie' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "dancfox"
}'
```

## Cleanup

1. Delete the stack
   ```bash
   cdk destroy
   ```

2. Navigate to ECR in the AWS console and delete the container images created

---

SPDX-License-Identifier: MIT-0
