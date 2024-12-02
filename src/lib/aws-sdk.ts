import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const credentials = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || '',
  imageBucket: process.env.NEXT_PUBLIC_AWS_IMAGE_BUCKET || '',
  // You'll need to get these from your AWS account
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
};

export const uploadToS3 = async (file: any) => {
  try {
    const s3Client = new S3Client({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });

    const fileName = `${Date.now()}-${file.name}`;
    const command = new PutObjectCommand({
      Bucket: credentials.imageBucket,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    // Let's try different URL formats and log them all
    const url1 = `https://${credentials.imageBucket}.s3.${credentials.region}.amazonaws.com/${fileName}`;
    const url2 = `https://s3.${credentials.region}.amazonaws.com/${credentials.imageBucket}/${fileName}`;
    const url3 = `https://${credentials.imageBucket}.s3-${credentials.region}.amazonaws.com/${fileName}`;
    const url4 = `https://s3-${credentials.region}.amazonaws.com/${credentials.imageBucket}/${fileName}`;
    // Let's use url1 as default but you can try the others
    return { url1, url2, url3, url4 };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
