<template>
  <a
    id="top_vkfix_settings_link"
    href="#"
    class="v-config-button"
    @click.prevent="handleClick"
  >
    <div class="v-config-button__before">
      <Icon24MagicWandOutline class="v-config-button__icon" />
    </div>

    <div class="v-config-button__middle">
      <div class="v-config-button__content">
        <span class="v-config-button__text">
          VK Fix
        </span>
      </div>
    </div>

    <span class="v-config-button__indicator" />
  </a>
</template>

<script setup lang="ts">
import { Icon24MagicWandOutline } from 'vue-vkontakte-icons'

interface Props {
  onOpen: () => void
}

const props = defineProps<Props>()

function handleClick() {
  props.onOpen()
}

</script>

<style lang="scss" scoped>
.v-config-button {
  display: flex !important;
  align-items: center;
  padding: 0 12px;
  height: 34px;
  border-radius: 0;
  text-decoration: none;
  transition: background-color 0.15s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  user-select: none;
  box-sizing: border-box;
  width: 100%;

  &:hover {
    background-color: var(--vkui--color_background_secondary_alpha, rgba(0, 0, 0, 0.05));
  }

  &:active {
    background-color: var(--vkui--color_background_secondary_alpha, rgba(0, 0, 0, 0.08));
  }

  &__before {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  &__icon {
    display: block;
    width: 20px;
    height: 20px;
    color: var(--vkui--color_icon_accent, #2688eb);
  }

  &__middle {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__text {
    font-family: var(--vkui--font_text--font_family--compact, var(--vkui--font_text--font_family--regular));
    font-size: var(--vkui--font_headline1--font_size--compact, var(--vkui--font_headline1--font_size--regular));
    line-height: var(--vkui--font_headline1--line_height--compact, var(--vkui--font_headline1--line_height--regular));
    font-weight: var(--vkui--font_weight_base3);
    color: var(--vkui--color_text_primary, #000);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__indicator {
    flex-shrink: 0;
  }
}
</style>
