import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  async uploadFile(
    dataBuffer: Buffer,
    fileName: string,
  ): Promise<{ fileName: string; fileUrl: string; key: string }> {
    const s3 = new S3({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
      },
    });

    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();

    return {
      fileName,
      fileUrl: uploadResult.Location,
      key: uploadResult.Key,
    };
  }
}
