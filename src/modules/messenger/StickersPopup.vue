<template>
  <teleport v-if="teleportEl" :to="teleportEl">
    <transition>
      <div v-if="stickers.length" class="vkfix-stickers-popup">
        <img v-for="sticker of lastStickers"
             :key="sticker.photo.id"
             :src="sticker.photo.sizes[0].url"
             :alt="sticker.photo.text"
             :title="sticker.suggestions[0]"
             @click="emit('sendSticker', sticker)"
        />
      </div>
    </transition>
    <div
        v-if="isDev"
        :title="`Загружено фотографий-стикеров: ${photos.length}`"
        style="position: absolute; right: 0; bottom: 0; min-width: 2px; min-height: 2px; border-radius: 50%; background-color: green;"
    />
  </teleport>
</template>
<script lang="ts" setup>

import {PhotoSticker} from "./types";
import {isDev} from "../../common/consts";
import {computed} from "vue";

const props = defineProps<{
  photos: PhotoSticker[]
  stickers: PhotoSticker[]
  teleportEl?: HTMLDivElement
}>()

const lastStickers = computed<PhotoSticker[]>(prev => {
  if (props.stickers.length === 0 && prev?.length > 0) {
    return prev
  }

  return props.stickers
})

const emit = defineEmits<{
  (e: 'sendSticker', sticker: PhotoSticker): void
}>()
</script>
<style lang="scss">
.vkfix-stickers-popup {
  position: absolute;
  top: -102px;
  left: 0;
  height: 100px;
  width: 100%;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1px;
  z-index: 2;
  pointer-events: none;

  & > * {
    pointer-events: all;
  }

  img {
    height: 99px;
    outline: 1px solid white;
    outline-offset: -1px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
  }

  &.v-enter-active,
  &.v-leave-active {
    transition: opacity 0.5s ease;
  }

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
  }
}

.ConvoMain:has(.vkfix-stickers-popup) {
  .ConvoComposer__stickersPanel {
    display: none !important;
  }
}
</style>