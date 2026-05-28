const { S3Client } = require('@aws-sdk/client-s3');

// Configure AWS SDK to use LocalStack endpoint
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',     // LocalStack doesn't require real credentials
    secretAccessKey: 'test',
  },
  // Point to LocalStack endpoint (default port is 4566)
  endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566',
  forcePathStyle: true, // Required for LocalStack S3
});

module.exports = s3Client;
