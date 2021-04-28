import withSession from '@lib/session'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-iron-session'

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session
}

export default withSession(
  async (_: NextApiRequestWithSession, res: NextApiResponse): Promise<unknown> => {
    switch (_.method) {
      case 'GET': {
        const userSession = _.session.get('userSession')
        if (userSession) {
          return res.status(200).json({
            isLoggedIn: true,
            ...userSession,
          })
        }
        return res.status(401).json({
          isLoggedIn: false,
        })
      }
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${_.method} Not Allowed`)
    }
  }
)
