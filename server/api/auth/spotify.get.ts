import type { H3Event } from "h3"
import { handleOAuthUser } from "#server/lib/auth"
import { scopes } from "#shared/utils"

export default defineOAuthSpotifyEventHandler({
  config: {
    emailRequired: true,
    scope: scopes,
    clientId: process.env.NUXT_OAUTH_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NUXT_OAUTH_SPOTIFY_CLIENT_SECRET,
    redirectURL: `${process.env.NUXT_PUBLIC_BASE_URL}/api/auth/spotify`,
    authorizationURL: `https://accounts.spotify.com/authorize?scope=${encodeURIComponent(scopes.join(" "))}`,
  },

  async onSuccess(event: H3Event, { user, tokens }: { user: any, tokens: { access_token: string, refresh_token: string } }) {
    if (!user || typeof user !== "object")
      throw createError({ statusCode: 400, statusMessage: "Invalid user data" })

    const spotifyId = user.id?.toString()
    const email = user.email
    const name = user.name
    const picture = user.avatar_url
    const accessToken = tokens.access_token
    const refreshToken = tokens.refresh_token
    if (!spotifyId || !email || !accessToken || !refreshToken) {
      throw createError({ statusCode: 400, statusMessage: "Missing required user or token data" })
    }

    return handleOAuthUser(event, {
      id: spotifyId,
      name,
      email,
      image: picture,
      provider: "spotify",
      accessToken,
      refreshToken,
    })
  },

  async onError(event: H3Event, error: any) {
    console.error("Spotify OAuth error:", error)
    if (!event || !event.node?.res) {
      throw createError({ statusCode: 500, statusMessage: "Internal server error" })
    }

    return sendRedirect(event, "/sign-in?error=spotify_oauth_failed")
  },
})
