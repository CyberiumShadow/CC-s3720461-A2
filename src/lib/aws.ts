import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'

export const dbClient = new DynamoDBClient({
  region: 'us-east-1',
})
export const s3Client = new S3Client({
  region: 'us-east-1',
})
