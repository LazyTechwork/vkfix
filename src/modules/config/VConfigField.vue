<template>
  <div
    class="v-config-field"
    :class="`v-config-field--${field.type}`"
    @click="handleContainerClick"
  >
    <div class="v-config-field__container">
      <div class="v-config-field__info">
        <div class="v-config-field__header-row">
          <span v-if="field.icon" class="v-config-field__icon">
            {{ field.icon }}
          </span>
          <NText strong class="v-config-field__label">
            {{ field.label }}
          </NText>
        </div>
        
        <NText
          v-if="field.description"
          depth="3"
          class="v-config-field__description"
        >
          {{ field.description }}
        </NText>
      </div>

      <div class="v-config-field__control">
        <NSwitch
          v-if="field.type === 'checkbox'"
          :id="field.key"
          :value="Boolean(localValue)"
          @update:value="updateValue"
        >
          <template #checked-icon>
            <NIcon><Icon16Done /></NIcon>
          </template>
        </NSwitch>

        <NInput
          v-else-if="field.type === 'text'"
          :id="field.key"
          :value="String(localValue)"
          type="text"
          class="v-config-field__input"
          :placeholder="String(field.default || '')"
          @update:value="updateValue"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NSwitch, NInput, NIcon, NText } from 'naive-ui'
import { Icon16Done } from 'vue-vkontakte-icons'
import type { ConfigFieldInfo } from './configData'

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
  },
)

function updateValue(val: boolean | string) {
  localValue.value = val
  emit('update', props.field.key, val)
}

function handleContainerClick(event: MouseEvent) {
  if (props.field.type !== 'checkbox') {
    return
  }

  const target = event.target as HTMLElement

  if (target.closest('.n-switch')) {
    return
  }

  updateValue(!localValue.value)
}
</script>

<style lang="scss" scoped>
.v-config-field {
  padding: 16px 20px;
  border-radius: var(--n-border-radius);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__header-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  &__label {
    font-size: 15px;
    line-height: 1.3;
    color: var(--n-text-color);
    word-break: break-word;
  }

  &__description {
    padding-left: 36px;
    font-size: 13px;
    line-height: 1.4;
    display: block;
  }

  &__control {
    flex-shrink: 0;
  }

  &__input {
    :deep(.n-input) {
      background: rgba(0, 0, 0, 0.2);
    }
  }

  &--text {
    .v-config-field__container {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .v-config-field__control {
      width: 100%;
    }
  }

  &--checkbox {
    cursor: pointer;
  }
}
</style>
