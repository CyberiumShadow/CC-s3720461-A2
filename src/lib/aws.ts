import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'

const AWSEndpoint = 'http://localhost:8000'

export const dbClient = new DynamoDBClient({
  endpoint: AWSEndpoint,
})
export const s3Client = new S3Client({
  endpoint: AWSEndpoint,
})
