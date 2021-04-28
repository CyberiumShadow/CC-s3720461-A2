import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { dbClient } from '@lib/aws'

import type { ScanCommandInput } from '@aws-sdk/client-dynamodb'
import type { NextApiRequest, NextApiResponse } from 'next'

interface SongQueryData {
  title?: string
  artist?: string
  year?: string
}

interface SongQueryResult {
  title?: { S: string }
  artist?: { S: string }
  year?: { S: string }
  img_url?: { S: string }
}

const processQueryString = (data: SongQueryData): string => {
  const queryStringArray = []

  if (data.artist) queryStringArray.push('contains(artist, :artist)')
  if (data.title) queryStringArray.push('contains(title, :title)')
  if (data.year) queryStringArray.push('contains(#year, :year)')

  return queryStringArray.join(' AND ')
}

const processItems = (data: SongQueryResult[]): SongQueryData[] => {
  const processedData = []
  data.map((song) => {
    processedData.push({
      title: song.title.S,
      artist: song.artist.S,
      year: song.year.S,
      img_url: `https://s3720461-cc-a2-artist-images.s3.amazonaws.com/artists/${
        song.img_url.S.split('/')[5]
      }`,
    })
  })
  return processedData
}

export default async (_: NextApiRequest, res: NextApiResponse): Promise<unknown> => {
  switch (_.method) {
    case 'GET': {
      const songQuery: SongQueryData = _.query
      const params: ScanCommandInput = {
        TableName: 'music',
        FilterExpression: processQueryString(songQuery),
        ...(songQuery.year && {
          ExpressionAttributeNames: {
            '#year': 'year',
          },
        }),
        ExpressionAttributeValues: {
          ...(songQuery.artist && { ':artist': { S: songQuery.artist } }),
          ...(songQuery.title && { ':title': { S: songQuery.title } }),
          ...(songQuery.year && { ':year': { S: songQuery.year } }),
        },
      }
      const { Items } = await dbClient.send(new ScanCommand(params))
      if (Items.length == 0)
        return res.status(200).json({ message: 'No result is retrieved. Please query again' })
      const results = processItems(Items)
      return res.status(200).json(results)
    }
    default:
      res.setHeader('Allow', ['POST', 'PATCH'])
      res.status(405).end(`Method ${_.method} Not Allowed`)
  }
}
