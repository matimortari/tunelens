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

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${account.accessToken}` },
  })
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: "Failed to get playlists" })
  }

  const data = await response.json()
  return data.items
})
