import db from "#server/lib/db"
import { getUserFromSession } from "#server/lib/utils"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)

  const user = await db.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      accounts: true,
    },
  })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" })
  }

  const spotifyAccount = user.accounts.find(acc => acc.provider === "spotify")
  if (!spotifyAccount || !spotifyAccount.accessToken) {
    throw createError({ statusCode: 403, statusMessage: "No Spotify token found" })
  }

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${spotifyAccount.accessToken}` },
  })
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: "Failed to get Spotify profile" })
  }
  const profile = await response.json()

  return { ...user, profile }
})
