<template>
  <teleport to="body">
    <div v-if="visible" class="v-photo-stickers-gallery-overlay" @mousedown.self="emit('close')">
      <div class="v-photo-stickers-gallery">
        <div class="v-photo-stickers-gallery__header">
          <input
            ref="searchInputEl"
            class="v-photo-stickers-gallery__search"
            type="text"
            placeholder="Поиск стикеров..."
            :value="searchQuery"
            @input="searchQuery = ($event.target as HTMLInputElement).value"
            @keydown.escape="emit('close')"
            @keydown.stop
          />
          <span class="v-photo-stickers-gallery__count">{{ filteredStickers.length }}</span>
        </div>
        <div class="v-photo-stickers-gallery__grid">
          <a
            v-for="sticker in filteredStickers"
            :key="sticker.photo.id"
            class="v-photo-stickers-gallery__item"
            :href="getPhotoStickerHref(sticker)"
            @click.prevent.stop="onSend(sticker)"
          >
            <img
              class="v-photo-stickers-gallery__img"
            :src="getPhotoStickerUrl(sticker)"
              :alt="sticker.photo.text"
              loading="lazy"
              @dragstart.prevent
            />
            <div class="v-photo-stickers-gallery__label">{{ sticker.suggestions[0] }}</div>
          </a>
          <div v-if="filteredStickers.length === 0" class="v-photo-stickers-gallery__empty">
            Нет стикеров
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import {computed, nextTick, ref, watch} from "vue";
import {PhotoSticker} from "./types";
import {smartStickerSearch} from "../../classes/AdvancedStickerFilter";
import {getPhotoStickerHref, getPhotoStickerUrl} from "./photoStickerUtils";

const props = defineProps<{
  visible: boolean;
  photos: PhotoSticker[];
}>();

const emit = defineEmits<{
  (e: "sendSticker", sticker: PhotoSticker): void;
  (e: "close"): void;
}>();

const searchQuery = ref("");
const searchInputEl = ref<HTMLInputElement | null>(null);

const filteredStickers = computed(() => {
  if (!searchQuery.value.trim()) {
    return [...props.photos].reverse();
  }

  return smartStickerSearch(props.photos, searchQuery.value.trim());
});

watch(() => props.visible, async (v) => {
  if (v) {
    searchQuery.value = "";
    await nextTick();
    searchInputEl.value?.focus();
  }
});

function onSend(sticker: PhotoSticker) {
  emit("sendSticker", sticker);
  emit("close");
}
</script>
<style>
.v-photo-stickers-gallery-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.v-photo-stickers-gallery {
  width: min(680px, 92vw);
  max-height: min(75vh, 600px);
  background: #232323;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.v-photo-stickers-gallery__header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.v-photo-stickers-gallery__search {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
}

.v-photo-stickers-gallery__search::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.v-photo-stickers-gallery__count {
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  white-space: nowrap;
}

.v-photo-stickers-gallery__grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-auto-rows: 130px;
  gap: 10px;
  align-content: start;
  color-scheme: dark;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.v-photo-stickers-gallery__grid::-webkit-scrollbar {
  width: 6px;
}

.v-photo-stickers-gallery__grid::-webkit-scrollbar-track {
  background: transparent;
}

.v-photo-stickers-gallery__grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.v-photo-stickers-gallery__grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.35);
}

.v-photo-stickers-gallery__item {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.v-photo-stickers-gallery__item:hover {
  transform: scale(1.04);
}

.v-photo-stickers-gallery__img {
  width: 100%;
  flex: 1;
  min-height: 0;
  object-fit: cover;
  display: block;
}

.v-photo-stickers-gallery__label {
  padding: 6px 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  line-height: 1.35;
  word-break: break-word;
  text-align: left;
}

.v-photo-stickers-gallery__empty {
  grid-column: 1 / -1;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  padding: 40px 0;
  font-size: 14px;
}
</style>
