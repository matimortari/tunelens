<template>
  <Dialog :is-open="isOpen" :title="playlist?.name" @update:is-open="$emit('update:isOpen', $event)">
    <p v-if="userStore.isPlaylistLoading" class="text-center text-sm text-muted-foreground">
      Loading tracks...
    </p>
    <p v-else-if="!tracks.length" class="text-center text-sm text-muted-foreground">
      No tracks found in this playlist.
    </p>

    <div v-else class="flex flex-col">
      <div class="flex items-start gap-4 border-b border-primary py-2">
        <img :src="playlist?.images?.[0]?.url" alt="Playlist cover" class="size-32 flex-shrink-0 rounded-lg object-cover shadow-md">
        <div class="flex flex-col items-start gap-2 truncate text-sm">
          <div class="flex items-center gap-2">
            <a
              :href="playlist?.external_urls.spotify" target="_blank"
              rel="noopener noreferrer" class="flex flex-row items-center gap-1 truncate text-primary hover:underline"
            >
              <icon name="ph:spotify-logo" size="20" />
              <span>Open in Spotify</span>
            </a>
            <button class="flex flex-row items-center gap-1 truncate hover:underline" @click="exportTracks">
              <icon name="ph:export" size="20" />
              <span>Export Track List</span>
            </button>
          </div>

          <p v-if="playlist?.description" class="line-clamp-3 break-words font-light text-muted-foreground">
            {{ playlist?.description }}
          </p>
        </div>
      </div>

      <div v-if="tracks.length" class="custom-scrollbar flex max-h-64 flex-col gap-2 overflow-y-auto">
        <ul class="list-none text-xs">
          <li
            v-for="trackItem in tracks" :key="trackItem.track.id"
            class="flex items-center justify-between gap-8 border-b p-2 last:border-b-0"
          >
            <div class="flex flex-shrink-0 items-center gap-2">
              <img :src="trackItem.track.album.images?.[2]?.url || ''" alt="Album cover" class="size-10 flex-shrink-0 rounded object-cover">

              <span class="truncate font-medium" :title="trackItem.track.name">
                {{ trackItem.track.name }}
              </span>
            </div>

            <div class="flex max-w-[60%] flex-shrink-0 flex-col text-right">
              <span class="truncate" :title="trackItem.track.album.name">
                {{ trackItem.track.album.name }}
              </span>

              <span class="truncate italic text-muted-foreground" :title="trackItem.track.artists.map((a: { name: string }) => a.name).join(', ')">
                {{ trackItem.track.artists.map((a: { name: string }) => a.name).join(", ") }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "~/lib/stores/user-store"

const props = defineProps<{
  isOpen: boolean
  playlist: PlaylistType | null
}>()

defineEmits(["update:isOpen"])

const tracks = ref<any[]>([])
const userStore = useUserStore()

function exportTracks() {
  if (!tracks.value.length)
    return

  const lines = tracks.value.map((trackItem) => {
    const track = trackItem.track
    const trackName = track.name
    const albumName = track.album.name
    const artists = track.artists.map((a: { name: string }) => a.name).join(", ")
    return `${trackName} - ${albumName} - ${artists}`
  })

  const blob = new Blob([lines.join("\n")], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `${props.playlist?.name || "playlist"}-tracks.txt`
  document.body.appendChild(a)
  a.click()

  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

watch(() => props.isOpen, async (open) => {
  if (open && props.playlist) {
    tracks.value = []
    try {
      tracks.value = await userStore.getPlaylistTracks(props.playlist.id)
    }
    catch (error: any) {
      console.error("Failed to get playlist tracks:", error)
      tracks.value = []
    }
  }
}, { immediate: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.4);
  border-radius: 3px;
}
</style>
