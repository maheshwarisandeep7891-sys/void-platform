import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const BUCKET = process.env.R2_BUCKET_NAME ?? "void-platform";
const PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

function getR2Client(): S3Client {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Cloudflare R2 credentials not configured. Set CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY."
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export type UploadCategory =
  | "avatars"
  | "banners"
  | "posts"
  | "listings"
  | "attachments";

export async function getPresignedUploadUrl(
  category: UploadCategory,
  filename: string,
  contentType: string,
  userId: string
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const ext = filename.split(".").pop() ?? "bin";
  const key = `${category}/${userId}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    Metadata: { uploadedBy: userId, category },
  });

  const uploadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: 300,
  });
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return { uploadUrl, publicUrl, key };
}

export async function deleteFile(key: string): Promise<void> {
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
  );
}

export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(getR2Client(), command, { expiresIn });
}
