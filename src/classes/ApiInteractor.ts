import {Logger} from "./Logger";
import {sleep} from "../common/helpers/sleep";

export class APIInteractor {
    static async callApiRaw(endpoint: string, data: BodyInit) {
        Logger.log('Call API Raw', data, endpoint)
        const response = await fetch(endpoint, {
            method: 'POST',
            body: data,
            credentials: "same-origin"
        })
        const result = await response.json()
        Logger.log('Call API Raw result', result)
        if (result.error?.error_code === 6) {
            await sleep(3000)
            return APIInteractor.callApiRaw(endpoint, data)
        }

        return result
    }

    static callApi(cParams: ICallApiParams) {
        // Пример доступа к window страницы
        const pageWindow = unsafeWindow;
        const endpoint = `https://api.vk.com/method/${cParams.method}?v=5.251&client_id=6287487`
        const token = JSON.parse(pageWindow.localStorage.getItem('6287487:web_token:login:auth')).access_token
        const form = new FormData()
        form.set('access_token', token)

        if (cParams.data) {
            const keys = Object.keys(cParams.data)

            for (const key of keys) {
                if (cParams.data[key] === undefined) continue

                form.set(key, cParams.data[key].toString())
            }
        }

        return APIInteractor.callApiRaw(endpoint, form)
    }
}


export interface ICallApiParams {
    method?: 'execute' | 'messages.removeChatUser' | 'utils.resolveScreenName' | 'newsfeed.getLists' | 'groups.get' | 'photos.getAlbums' | string;
    data?: {
        [U: string]: string | number;
    };
}
