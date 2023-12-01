import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const main = async () => {
  const bucketName = "s3-local";
  const objectKey = "test/1";

  const client = new S3Client({
    endpoint: "http://s3mock:9090",
    region: "us-west-2",
    forcePathStyle: true,
    credentials: {
      accessKeyId: "dummy",
      secretAccessKey: "dummy",
    },
  });

  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const putUrl = await getSignedUrl(client, putCommand, { expiresIn: 604800 });

  console.log("putUrl", putUrl);

  await fetch(putUrl, {
    body: "Hello world",
    method: "PUT",
  });

  const getUrl = await getSignedUrl(client, getCommand, { expiresIn: 604800 });

  console.log("getUrl", getUrl);

  const res = await fetch(getUrl, {
    method: "GET",
  });

  console.log(await (await res.blob()).text());
};

main();
