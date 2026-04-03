import {LocationState} from '../../classes/LocationState';
import {pageScanner} from '../pageScanner';
import {pvAddons} from '../pvAddons';

import {appActions} from "../appActions";
import {messenger} from "../messenger/messenger";
import {Logger} from "../../classes/Logger";
import {initGroupInfoTeleport} from "../groupInfoTeleport";

export function locationMutations() {
    LocationState.updateState();
    let cq = LocationState.currentQuery;
    let pq = LocationState.previousQuery;
    let cp = LocationState.currentPath;
    let pp = LocationState.previousPath;

    Logger.info('execute messenger', cp, cq)
    if (cq.get('sel') != pq.get('sel')) {
        pageScanner();
    }

    // Вызываем pvAddons если:
    // 1. Изменился параметр z (открыли/закрыли/переключили фото в модалке)
    // 2. Перешли на страницу /photo-... (прямая ссылка на фото в альбоме)
    const isZChanged = cq.get('z') != pq.get('z');
    const isPhotoPage = cp.startsWith('/photo');
    const isPathChanged = cp !== pp;
    
    if (isZChanged || (isPhotoPage && isPathChanged)) {
        pvAddons();
    }

    if (cp.startsWith('/app')) {
        appActions()
    }

    if (cp.startsWith('/im/convo/')) {
        Logger.info('execute messenger')
        messenger()
    }


    initGroupInfoTeleport();
}
