import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import withSession from '@lib/session'
import { dbClient } from '@lib/aws'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-iron-session'

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session
}

export default withSession(
  async (_: NextApiRequestWithSession, res: NextApiResponse): Promise<unknown> => {
    switch (_.method) {
      case 'POST': {
        const data = _.body
        const params = {
          TableName: 'login',
          Key: {
            email: { S: data.email },
          },
        }
        const result = await dbClient.send(new GetItemCommand(params))
        if (result.Item) {
          const userData = result.Item
          if (data.password !== userData.password.S) {
            return res.status(401).send({ message: 'Email or Password is incorrect' })
          }
          _.session.set('userSession', { email: userData.email.S, userName: userData.user_name.S })
          await _.session.save()
          return res.status(200).send({ email: userData.email.S, userName: userData.user_name.S })
        }

        return res.status(401).send({ message: 'Email or Password is incorrect' })
      }
      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${_.method} Not Allowed`)
    }
  }
)
