<template>
  <a class="v-photo-sticker" tabindex="-1" :href="getHref(sticker)">
    <div :key="sticker.photo.id" class="v-photo-sticker-text">
      {{ sticker.suggestions[0] }}
    </div>
    <img
        ref="imgEl"
        class="v-photo-sticker-img"
        tabindex="0"
        :src="photoUrl"
        :alt="sticker.photo.text"
        :title="sticker.suggestions[0]"
        @dragstart.prevent
        @click.prevent.stop="emit('sendSticker', sticker)"
        @load="isLoading = false"
        @error="isError = true; isLoading = false;"
    />
  </a>
</template>
<script lang="ts" setup>
import {PhotoSticker} from "./types";
import {computed, ref, useTemplateRef, watch} from "vue";
import {useElementSize} from "@vueuse/core";

const props = defineProps<{
  sticker: PhotoSticker;
}>();

const emit = defineEmits<{
  (e: "sendSticker", sticker: PhotoSticker): void;
}>();

const imgEl = useTemplateRef("imgEl");

const photoUrl = computed(getPhotoUrl);

const isLoading = ref(true);
const isError = ref(false);

const {width: imgWidth} = useElementSize(imgEl);

const textWidth = computed(() => {
  return isError.value || isLoading.value ? '100px' : imgWidth.value + "px";
});

watch(photoUrl, () => {
  isLoading.value = true;
  isError.value = false;
})

function getAlbumId(sticker: PhotoSticker) {
  return sticker.photo.album_id === -15
      ? "000"
      : sticker.photo.album_id.toString();
}

function getHref(sticker: PhotoSticker) {
  const albumId = getAlbumId(sticker);
  const ownerId = sticker.photo.owner_id;
  const photoId = sticker.photo.id;
  return `https://${window.location.host}/album${ownerId}_${albumId}?z=photo${ownerId}_${photoId}`;
}

function getPhotoUrl() {
  return (
      props.sticker.photo.sizes.find((s) => s.type === "x")?.url ??
      props.sticker.photo.sizes[0].url
  );
}
</script>
<style lang="scss">
.v-photo-sticker {
  position: relative;
  opacity: v-bind('isLoading ? 0 : 1');
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: flex-end;
  transition: all 0.2s ease;

  .v-photo-sticker-text {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    white-space: normal;
    word-break: auto-phrase;
    padding: 4px;
    margin-bottom: -1px;
    text-align: left;
    font-size: 14px;
    line-height: 1.3;
    width: v-bind(textWidth);
    max-height: 70px;
    box-sizing: border-box;
    overflow: auto;
    outline: 1px solid rgba(255, 255, 255, 0.67);
    border-radius: 8px 8px 0 0;
    outline-offset: -1px;
  }

  .v-photo-sticker-img {
    position: relative;
    height: 99px;
    outline: 1px solid rgba(255, 255, 255, 0.67);
    outline-offset: -1px;
    border-radius: 0 0 8px 8px;
    object-fit: cover;
    cursor: pointer;

    &:focus {
      outline: var(--vkui_internal--outline);
      outline-offset: -2px;
    }
  }
}
</style>
