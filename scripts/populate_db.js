#! /usr/bin/env node
const { DynamoDBClient, BatchWriteItemCommand, PutItemCommand, CreateTableCommand, DeleteTableCommand } = require('@aws-sdk/client-dynamodb')
const [, , ...args] = process.argv;

const dbclient = new DynamoDBClient({
  region: 'us-east-1',
});

const command = args[0];

const dynamoSend = async (command) => {
  try {
    const data = await dbclient.send(command);
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
}

const processCommand = async (command) => {
  switch (command) {
    case 'init': {
      const loginTableParams = {
        AttributeDefinitions: [
          {
            AttributeName: "email",
            AttributeType: "S"
          }
        ],
        KeySchema: [
          {
            AttributeName: "email",
            KeyType: "HASH"
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        TableName: "login"
      }
      return dynamoSend(new CreateTableCommand(loginTableParams))
    }
    case 'bootstrap': {
      const { users } = require('../bootstrap.json');
      const batchUsers = users.map((user) => {
        return {
          PutRequest: {
            Item: {
              email: { S: user.email },
              user_name: { S: user.user_name },
              password: { S: user.password },
              subscriptions: { L: []}
            }
          }
        }
      })
  
      const params = {
        RequestItems: {
          login: batchUsers
        }
      }
      return dynamoSend(new BatchWriteItemCommand(params));
    }
    case 'create': {
      const params = {
        AttributeDefinitions: [
          {
            AttributeName: "title",
            AttributeType: "S"
          },
          {
            AttributeName: "artist",
            AttributeType: "S"
          }
        ],
        KeySchema: [
          {
            AttributeName: "artist",
            KeyType: "HASH"
          },
          {
            AttributeName: "title",
            KeyType: "RANGE"
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        TableName: "music"
      }
      return dynamoSend(new CreateTableCommand(params));
    }
    case 'populate': {
      const { songs } = require('../a2.json');
      return songs.map((song) => {
        const params = {
          TableName: "music",
          Item: {
            artist: { S: song.artist },
            title: { S: song.title },
            year: { S: song.year },
            web_url: { S: song.web_url },
            img_url: { S: song.img_url }
          }
        }
        return dynamoSend(new PutItemCommand(params));
      })
    }
    case 'teardown': {
      const musicParams = {
        TableName: "music"
      };
      const loginParams = {
        TableName: "login"
      }
      await dynamoSend(new DeleteTableCommand(musicParams));
      return dynamoSend(new DeleteTableCommand(loginParams));
    }
    default:
      return console.log('Invalid Command')
  }
}

processCommand(command);