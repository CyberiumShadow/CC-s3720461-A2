export default async function fetchJson(resource: RequestInfo, init: RequestInit) {
  try {
    const response = await fetch(resource, init)

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json()

    if (response.ok) {
      return data
    }
    return { status: response.status, ...data }
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message }
    }
    throw error
  }
}
