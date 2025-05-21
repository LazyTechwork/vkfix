import {LocationState} from '../../classes/LocationState';
import {pageScanner} from '../pageScanner';
import {pvAddons} from '../pvAddons';
import {profileActions} from "../profileActions";
import {appActions} from "../appActions";
import {messenger} from "../messenger/messenger";
import {Logger} from "../../classes/Logger";

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

    if (cq.get('z') != pq.get('z') || cp.startsWith('/photo') && cp !== pp) {
        pvAddons();
    }

    if (cp.startsWith('/app')) {
        appActions()
    }

    if (cp.startsWith('/im/convo/')) {
        Logger.info('execute messenger')
        messenger()
    }

    profileActions();
}
