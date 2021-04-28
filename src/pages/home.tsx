import Head from 'next/head'
import Layout, { siteTitle } from '@components/layout'
import utilStyles from '@styles/utils.module.css'
import { Container, Row, Col, CardColumns, Card, ListGroup, Button } from 'react-bootstrap'
import UserPanel from '@components/UserPanel'
import QueryForm from '@components/QueryForm'
import useUser from '@lib/hooks/useUser'
import useSWR from 'swr'

import { useState } from 'react'
import fetchJson from '@lib/fetchJson'

function useQuery(queryObject) {
  const queryStringArray = []
  if (queryObject.artist) queryStringArray.push(`artist=${queryObject.artist}`)
  if (queryObject.title) queryStringArray.push(`title=${queryObject.title}`)
  if (queryObject.year) queryStringArray.push(`year=${queryObject.year}`)

  const { data, error } = useSWR(
    queryStringArray.length != 0 ? `/api/songs?${queryStringArray.join('&')}` : null
  )

  return {
    songs: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default function Home(): JSX.Element {
  const { user } = useUser({ redirectTo: '/' })
  const [query, setQuery] = useState('')
  const { songs, isLoading: queryLoading } = useQuery(query)
  const { data, error } = useSWR(
    user?.isLoggedIn ? `/api/users/${user.email}/subscriptions` : null,
    { refreshInterval: 1000 }
  )

  if (!user?.isLoggedIn) {
    return <Layout>loading...</Layout>
  }
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Container fluid>
        <Row>
          <Col>
            <UserPanel />
          </Col>
          <Col>
            <div className="root-container">{<QueryForm passQuery={setQuery} />}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className={utilStyles.headingXl}>User Subscriptions</h2>
            {!data && !error ? (
              <p>Loading Subscriptions...</p>
            ) : error ? (
              <p>An Error has occured whilst loading subscriptions</p>
            ) : data.length == 0 ? (
              <p>There are currently no subscribed songs</p>
            ) : (
              <CardColumns>
                {data.map((song) => (
                  <Card style={{ width: '100%' }} key={song.title}>
                    <Card.Img variant="top" src={song.img_url}></Card.Img>
                    <Card.Body>
                      <Card.Text>
                        <ListGroup>
                          <ListGroup.Item>Artist: {song.artist}</ListGroup.Item>
                          <ListGroup.Item>Title: {song.title}</ListGroup.Item>
                          <ListGroup.Item>Year: {song.year}</ListGroup.Item>
                          <Button
                            href="#"
                            variant="danger"
                            onClick={async (e) => {
                              e.preventDefault()
                              return fetchJson(
                                `/api/users/${encodeURIComponent(user.email)}/subscriptions`,
                                {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    operation: 'UNSUBSCRIBE',
                                    artist: song.artist,
                                    title: song.title,
                                  }),
                                }
                              )
                            }}
                          >
                            Remove
                          </Button>
                        </ListGroup>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </CardColumns>
            )}
          </Col>
          <Col>
            <h2 className={utilStyles.headingXl}>Query Results</h2>
            {queryLoading ? (
              <p>Pending Query...</p>
            ) : songs.message ? (
              <p>{songs.message}</p>
            ) : (
              <CardColumns>
                {songs.map((song) => (
                  <Card style={{ width: '100%' }} key={song.title}>
                    <Card.Img variant="top" src={song.img_url}></Card.Img>
                    <Card.Body>
                      <Card.Text>
                        <ListGroup>
                          <ListGroup.Item>Artist: {song.artist}</ListGroup.Item>
                          <ListGroup.Item>Title: {song.title}</ListGroup.Item>
                          <ListGroup.Item>Year: {song.year}</ListGroup.Item>
                          {data
                            .map((song) => {
                              return song.title
                            })
                            .includes(song.title) ? (
                            <Button disabled href="#">
                              Already Subscribed
                            </Button>
                          ) : (
                            <Button
                              href="#"
                              onClick={async (e) => {
                                e.preventDefault()
                                return fetchJson(
                                  `/api/users/${encodeURIComponent(user.email)}/subscriptions`,
                                  {
                                    method: 'PATCH',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      operation: 'SUBSCRIBE',
                                      artist: song.artist,
                                      title: song.title,
                                      year: song.year,
                                      img_url: song.img_url,
                                    }),
                                  }
                                )
                              }}
                            >
                              Subscribe
                            </Button>
                          )}
                        </ListGroup>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </CardColumns>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}
