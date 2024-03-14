import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const S3 = new S3Client();
const DEST_BUCKET = process.env.DEST_BUCKET; // Fetching Destination Bucket Name From Lambda Environment Configuration
const SMALL_THUMBNAIL_WIDTH = 250; // Small PX
const MID_THUMBNAIL_WIDTH = 450; // Medium PX
const SUPPORTED_FORMATS = {
  jpg: true,
  jpeg: true,
  png: true,
  webp: true,
  gif: true,
  tiff: true,
  tif: true,
  raw: true,
  psd: true,
  eps: true,
  ai: true,
  indd: true,
  heic: true,
  hevc: true,
  heif: true,
  svg: true,
  bmp: true,
  ico: true,
  cur: true,
  jfif: true,
  pjpeg: true,
  pjp: true,
  apng: true,
  dsc: true,
  nef: true,
  NEF: true,
};

export const handler = async (event, context) => {
  console.log(event);
  const { eventTime, s3 } = event.Records[0];
  const srcBucket = s3.bucket.name;

  // Object key may have spaces or unicode non-ASCII characters
  const srcKey = decodeURIComponent(s3.object.key.replace(/\+/g, " "));
  console.log(srcKey);
  
  // Destiination Key modifiication & extension management
  const small_dstKey = srcKey.replace("attachments/images", "attachments/images/small");
  const mid_dstKey = srcKey.replace("attachments/images", "attachments/images/medium");
  const original_dstKey = srcKey.replace("attachments/images", "attachments/images");

  /*const small_dstKey = srcKey.replace("image", "image/small");
  const mid_dstKey = srcKey.replace("image", "image/medium");
  const original_dstKey = srcKey.replace("image", "image");*/

  console.log(original_dstKey);
  console.log(small_dstKey);
  console.log(mid_dstKey);
  const ext = srcKey.replace(/^.*\./, "").toLowerCase();

  // Check the file extension if it's valid or not
  console.log(`${eventTime} - ${srcBucket}/${srcKey}`);
  if (!SUPPORTED_FORMATS[ext]) {
    console.log(`ERROR: Unsupported file type (${ext})`);
    return;
  }

  
  // Get the image from the source bucket
  try {
    const { Body, ContentType } = await S3.send(
      new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      })
    );
    const image = await Body.transformToByteArray();
    console.log(image);

    await S3.send(
      new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: original_dstKey,
        Body: image,
        ACL: 'public-read',
        ContentType,
      })
    );
    // Resize small image
    const smalloutputBuffer = await sharp(image).resize(SMALL_THUMBNAIL_WIDTH).toBuffer();
    // Resize medium image
    const midoutputBuffer = await sharp(image).resize(MID_THUMBNAIL_WIDTH).toBuffer();

    // Store new small image in the destination bucket
    await S3.send(
      new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: small_dstKey,
        Body: smalloutputBuffer,
        ACL: 'public-read',
        ContentType,
      })
    );
    console.log(await S3.send);

    // Store new medium image in the destination bucket
    await S3.send(
      new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: mid_dstKey,
        Body: midoutputBuffer,
        ACL: 'public-read',
        ContentType,
      })
    );

    const message = `Successfully resized to small & medium from ${srcBucket}/${srcKey} and uploaded to ${DEST_BUCKET}/${small_dstKey} also transfer the original from ${srcBucket}/${srcKey} to ${DEST_BUCKET}/${original_dstKey}`;
    console.log(message);
    return {
      statusCode: 200,
      body: message,
    };
  } catch (error) {
    console.log(error);
  }


};