import { getBaseUrl } from "~/lib/utils"

export async function getUserService(): Promise<UserType> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user`, {
    method: "GET",
  })
  if (!response.ok)
    throw new Error(`${response.statusText}`)
  return await response.json()
}

export async function deleteUserService(): Promise<{ message: string }> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok)
    throw new Error(`${response.statusText}`)
  return await response.json()
}

export async function getSpotifyPlaylistsService() {
  const baseUrl = getBaseUrl()

  const response = await fetch(`${baseUrl}/api/user/playlists`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok)
    throw new Error(`${response.statusText}`)
  return await response.json()
}

export async function getPlaylistTracksService(playlistId: string) {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user/playlists/${playlistId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok)
    throw new Error(`${response.statusText}`)
  return await response.json()
}

export async function updatePlaylistCoverService(playlistId: string, image: string) {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/user/playlists/${playlistId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlistId, image }),
  })
  if (!response.ok)
    throw new Error(`${response.statusText}`)
  return await response.json()
}
