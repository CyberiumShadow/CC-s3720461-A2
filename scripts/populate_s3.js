#! /usr/bin/env node
const { S3Client, CreateBucketCommand, DeleteBucketCommand, ListObjectsV2Command, PutObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const fetch = require('node-fetch');

const [, , ...args] = process.argv;

const s3client = new S3Client({
  region: 'us-east-1',
});

const command = args[0];

const sendCommand = async (command) => {
  try {
    const data = await s3client.send(command);
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
}

const bucketParams = {
  Bucket: "s3720461-cc-a2-artist-images",
  ACL: "public-read"
}

switch (command) {
  case 'init': {
    return sendCommand(new CreateBucketCommand(bucketParams))
  }
  case 'populate': {
    const { songs } = require('../a2.json');
    return songs.map(async (song) => {
      const res = await fetch(song.img_url);
      const buffer = await res.buffer();
      const uploadParams = {
        Bucket: bucketParams.Bucket,
        Key: `artists/${song.img_url.split('/')[5]}`,
        Body: buffer,
        ACL: "public-read"
      };
      return sendCommand(new PutObjectCommand(uploadParams));
    })
  }
  case 'teardown': {
  sendCommand(new ListObjectsV2Command(bucketParams)).then(async (result) => {
    if (!result) return;
    const objects = result.Contents.map((object) => {
      return {
        Key: object.Key
      }
    })

    const deleteParams = {
     Bucket: bucketParams.Bucket,
     Delete: {
       Objects: objects
     }
    }

    await sendCommand(new DeleteObjectsCommand(deleteParams));
    return sendCommand(new DeleteBucketCommand(bucketParams));
    });
  }
}