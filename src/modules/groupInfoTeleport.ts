import {GlobalConfig} from '../GlobalConfig';
import {Logger} from '../classes/Logger';
import {querySelectorWithTimeout} from '../common/helpers/querySelectorWithTimeout';


/**
 * Модуль для телепортации модального окна "Подробная информация" группы
 */
export async function initGroupInfoTeleport() {
  if (!GlobalConfig.Config.get('groupInfoTeleport')) {
    return;
  }


  injectSpinnerHidingStyles();

  Logger.log('Проверка телепортации информации о группе');

  // Проверяем, не была ли уже обработана эта страница
  const existingTeleported = document.querySelector('.vkfix-teleported-group-info');
  if (existingTeleported) {
    Logger.log('Информация уже телепортирована на этой странице');
    return;
  }

  // Ждём появления кнопки "Подробная информация"
  const button = await querySelectorWithTimeout<HTMLElement>({
    selectors: '[data-testid="open_full_info_modal"]',
    timeout: 3000
  });

  if (button) {
    Logger.log('Найдена кнопка "Подробная информация", начинаем обработку');
    await setupButtonHandler(button);
  }
}

let spinnerStyleInjected = false;

// Инжектим стили для скрытия спиннера один раз
function injectSpinnerHidingStyles() {
  if (spinnerStyleInjected) {
    return;
  }

  spinnerStyleInjected = true;

  const style = document.createElement('style');
  style.id = 'vkfix-group-info-spinner-hide';
  style.textContent = `
        .vkuiPopoutWrapper__host.vkuiPopoutWrapper__opened:has(.vkuiScreenSpinner__host) {
            display: none !important;
        }
    `;
  document.head.appendChild(style);
  Logger.log('Стили для скрытия спиннера инжектированы');
}

async function setupButtonHandler(button: HTMLElement) {
  Logger.log('Найдена кнопка "Подробная информация", автоматически нажимаем');

  // Автоматически нажимаем кнопку
  button.click();

  // Ждём появления модального окна
  const modal = await querySelectorWithTimeout<HTMLElement>({
    selectors: '[data-testid="community-info-modal"]',
    timeout: 0,
  });

  if (modal) {
    Logger.log('Модальное окно найдено, начинаем телепортацию');
    await teleportModalContent(modal, button);
  } else {
    Logger.log('Модальное окно не найдено за отведённое время');
  }
}

async function teleportModalContent(modal: HTMLElement, button: HTMLElement) {
  try {
    // Находим контейнер с содержимым модального окна
    const modalBody = await querySelectorWithTimeout<HTMLElement>({
      selectors: '.vkitModalBody__container--ffWDJ',
      element: modal,
      timeout: 2000
    });

    if (!modalBody) {
      Logger.log('Не найдено тело модального окна');
      return;
    }

    // Создаём контейнер для телепортированного содержимого
    const teleportedContainer = document.createElement('div');
    teleportedContainer.className = 'vkfix-teleported-group-info';
    teleportedContainer.style.cssText = `
            margin: 0;
            padding: 0;
            background: var(--vkui--color_background_content);
            border-radius: 8px;
            box-shadow: 0 0 0 0.5px var(--vkui--color_separator_primary);
        `;

    // Клонируем содержимое модального окна
    const clonedContent = modalBody.cloneNode(true) as HTMLElement;
    teleportedContainer.appendChild(clonedContent);

    // Находим блок с кнопкой "Подробная информация"
    const moreInfoBlock = await querySelectorWithTimeout<HTMLElement>({
      selectors: '[data-testid="group-info-more-info"]',
      timeout: 2000
    });

    // Заменяем блок с кнопкой на телепортированное содержимое
    if (moreInfoBlock && moreInfoBlock.parentElement) {
      // Удаляем padding и border у родителя
      const parent = moreInfoBlock.parentElement;
      parent.style.padding = '0';
      parent.style.borderRadius = '8px';

      parent.replaceChild(teleportedContainer, moreInfoBlock);
      Logger.log('Блок "Подробная информация" заменён на содержимое');

      // Удаляем spacing элемент перед нашим контейнером
      const spacingBefore = teleportedContainer.previousElementSibling as HTMLElement;
      if (spacingBefore &&
        spacingBefore.className.includes('vkitSpacing__root') &&
        spacingBefore.style.getPropertyValue('--vkit_internal--spacing_gap_size')) {
        spacingBefore.remove();
        Logger.log('Spacing элемент удалён');
      }
    } else {
      // Если блок не найден, вставляем после кнопки
      button.parentElement?.insertBefore(teleportedContainer, button.nextSibling);
      Logger.log('Содержимое вставлено после кнопки');
    }

    Logger.log('Содержимое телепортировано');

    // Закрываем модальное окно
    const closeButton = await querySelectorWithTimeout<HTMLElement>({
      selectors: '[data-testid="modal-close-button"]',
      element: modal,
      timeout: 1000
    });

    if (closeButton) {
      closeButton.click();
      Logger.log('Модальное окно закрыто');
    } else {
      // Если кнопка закрытия не найдена, пробуем удалить модалку напрямую
      const modalContainer = modal.closest('[role="dialog"]')?.parentElement;
      if (modalContainer) {
        modalContainer.remove();
        Logger.log('Модальное окно удалено напрямую');
      }
    }

    // Не добавляем кнопку "Скрыть", так как содержимое статично заменяет блок

  } catch (error) {
    Logger.log('Ошибка при телепортации:', error);
  }
}
