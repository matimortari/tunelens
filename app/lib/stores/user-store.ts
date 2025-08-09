import {
  deleteUserService,
  getPlaylistTracksService,
  getSpotifyPlaylistsService,
  getUserService,
  updatePlaylistCoverService,
} from "~/lib/services/user-service"

export const useUserStore = defineStore("user", () => {
  const user = ref<UserType | null>(null)
  const playlists = ref<PlaylistType[] | null>(null)
  const isLoading = ref(false)
  const isPlaylistLoading = ref(false)
  const error = ref<string | null>(null)

  async function getUser() {
    isLoading.value = true
    error.value = null

    try {
      user.value = await getUserService()
      return user.value
    }
    catch (error: any) {
      error.value = error?.message
      throw error
    }
    finally {
      isLoading.value = false
    }
  }

  async function deleteUser() {
    isLoading.value = true
    error.value = null

    try {
      const result = await deleteUserService()
      user.value = null
      return result
    }
    catch (error: any) {
      error.value = error?.message
      throw error
    }
    finally {
      isLoading.value = false
    }
  }

  async function getPlaylists() {
    isLoading.value = true
    error.value = null

    try {
      playlists.value = await getSpotifyPlaylistsService()
      return playlists.value
    }
    catch (error: any) {
      error.value = error?.message
      throw error
    }
    finally {
      isLoading.value = false
    }
  }

  async function getPlaylistTracks(playlistId: string) {
    isPlaylistLoading.value = true
    error.value = null

    try {
      const tracks = await getPlaylistTracksService(playlistId)
      return tracks
    }
    catch (error: any) {
      error.value = error?.message
      throw error
    }
    finally {
      isPlaylistLoading.value = false
    }
  }

  async function updatePlaylistCover(playlistId: string, image: string) {
    isPlaylistLoading.value = true
    error.value = null

    try {
      await updatePlaylistCoverService(playlistId, image)
      await getPlaylists()
    }
    catch (error: any) {
      error.value = error?.message
      throw error
    }
    finally {
      isPlaylistLoading.value = false
    }
  }

  return {
    user,
    playlists,
    isLoading,
    isPlaylistLoading,
    error,
    getUser,
    deleteUser,
    getPlaylists,
    getPlaylistTracks,
    updatePlaylistCover,
  }
})
