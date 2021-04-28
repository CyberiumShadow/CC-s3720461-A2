import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { dbClient } from '@lib/aws'

import type { GetItemCommandInput, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'
import type { NextApiRequest, NextApiResponse } from 'next'

interface SubscriptionData {
  title?: string
  artist?: string
  year?: string
}

interface SubscriptionResult {
  M: {
    title?: { S: string }
    artist?: { S: string }
    year?: { S: string }
    img_url?: { S: string }
  }
}

const processItems = (data: SubscriptionResult[]): SubscriptionData[] => {
  const processedData = []
  data.map((song) => {
    const { M: data } = song
    processedData.push({
      title: data.title.S,
      artist: data.artist.S,
      year: data.year.S,
      img_url: data.img_url.S,
    })
  })
  return processedData
}

const getSubscriptions = async (id) => {
  const params: GetItemCommandInput = {
    TableName: 'login',
    Key: {
      email: { S: id },
    },
    ProjectionExpression: 'subscriptions',
  }
  const {
    Item: {
      subscriptions: { L: subscriptions },
    },
  } = await dbClient.send(new GetItemCommand(params))
  return subscriptions
}

export default async (_: NextApiRequest, res: NextApiResponse): Promise<unknown> => {
  switch (_.method) {
    case 'GET': {
      const { id } = _.query

      const subscriptions = (await getSubscriptions(id)) as SubscriptionResult[]
      return res.status(200).json(processItems(subscriptions))
    }
    case 'PATCH': {
      const { id } = _.query
      const data = _.body
      const currentSubscriptions = await getSubscriptions(id)

      switch (data.operation) {
        case 'UNSUBSCRIBE': {
          const index = currentSubscriptions
            .map((object) => {
              return object.M.title.S
            })
            .indexOf(data.title)

          const params: UpdateItemCommandInput = {
            TableName: 'login',
            Key: {
              email: { S: id as string },
            },
            UpdateExpression: `REMOVE subscriptions[${index}]`,
            ReturnValues: 'ALL_NEW',
          }
          const {
            Attributes: {
              subscriptions: { L: subscriptions },
            },
          } = await dbClient.send(new UpdateItemCommand(params))

          return res.status(200).json(subscriptions)
        }
        case 'SUBSCRIBE': {
          const newSubscription = {
            artist: { S: data.artist },
            title: { S: data.title },
            year: { S: data.year },
            img_url: { S: data.img_url },
          }
          const params: UpdateItemCommandInput = {
            TableName: 'login',
            Key: {
              email: { S: id as string },
            },
            UpdateExpression: 'SET subscriptions = list_append(subscriptions, :newSubscription)',
            ExpressionAttributeValues: {
              ':newSubscription': {
                L: [{ M: newSubscription }],
              },
            },
            ReturnValues: 'UPDATED_NEW',
          }
          const {
            Attributes: {
              subscriptions: { L: subscriptions },
            },
          } = await dbClient.send(new UpdateItemCommand(params))
          return res.status(200).json(subscriptions)
        }
      }
      break
    }
    default:
      res.setHeader('Allow', ['GET', 'PATCH'])
      res.status(405).end(`Method ${_.method} Not Allowed`)
  }
}
