import AWS from 'aws-sdk';

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  await s3.putObject({
    Bucket: process.env.S3_BUCKET!,
    Key: filename,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read'
  }).promise();
  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${filename}`;
}