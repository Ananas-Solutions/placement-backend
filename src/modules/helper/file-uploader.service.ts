import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
      },
    });
  }
  async uploadFile(
    dataBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const fileKey = `${uuid()}-${fileName}`;
    const inputCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: dataBuffer,
      Key: fileKey,
      ContentType: contentType,
    });

    await this.s3Client.send(inputCommand);

    return fileKey;
  }

  async getUploadedFile(fileKey: string): Promise<string> {
    const inputCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });
    const response = await getSignedUrl(this.s3Client, inputCommand, {
      expiresIn: 7200,
    });

    return response;
  }
}
