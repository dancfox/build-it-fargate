"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_ecs_patterns_1 = require("aws-cdk-lib/aws-ecs-patterns");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const path = require("path");
class CdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dynamoTable = new aws_dynamodb_1.Table(this, 'DynamoTable', {
            partitionKey: { name: 'ID', type: aws_dynamodb_1.AttributeType.STRING },
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY
        });
        const vpc = new aws_ec2_1.Vpc(this, 'MyVpc', {
            maxAzs: 3
        });
        const dynamoGatewayEndpoint = vpc.addGatewayEndpoint('dynamoGatewayEndpoint', {
            service: aws_ec2_1.GatewayVpcEndpointAwsService.DYNAMODB
        });
        const cluster = new aws_ecs_1.Cluster(this, 'MyCluster', {
            vpc: vpc
        });
        const fargate = new aws_ecs_patterns_1.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
            cluster: cluster,
            cpu: 512,
            desiredCount: 1,
            taskImageOptions: {
                image: aws_ecs_1.ContainerImage.fromAsset(path.join(__dirname, '../src/')),
                environment: {
                    databaseTable: dynamoTable.tableName,
                    region: process.env.CDK_DEFAULT_REGION
                },
            },
            memoryLimitMiB: 2048,
        });
        // Allow PutItem action from the Fargate Task Definition only
        dynamoGatewayEndpoint.addToPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new aws_iam_1.AnyPrincipal()],
            actions: [
                'dynamodb:PutItem',
            ],
            resources: [
                `${dynamoTable.tableArn}`
            ],
            conditions: {
                'ArnEquals': {
                    'aws:PrincipalArn': `${fargate.taskDefinition.taskRole.roleArn}`
                }
            }
        }));
        // Write permissions for Fargate
        dynamoTable.grantWriteData(fargate.taskDefinition.taskRole);
        // Outputs
        new aws_cdk_lib_1.CfnOutput(this, 'DynamoDbTableName', { value: dynamoTable.tableName });
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUEwRTtBQUUxRSwyREFBNkU7QUFDN0UsaURBQXdFO0FBQ3hFLGlEQUE4RDtBQUM5RCxtRUFBcUY7QUFDckYsaURBQTRFO0FBQzVFLDZCQUE4QjtBQUU5QixNQUFhLFFBQVMsU0FBUSxtQkFBSztJQUNqQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sV0FBVyxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ2pELFlBQVksRUFBRSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFDO1lBQ3JELFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7WUFDeEMsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2pDLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsdUJBQXVCLEVBQUU7WUFDNUUsT0FBTyxFQUFFLHNDQUE0QixDQUFDLFFBQVE7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDN0MsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLHdEQUFxQyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUNsRixPQUFPLEVBQUUsT0FBTztZQUNoQixHQUFHLEVBQUUsR0FBRztZQUNSLFlBQVksRUFBRSxDQUFDO1lBQ2YsZ0JBQWdCLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSx3QkFBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDaEUsV0FBVyxFQUFFO29CQUNYLGFBQWEsRUFBRSxXQUFXLENBQUMsU0FBUztvQkFDcEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQW1CO2lCQUN4QzthQUNGO1lBQ0QsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsNkRBQTZEO1FBQzdELHFCQUFxQixDQUFDLFdBQVcsQ0FDL0IsSUFBSSx5QkFBZSxDQUFDO1lBQ2xCLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7WUFDcEIsVUFBVSxFQUFFLENBQUMsSUFBSSxzQkFBWSxFQUFFLENBQUM7WUFDaEMsT0FBTyxFQUFFO2dCQUNQLGtCQUFrQjthQUNuQjtZQUNELFNBQVMsRUFBRTtnQkFDVCxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUU7YUFDMUI7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFO29CQUNYLGtCQUFrQixFQUFFLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO2lCQUNqRTthQUNGO1NBQ0YsQ0FBQyxDQUNILENBQUM7UUFFRixnQ0FBZ0M7UUFDaEMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVELFVBQVU7UUFDVixJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLENBQUM7Q0FDRjtBQTdERCw0QkE2REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcywgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5IH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBUYWJsZSwgQmlsbGluZ01vZGUsIEF0dHJpYnV0ZVR5cGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZSwgVnBjIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBDbHVzdGVyLCBDb250YWluZXJJbWFnZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MtcGF0dGVybnMnO1xuaW1wb3J0IHsgQW55UHJpbmNpcGFsLCBFZmZlY3QsIFBvbGljeVN0YXRlbWVudCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmV4cG9ydCBjbGFzcyBDZGtTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBkeW5hbW9UYWJsZSA9IG5ldyBUYWJsZSh0aGlzLCAnRHluYW1vVGFibGUnLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHtuYW1lOidJRCcsIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HfSxcbiAgICAgIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICB9KTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGModGhpcywgJ015VnBjJywge1xuICAgICAgbWF4QXpzOiAzXG4gICAgfSk7XG5cbiAgICBjb25zdCBkeW5hbW9HYXRld2F5RW5kcG9pbnQgPSB2cGMuYWRkR2F0ZXdheUVuZHBvaW50KCdkeW5hbW9HYXRld2F5RW5kcG9pbnQnLCB7XG4gICAgICBzZXJ2aWNlOiBHYXRld2F5VnBjRW5kcG9pbnRBd3NTZXJ2aWNlLkRZTkFNT0RCXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIodGhpcywgJ015Q2x1c3RlcicsIHtcbiAgICAgIHZwYzogdnBjXG4gICAgfSk7XG5cbiAgICBjb25zdCBmYXJnYXRlID0gbmV3IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2UodGhpcywgJ015RmFyZ2F0ZVNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyOiBjbHVzdGVyLFxuICAgICAgY3B1OiA1MTIsXG4gICAgICBkZXNpcmVkQ291bnQ6IDEsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL3NyYy8nKSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgZGF0YWJhc2VUYWJsZTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuICAgICAgICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgIH0pO1xuXG4gICAgLy8gQWxsb3cgUHV0SXRlbSBhY3Rpb24gZnJvbSB0aGUgRmFyZ2F0ZSBUYXNrIERlZmluaXRpb24gb25seVxuICAgIGR5bmFtb0dhdGV3YXlFbmRwb2ludC5hZGRUb1BvbGljeShcbiAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBBbnlQcmluY2lwYWwoKV0sXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnZHluYW1vZGI6UHV0SXRlbScsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgIGAke2R5bmFtb1RhYmxlLnRhYmxlQXJufWBcbiAgICAgICAgXSxcbiAgICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAgICdBcm5FcXVhbHMnOiB7XG4gICAgICAgICAgICAnYXdzOlByaW5jaXBhbEFybic6IGAke2ZhcmdhdGUudGFza0RlZmluaXRpb24udGFza1JvbGUucm9sZUFybn1gXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBXcml0ZSBwZXJtaXNzaW9ucyBmb3IgRmFyZ2F0ZVxuICAgIGR5bmFtb1RhYmxlLmdyYW50V3JpdGVEYXRhKGZhcmdhdGUudGFza0RlZmluaXRpb24udGFza1JvbGUpO1xuXG4gICAgLy8gT3V0cHV0c1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0R5bmFtb0RiVGFibGVOYW1lJywgeyB2YWx1ZTogZHluYW1vVGFibGUudGFibGVOYW1lIH0pO1xuICB9XG59XG4iXX0=