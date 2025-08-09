interface UserType {
  id: string
  email: string
  name: string | null
  description: string | null
  image: string | null
  createdAt: string
  updatedAt: string
  accounts: AccountType[]
  profile?: SpotifyProfileType
}

interface AccountType {
  id: string
  userId: string
  provider: string
  providerAccountId: string
  createdAt: Date
  updatedAt: Date
  accessToken: string | null
  refreshToken: string | null
}

interface SpotifyProfileType {
  country: string
  display_name: string
  email: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  href: string
  id: string
  images: {
    height: number | null
    url: string
    width: number | null
  }[]
  product: string
  type: string
  uri: string
}

interface PlaylistType {
  id: string
  name: string
  description: string | null
  images?: { url: string }[]
  external_urls: { spotify: string }
}
