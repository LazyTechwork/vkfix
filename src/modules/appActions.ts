import {Logger} from "../classes/Logger";
import {GlobalConfig} from "../GlobalConfig";
import {querySelectorWithTimeout} from "../common/helpers/querySelectorWithTimeout";
import {APIInteractor} from "../classes/ApiInteractor";
import {saveTemplateAsFile} from "../common/helpers/saveTemplateAsFile";


const exportCommunityKeeperBtn = 'exportCommunityKeeperBtn'

export async function appActions() {
    const isNewsBtn = GlobalConfig.Config.get('exportCommunityKeeperBtn') as boolean;
    if (!isNewsBtn || !window.location.href.includes('vk.com/app51658481') || document.getElementById(exportCommunityKeeperBtn)) {
        return;
    }

    const grCodeBtn = await querySelectorWithTimeout({
        selectors: "#qr_code_btn"
    });
    if (!grCodeBtn) {
        Logger.warn('not found #qr_code_btn')
        return;
    }

    const btn = document.createElement('button')
    btn.textContent = 'Создать бэкап из всех сообществ'
    btn.style.setProperty('color', 'var(--vkui--color_text_link)')
    btn.style.setProperty('background-color', 'transparent')
    btn.style.setProperty('border', 'none')
    btn.style.setProperty('cursor', 'pointer')
    btn.style.setProperty('margin-right', '10px')

    btn.addEventListener('click', async () => {
        const ids: number[] = []
        while (true) {
            const list = await APIInteractor.callApi({
                'method': 'groups.get',
                data: {
                    count: '1000',
                    offset: `${ids.length}`
                }
            })
            if (list.response.items.length === 0) {
                break
            }

            ids.push(...list.response.items)
        }

        const name = unsafeWindow.prompt('Введите название папки', 'Сообщества')
        const groupIdsDictByFolderName = {
            [name]: ids
        }
        const backup = {
            groupIdsDictByFolderName,
        }
        saveTemplateAsFile('backup.json', backup)
    })

    btn.id = exportCommunityKeeperBtn;
    btn.style.marginLeft = '6px';
    grCodeBtn.parentElement.prepend(btn);
}
