import {switchLayout} from "../common/helpers/convertTextLayout"
import {GlobalConfig} from "../GlobalConfig"

function handleKeyDown(e: KeyboardEvent) {
  if (e.code !== "KeyQ" || !e.ctrlKey || e.key === 'Control') return

  const activeElement = document.activeElement as HTMLElement
  if (!activeElement) return

  // Проверяем, является ли элемент редактируемым
  const isEditable =
    activeElement.isContentEditable ||
    activeElement.tagName === "INPUT" ||
    activeElement.tagName === "TEXTAREA"

  if (!isEditable) return

  e.preventDefault()
  e.stopPropagation()

  if (window.getSelection()?.toString()) {
    // Если есть выделенный текст
    const selection = window.getSelection()
    if (!selection) return

    const range = selection.getRangeAt(0)
    const selectedText = selection.toString()
    const newText = switchLayout(selectedText)

    range.deleteContents()
    range.insertNode(document.createTextNode(newText))
  } else {
    // Если нет выделенного текста, меняем весь текст
    if (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA"
    ) {
      const input = activeElement as HTMLInputElement | HTMLTextAreaElement
      const cursorPosition = input.selectionStart
      input.value = switchLayout(input.value)

      // Восстанавливаем позицию курсора
      input.setSelectionRange(cursorPosition, cursorPosition)
    } else {
      const selection = window.getSelection()
      if (!selection) return

      const range = selection.getRangeAt(0)
      const cursorPosition = range.startOffset
      activeElement.textContent = switchLayout(activeElement.textContent)

      // Восстанавливаем позицию курсора
      const newRange = document.createRange()
      newRange.setStart(activeElement.firstChild || activeElement, Math.min(cursorPosition, activeElement.textContent.length))
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }
  }
}

export function initSwitchTextLayout() {
  const switchTextLayout = GlobalConfig.Config.get(
    "switchTextLayout"
  ) as boolean

  if (!switchTextLayout) return

  document.addEventListener("keydown", handleKeyDown, true)
}
