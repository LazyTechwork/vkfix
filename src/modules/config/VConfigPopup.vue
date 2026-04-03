<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <NModal
      v-model:show="isOpen"
      preset="card"
      class="v-config-popup"
      style="width: 90vw; max-width: 860px;"
      :bordered="false"
      size="huge"
      content-style="padding: 0;"
      header-style="padding: 20px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);"
      footer-style="padding: 20px 32px; border-top: 1px solid rgba(255, 255, 255, 0.06);"
      aria-modal="true"
    >
      <template #header>
        <NSpace align="center" :size="16">
          <NIcon size="28" color="var(--n-primary-color)">
            <Icon28SettingsOutline />
          </NIcon>
          <NText strong style="font-size: 22px; letter-spacing: -0.02em;">
            {{ title }}
          </NText>
        </NSpace>
      </template>

      <NLayout has-sider class="v-config-popup__layout">
        <NLayoutSider
          bordered
          width="240"
          class="v-config-popup__sider"
        >
          <NScrollbar>
            <NMenu
              v-model:value="activeSection"
              :options="menuOptions"
              class="v-config-popup__menu"
            />
          </NScrollbar>
        </NLayoutSider>

        <NLayoutContent content-style="padding: 24px 32px;">
          <NScrollbar>
            <transition name="fade-slide" mode="out-in">
              <div :key="activeSection">
                <NSpace v-if="currentSection" vertical :size="24">
                  <NText strong depth="1" style="font-size: 20px;">
                    {{ currentSection.title }}
                  </NText>

                  <NSpace vertical :size="16">
                    <VConfigField
                      v-for="field in currentFields"
                      :key="field.key"
                      :field="field"
                      :value="getFieldValue(field.key)"
                      @update="handleUpdate"
                    />
                  </NSpace>
                </NSpace>
              </div>
            </transition>
          </NScrollbar>
        </NLayoutContent>
      </NLayout>

      <template #footer>
        <div class="v-config-popup__footer">
          <NButton
            secondary
            strong
            size="large"
            @click="resetDefaults"
          >
            <template #icon>
              <NIcon><Icon24Replay /></NIcon>
            </template>
            Сбросить
          </NButton>

          <NButton
            type="primary"
            strong
            size="large"
            class="v-config-popup__save-btn"
            @click="saveAndClose"
          >
            <template #icon>
              <NIcon><Icon24DoneOutline /></NIcon>
            </template>
            Сохранить и применить
          </NButton>
        </div>
      </template>
    </NModal>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { ref, watch, computed, h } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import {
  NConfigProvider,
  NModal,
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NButton,
  NIcon,
  NSpace,
  NText,
  NScrollbar,
  darkTheme,
  useOsTheme,
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import {
  Icon28SettingsOutline,
  Icon24Replay,
  Icon24DoneOutline,
  Icon28ServicesOutline,
  Icon20PictureOutline,
  Icon28MessagesOutline,
  Icon28UserOutline,
  Icon28AdvertisingOutline,
} from 'vue-vkontakte-icons'
import VConfigField from './VConfigField.vue'
import { configSections, configFieldsMeta, getConfigValue, setConfigValue } from './configData'
import type { ConfigFieldInfo } from './configData'

const osTheme = useOsTheme()

const theme = computed(() => {
  return osTheme.value === 'dark' ? darkTheme : null
})

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  const isDark = osTheme.value === 'dark'
  
  return {
    common: {
      primaryColor: '#42d392',
      primaryColorHover: '#5ee4a8',
      primaryColorPressed: '#35a072',
      primaryColorSuppl: 'rgba(66, 211, 146, 0.15)',
      borderRadius: '14px',
    },
    Modal: {
      color: isDark ? '#18181c' : '#fff',
      borderRadius: '20px',
      boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.8)',
      headerPadding: '20px 28px',
      footerPadding: '20px 28px',
      textColor: isDark ? '#fff' : '#000',
    },
    Card: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      footerBackground: 'transparent',
      headerBackground: 'transparent',
    },
    Menu: {
      itemBorderRadius: '12px',
      itemHeight: '48px',
      itemColorActive: 'rgba(66, 211, 146, 0.12)',
      itemTextColorActive: '#74eeb3',
      itemTextColorHover: isDark ? '#fff' : '#000',
      itemIconColorActive: '#74eeb3',
      itemMargin: '4px 12px',
    },
    Button: {
      borderRadiusMedium: '14px',
      borderRadiusLarge: '14px',
      fontWeightStrong: '700',
    },
    Layout: {
      siderColor: 'rgba(255, 255, 255, 0.015)',
      color: 'transparent',
    },
  }
})

const sections = configSections
const title = 'Настройки VK Fix'

const activeSection = ref<string>('general')
const { Escape } = useMagicKeys()
const isOpen = ref(false)
const fieldValues = ref<Record<string, boolean | string>>({})

const menuOptions = computed(() => {
  const iconMap: Record<string, any> = {
    general: Icon28ServicesOutline,
    'photo-viewer': Icon20PictureOutline,
    messenger: Icon28MessagesOutline,
    profile: Icon28UserOutline,
    other: Icon28AdvertisingOutline,
  }

  return sections.map((section) => {
    return {
      label: section.title,
      key: section.id,
      icon: () => {
        return h(NIcon, null, {
          default: () => {
            return h(iconMap[section.id] || Icon28SettingsOutline)
          },
        })
      },
    }
  })
})

const currentSection = computed(() => {
  return sections.find((s) => {
    return s.id === activeSection.value
  })
})

const currentFields = computed<ConfigFieldInfo[]>(() => {
  if (!currentSection.value) {
    return []
  }
  
  return currentSection.value.fieldKeys
    .map((key) => {
      return configFieldsMeta[key]
    })
    .filter(Boolean)
})

watch(
  () => isOpen.value,
  (visible) => {
    if (visible) {
      for (const section of sections) {
        for (const key of section.fieldKeys) {
          fieldValues.value[key] = getConfigValue(key)
        }
      }
    }
  },
  { immediate: true },
)

watch(Escape, (pressed) => {
  if (pressed && isOpen.value) {
    close()
  }
})

defineExpose({
  open,
  close,
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

function handleUpdate(fieldKey: string, value: boolean | string) {
  fieldValues.value[fieldKey] = value
}

function resetDefaults() {
  for (const section of sections) {
    for (const key of section.fieldKeys) {
      const meta = configFieldsMeta[key]

      if (meta) {
        fieldValues.value[key] = meta.default ?? (meta.type === 'checkbox' ? false : '')
      }
    }
  }
}

function saveAndClose() {
  for (const [key, value] of Object.entries(fieldValues.value)) {
    setConfigValue(key, value)
  }

  // @ts-ignore
  if (typeof unsafeWindow !== 'undefined') {
    // @ts-ignore
    unsafeWindow.location.reload()
  } else {
    window.location.reload()
  }
}
</script>

<style lang="scss">
.v-config-popup {
  &__layout {
    height: 65vh;
    max-height: 560px;
  }

  &__menu {
    padding: 12px 0;

    :deep(.n-menu-item-content) {
      &::before {
        display: none !important;
      }
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
  }

  &__save-btn {
    background: linear-gradient(135deg, #42d392 0%, #328f65 100%);
    border: none;
    box-shadow: 0 4px 14px rgba(43, 148, 101, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(43, 148, 101, 0.4);
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
