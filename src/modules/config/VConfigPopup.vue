<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="v-config-overlay" @click.self="close">
        <div class="v-config-popup" ref="popupRef">
          <header class="v-config-popup__header">
            <div class="v-config-popup__title">
              <!-- Место под иконку заголовка -->
              <span class="v-config-popup__title-icon">⚙️</span>
              <h2 class="v-config-popup__heading">{{ title }}</h2>
            </div>
            <button class="v-config-popup__close" @click="close" title="Закрыть">
              <!-- Место под иконку закрытия -->
              <span class="v-config-popup__close-icon">✕</span>
            </button>
          </header>

          <div class="v-config-popup__body">
            <!-- Место под иконки навигации по секциям -->
            <nav class="v-config-popup__sidebar">
              <button
                v-for="section in sections"
                :key="section.id"
                class="v-config-popup__nav-btn"
                :class="{ 'v-config-popup__nav-btn--active': activeSection === section.id }"
                @click="activeSection = section.id"
              >
                <!-- Место под иконку секции -->
                <span class="v-config-popup__nav-icon">{{ section.icon }}</span>
                <span class="v-config-popup__nav-text">{{ section.title }}</span>
              </button>
            </nav>

            <main class="v-config-popup__content">
              <div
                v-for="section in sections"
                v-show="activeSection === section.id"
                :key="section.id"
                class="v-config-popup__section"
              >
                <h3 class="v-config-popup__section-title">
                  <!-- Место под иконку секции -->
                  <span class="v-config-popup__section-icon">{{ section.icon }}</span>
                  {{ section.title }}
                </h3>

                <!-- Поля настроек -->
                <div class="v-config-popup__fields">
                  <VConfigField
                    v-for="field in getSectionFields(section.id)"
                    :key="field.key"
                    :field="field"
                    :value="getFieldValue(field.key)"
                    @update="handleUpdate"
                  />
                </div>
              </div>
            </main>
          </div>

          <footer class="v-config-popup__footer">
            <!-- Место под иконку сброса -->
            <button class="v-config-popup__btn v-config-popup__btn--secondary" @click="resetDefaults">
              <span class="v-config-popup__btn-icon">🔄</span>
              Сбросить настройки
            </button>
            <button class="v-config-popup__btn v-config-popup__btn--primary" @click="saveAndClose">
              <!-- Место под иконку сохранения -->
              <span class="v-config-popup__btn-icon">💾</span>
              Сохранить и перезагрузить
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMagicKeys, useToggle } from '@vueuse/core'
import { GlobalConfig } from '../../GlobalConfig'
import VConfigField from './VConfigField.vue'
import { configSections, configFieldsMeta, getConfigValue, setConfigValue } from './configData'
import type { ConfigFieldInfo } from './configData'

const sections = configSections
const title = 'Настройка VK Fix'

const popupRef = ref<HTMLDivElement | null>(null)
const activeSection = ref<string>('general')

const { Escape } = useMagicKeys()
const [isOpen, toggleOpen] = useToggle(false)

// Хранилище локальных значений полей
const fieldValues = ref<Record<string, boolean | string>>({})

// Инициализация значений при открытии
watch(
  () => isOpen.value,
  (v) => {
    if (v) {
      // Загружаем текущие значения всех полей
      for (const section of sections) {
        for (const key of section.fieldKeys) {
          fieldValues.value[key] = getConfigValue(key)
        }
      }
    }
  },
  { immediate: true }
)

watch(Escape, (v) => {
  if (v && isOpen.value) {
    close()
  }
})

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function getFieldValue(key: string): boolean | string {
  return fieldValues.value[key] ?? getConfigValue(key)
}

function getSectionFields(sectionId: string): ConfigFieldInfo[] {
  const section = sections.find(s => s.id === sectionId)
  if (!section) return []
  
  return section.fieldKeys
    .map(key => configFieldsMeta[key])
    .filter(Boolean)
}

function handleUpdate(fieldKey: string, value: boolean | string) {
  fieldValues.value[fieldKey] = value
}

function resetDefaults() {
  for (const section of sections) {
    for (const key of section.fieldKeys) {
      const meta = configFieldsMeta[key]
      if (meta) {
        fieldValues.value[key] = meta.type === 'checkbox' ? false : (meta as any).default ?? ''
      }
    }
  }
}

function saveAndClose() {
  // Сохраняем все значения в GM_config
  for (const [key, value] of Object.entries(fieldValues.value)) {
    setConfigValue(key, value)
  }
  // Перезагружаем страницу
  unsafeWindow.location.reload()
}

defineExpose({ open, close })
</script>

<style lang="scss">
.v-config-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.v-config-popup {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e1e3e6;
    background-color: #f5f5f5;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 12px;

    &-icon {
      font-size: 24px;
      line-height: 1;
    }
  }

  &__heading {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #000;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &__close-icon {
    font-size: 20px;
    line-height: 1;
    color: #666;
  }

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border-right: 1px solid #e1e3e6;
    background-color: #f9f9f9;
    overflow-y: auto;
    min-width: 200px;
  }

  &__nav-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
    color: #333;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &--active {
      background-color: #e5ebf1;
      color: #2a5885;
      font-weight: 500;
    }
  }

  &__nav-icon {
    font-size: 18px;
    line-height: 1;
  }

  &__nav-text {
    flex: 1;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }

  &__section-icon {
    font-size: 20px;
    line-height: 1;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid #e1e3e6;
    background-color: #f5f5f5;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition:
      background-color 0.2s ease,
      transform 0.1s ease;

    &:active {
      transform: scale(0.98);
    }

    &--secondary {
      background-color: #e5ebf1;
      color: #2a5885;

      &:hover {
        background-color: #d5dde5;
      }
    }

    &--primary {
      background-color: #2a5885;
      color: #fff;

      &:hover {
        background-color: #1f456b;
      }
    }
  }

  &__btn-icon {
    font-size: 16px;
    line-height: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Тёмная тема
body[scheme='vkcom_dark'] {
  .v-config-overlay {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .v-config-popup {
    background-color: #191919;

    &__header {
      border-bottom-color: #333;
      background-color: #222;
    }

    &__heading {
      color: #e1e1e1;
    }

    &__close-icon {
      color: #999;
    }

    &__close:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &__sidebar {
      border-right-color: #333;
      background-color: #1f1f1f;
    }

    &__nav-btn {
      color: #e1e1e1;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }

      &--active {
        background-color: #2d3a4a;
        color: #4a76a8;
      }
    }

    &__section-title {
      color: #e1e1e1;
    }

    &__footer {
      border-top-color: #333;
      background-color: #222;
    }

    &__btn {
      &--secondary {
        background-color: #2d3a4a;
        color: #4a76a8;

        &:hover {
          background-color: #3d4a5a;
        }
      }

      &--primary {
        background-color: #4a76a8;
        color: #fff;

        &:hover {
          background-color: #5a86b8;
        }
      }
    }
  }
}
</style>
