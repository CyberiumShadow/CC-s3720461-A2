import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { dbClient } from '@lib/aws'
import withSession from '@lib/session'

import type { NextApiRequest, NextApiResponse } from 'next'

interface UserData {
  email: string
  user_name: string
  password: string
}

export default withSession(
  async (_: NextApiRequest, res: NextApiResponse): Promise<unknown> => {
    switch (_.method) {
      case 'POST': {
        const userData: UserData = _.body
        const params = {
          TableName: 'login',
          Key: {
            email: { S: userData.email },
          },
        }
        const { Item } = await dbClient.send(new GetItemCommand(params))
        if (!Item) {
          const newUserParams = {
            TableName: 'login',
            Item: {
              email: { S: userData.email },
              user_name: { S: userData.user_name },
              password: { S: userData.password },
              subscriptions: { L: [] },
            },
          }
          await dbClient.send(new PutItemCommand(newUserParams))
          return res.status(200).send({ message: 'Account Created' })
        }

        return res.status(409).send({ message: 'Email already exists.' })
      }
      default:
        res.setHeader('Allow', ['POST', 'PATCH'])
        res.status(405).end(`Method ${_.method} Not Allowed`)
    }
  }
)
