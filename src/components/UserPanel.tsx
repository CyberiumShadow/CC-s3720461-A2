import React from 'react'
import { Container, Col, Row, Card } from 'react-bootstrap'
import { useRouter } from 'next/router'
import useUser from '@lib/hooks/useUser'
import fetchJson from '@lib/fetchJson'

const UserPanel = () => {
  const { user, mutateUser } = useUser()
  const router = useRouter()
  return (
    <Container>
      <Row>
        <Col></Col>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <Card.Title>{user.userName}</Card.Title>
              <Card.Link
                href="#"
                onClick={async (e) => {
                  e.preventDefault()
                  mutateUser(await fetchJson('/api/logout', { method: 'POST' }), false)
                  router.push('/')
                }}
              >
                Logout
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}

export default UserPanel
