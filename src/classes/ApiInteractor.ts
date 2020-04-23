export default class APIInteractor {
    static req(method, url, data) {
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

    static callApi(method, data) {
        const isExecute = method === 'execute';
        const endpoint = 'https://' + location.host + '/dev';
        data = data || {};

        return APIInteractor.req('GET', endpoint + '/execute', {}).then(function parseHash(res: string) {
            const hash = res.match(/Dev\.methodRun\('([a-z0-9:]+)/im);

            if (!hash)
                console.error({
                    error: 'invalid hash',
                    error_description: res,
                });

            return hash[1];
        }).then(function sendRequest(hash) {
            const _data = new FormData();

            _data.append('act', 'a_run_method');
            _data.append('al', '1');
            _data.append('hash', hash);
            _data.append('method', 'execute');
            _data.append('param_code', isExecute ? data.code : 'return API.' + method + '(' + JSON.stringify(data) + ');');
            _data.append('param_v', '5.103');

            if (isExecute)
                Object.keys(data).forEach(function addData(name) {
                    _data.append('param_' + name, data[name]);
                });

            return APIInteractor.req('POST', endpoint, _data);
        }).then(function parseResponse(res: any) {
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
        });
    }
}
