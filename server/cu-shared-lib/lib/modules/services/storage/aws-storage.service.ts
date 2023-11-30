import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

@Injectable()
export class AWSStorageService {
  private readonly s3Client: S3;
  constructor(
    private readonly accessKeyId: string,
    private readonly secretAccessKey: string,
    private readonly endpoint: string,
    private readonly signatureVersion: string,
    private readonly region: string,
    private readonly bucket: string
  ) {
    this.s3Client = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      endpoint: this.endpoint,
      signatureVersion: this.signatureVersion,
      s3ForcePathStyle: true,
      region: this.region,
    });

    this.ensureBucketExists(this.bucket);
  }

  public async uploadToS3Async(buffer: Buffer, name: string): Promise<string> {
    const request: PutObjectRequest = {
      Bucket: this.bucket,
      Key: name,
      Body: buffer,
    };

    const response = await this.s3Client.putObject(request).promise();

    if (this.endpoint.includes("localstack")) {
      return `${this.endpoint.replace("localstack", "localhost")}/${
        this.bucket
      }/${name}`;
    }

    return `${this.endpoint}/${this.bucket}/${name}`;
  }

  private async ensureBucketExists(name: string): Promise<void> {
    const buckets = await this.s3Client.listBuckets().promise();
    const bucket = buckets.Buckets.find((q) => q.Name === this.bucket);

    if (!bucket) {
      await this.s3Client.createBucket({ Bucket: this.bucket }).promise();
    }
  }
}
