import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const account = await db.account.findFirst({
    where: { userId: sessionUser.id, provider: "spotify" },
  })
  if (!account || !account.accessToken) {
    throw createError({ statusCode: 403, statusMessage: "No Spotify token found" })
  }

  const playlistId = event.context.params?.id
  if (!playlistId) {
    throw createError({ statusCode: 400, statusMessage: "Playlist ID required" })
  }

  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: { Authorization: `Bearer ${account.accessToken}` },
  })
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: "Failed to get playlist tracks" })
  }

  const data = await response.json()
  return data.items
})
