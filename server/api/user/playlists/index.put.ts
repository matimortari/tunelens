import { Buffer } from "node:buffer"
import db from "#server/lib/db"
import { getUserFromSession } from "~~/server/lib/utils"

export default defineEventHandler(async (event) => {
  const sessionUser = await getUserFromSession(event)
  const body = await readBody(event)
  const { playlistId, image } = body || {}
  if (!playlistId || !image) {
    throw createError({ statusCode: 400, statusMessage: "Missing required parameters" })
  }

  const base64Match = image.match(/^data:image\/(jpeg|jpg|png);base64,(.*)$/)
  if (!base64Match) {
    throw createError({ statusCode: 400, statusMessage: "Invalid image format. Only JPEG and PNG are allowed." })
  }

  const account = await db.account.findFirst({
    where: { userId: sessionUser.id, provider: "spotify" },
  })
  if (!account || !account.accessToken) {
    throw createError({ statusCode: 403, statusMessage: "No Spotify token found" })
  }

  const imageType = base64Match[1] === "png" ? "image/png" : "image/jpeg"
  const imageBuffer = Buffer.from(base64Match[2], "base64")

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/images`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${account.accessToken}`,
        "Content-Type": imageType,
      },
      body: imageBuffer,
    },
  )
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: "Failed to update playlist image" })
  }

  return { message: "Playlist image updated successfully!" }
})
