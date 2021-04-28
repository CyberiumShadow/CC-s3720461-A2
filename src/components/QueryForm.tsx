import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function QueryForm(props): JSX.Element {
  const submitQuery = (event) => {
    event.preventDefault()
    const { songTitle, songArtist, songYear } = event.target
    return props.passQuery({
      title: encodeURIComponent(songTitle.value),
      artist: encodeURIComponent(songArtist.value),
      year: encodeURIComponent(songYear.value),
    })
  }

  return (
    <Form onSubmit={submitQuery}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          id="songTitle"
          name="songTitle"
          type="text"
          placeholder="Song Title"
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Artist</Form.Label>
        <Form.Control
          id="songArtist"
          name="songArtist"
          type="text"
          placeholder="Song Artist"
        ></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Year</Form.Label>
        <Form.Control
          id="songYear"
          name="songYear"
          type="text"
          placeholder="Song Year"
        ></Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Query
      </Button>
    </Form>
  )
}
