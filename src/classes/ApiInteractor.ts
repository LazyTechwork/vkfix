export default class APIInteractor {
    static req(method, url, data) {
        console.log({method, url, data})
        const xhr = new XMLHttpRequest();
        return new Promise(function build(resolve, reject) {
            xhr.open(method, url, true);
            xhr.onreadystatechange = function onResponse() {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    return reject('I/O Error');
                }
                resolve(xhr.responseText);
            };
            xhr.send(data);
        });
    }

    static callApiRaw(data: object, endpoint: string, skipHash: boolean = false) {
        console.log('Call API Raw', data, endpoint)

        if (skipHash) {
            const _data = new FormData();
            for (const key in data)
                if (data.hasOwnProperty(key)) _data.append(key, data[key])

            console.log('Sending request to API', {endpoint, _data})
            return this.req('POST', endpoint, _data).then(res => this.parseApiRaw(res));
        }

        return this.req('GET', 'https://' + location.host + '/dev/execute', {}).then(function parseHash(res: string) {
            const hash = res.match(/Dev\.methodRun\('([a-z0-9:]+)/im);

            if (!hash)
                console.error({
                    error: 'invalid hash',
                    error_description: res,
                });

            return hash[1];
        }).then(hash => {
            console.log('Got hash!', hash, data)
            const _data = new FormData();
            _data.append('hash', hash);
            for (const key in data)
                if (data.hasOwnProperty(key)) _data.append(key, data[key])

            console.log('Sending request to API', {endpoint, _data})
            return this.req('POST', endpoint, _data);
        }).then(res => this.parseApiRaw(res));
    }

    static parseApiRaw(res: any) {
        console.log('Got response!', res)
        try {
            res = JSON.parse(res.replace(/^.+?{/, '{'));
            if (res && res.payload && res.payload[1] && res.payload[1][0])
                res = JSON.parse(res.payload[1][0]);
        } catch (e) {
            console.error(e)
        }
        if (!res.response)
            throw res;

        return res;
    }

    static callApi(cParams: ICallApiParams) {
        const endpoint = 'https://' + location.host + '/dev';
        cParams.data = cParams.data || {};
        const isExecute = cParams.method == "execute";
        const _data = {
            act: 'a_run_method',
            al: '1',
            method: 'execute',
            param_code: isExecute ? cParams.params.code : 'return API.' + cParams.method + '(' + JSON.stringify(cParams.data) + ');',
            param_v: '5.120'
        }
        if (isExecute)
            Object.keys(cParams.data).forEach((name) => {
                _data['param_' + name] = cParams.data[name];
            });

        return APIInteractor.callApiRaw(_data, endpoint)
    }
}


export interface ICallApiParams {
    // если execute - params.code обязателен к заполнению
    method?: 'execute' | 'messages.removeChatUser' | string;
    data?: {
        [U: string]: string;
    };
    params?: {
        code?: string;
        [U: string]: string;
    };
}
