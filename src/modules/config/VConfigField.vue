<template>
  <div class="v-config-field" :class="`v-config-field--${field.type}`">
    <div class="v-config-field__header">
      <div class="v-config-field__label-wrapper">
        <!-- Место под иконку поля -->
        <span v-if="field.icon" class="v-config-field__icon">{{ field.icon }}</span>
        <label class="v-config-field__label" :for="field.key">
          {{ field.label }}
        </label>
      </div>
    </div>

    <div v-if="field.description" class="v-config-field__description">
      {{ field.description }}
    </div>

    <div class="v-config-field__control">
      <!-- Checkbox -->
      <div v-if="field.type === 'checkbox'" class="v-config-field__checkbox-wrapper">
        <input
          :id="field.key"
          v-model="localValue"
          type="checkbox"
          class="v-config-field__checkbox"
          @change="emitChange"
        />
        <span class="v-config-field__checkbox-indicator"></span>
      </div>

      <!-- Text -->
      <input
        v-else-if="field.type === 'text'"
        :id="field.key"
        v-model="localValue"
        type="text"
        class="v-config-field__input"
        @input="emitChange"
        :placeholder="field.default as string"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConfigFieldInfo } from './configData'
import { computed, ref, watch } from 'vue'

interface Props {
  field: ConfigFieldInfo
  value: boolean | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [fieldKey: string, value: boolean | string]
}>()

const localValue = ref(props.value)

watch(
  () => props.value,
  (newValue) => {
    localValue.value = newValue
  }
)

function emitChange() {
  emit('update', props.field.key, localValue.value)
}
</script>

<style lang="scss">
.v-config-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__label-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  &__icon {
    font-size: 20px;
    line-height: 1;
  }

  &__label {
    font-size: 15px;
    font-weight: 500;
    color: #000;
    cursor: pointer;
  }

  &__description {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }

  &__control {
    display: flex;
    align-items: center;
  }

  &__checkbox-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  &__checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .v-config-field__checkbox-indicator {
      background-color: #2a5885;
      border-color: #2a5885;

      &::after {
        opacity: 1;
        transform: scale(1);
      }
    }

    &:focus + .v-config-field__checkbox-indicator {
      box-shadow: 0 0 0 2px rgba(42, 88, 133, 0.3);
    }
  }

  &__checkbox-indicator {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &::after {
      content: '✓';
      position: absolute;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      opacity: 0;
      transform: scale(0.5);
      transition:
        opacity 0.2s ease,
        transform 0.2s ease;
    }
  }

  &__input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    font-size: 14px;
    color: #000;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: #2a5885;
      box-shadow: 0 0 0 2px rgba(42, 88, 133, 0.2);
    }

    &::placeholder {
      color: #999;
    }
  }

  &--checkbox {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .v-config-field__control {
      flex-shrink: 0;
    }

    .v-config-field__header {
      flex: 1;
    }
  }

  // Тёмная тема
  body[scheme='vkcom_dark'] & {
    background-color: #191919;

    &:hover {
      background-color: #222;
    }

    .v-config-field__label {
      color: #e1e1e1;
    }

    .v-config-field__description {
      color: #999;
    }

    .v-config-field__checkbox-indicator {
      border-color: #555;
      background-color: #191919;
    }

    .v-config-field__checkbox {
      &:checked + .v-config-field__checkbox-indicator {
        background-color: #4a76a8;
        border-color: #4a76a8;
      }

      &:focus + .v-config-field__checkbox-indicator {
        box-shadow: 0 0 0 2px rgba(74, 118, 168, 0.3);
      }
    }

    .v-config-field__input {
      border-color: #444;
      background-color: #222;
      color: #e1e1e1;

      &:focus {
        border-color: #4a76a8;
        box-shadow: 0 0 0 2px rgba(74, 118, 168, 0.2);
      }

      &::placeholder {
        color: #666;
      }
    }
  }
}
</style>
