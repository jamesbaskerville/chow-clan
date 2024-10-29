import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: import.meta.env.AWS_REGION,
    credentials: {
        accessKeyId: import.meta.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.AWS_SECRET_ACCESS_KEY,
    },
});