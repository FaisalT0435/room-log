// src/lib/s3.ts
import AWS from 'aws-sdk';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';

const bucketName = process.env.S3_BUCKET!;
if (!bucketName) throw new Error('Missing env variable S3_BUCKET');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  mimeType: string
): Promise<string> {
  const params: PutObjectRequest = {
    Bucket: bucketName,
    Key:    key,
    Body:   buffer,
    ContentType: mimeType,
    // ACL: 'public-read',    ← remove this line
  };

  await s3.putObject(params).promise();
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
