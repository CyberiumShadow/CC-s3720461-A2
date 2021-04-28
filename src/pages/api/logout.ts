import withSession from '@lib/session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-iron-session'

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
  req.session.destroy()
  return res.status(200).json({ isLoggedIn: false })
})
