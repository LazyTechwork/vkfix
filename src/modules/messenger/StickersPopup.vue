<template>
  <teleport v-if="stickers.length" to=".ConvoComposer__inputPanel">
    <div class="vkfix-stickers-popup">
      <img v-for="sticker of stickers"
           :key="sticker.photo.id"
           :src="sticker.photo.sizes[0].url"
           :alt="sticker.photo.text"
           :title="sticker.suggestions[0]"
           @click="emit('sendSticker', sticker)"
      />
    </div>

  </teleport>
</template>
<script lang="ts" setup>

import {PhotoSticker} from "./types";

const props = defineProps<{
  photos: PhotoSticker[]
  stickers: PhotoSticker[]
}>()
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

  img {
    height: 99px;
    outline: 1px solid white;
    outline-offset: -1px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
  }
}

.ConvoMain:has(.vkfix-stickers-popup) {
  .ConvoComposer__stickersPanel {
    display: none !important;
  }
}
</style>