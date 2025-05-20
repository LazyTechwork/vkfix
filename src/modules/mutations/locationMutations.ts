import {LocationState} from '../../classes/LocationState';
import {pageScanner} from '../pageScanner';
import {pvAddons} from '../pvAddons';
import {profileActions} from "../profileActions";
import {appActions} from "../appActions";

export function locationMutations() {
    LocationState.updateState();
    let cq = LocationState.getCurrentQuery();
    let pq = LocationState.getPreviousQuery();
    let cp = LocationState.getCurrentPath();
    let pp = LocationState.getPreviousPath();
    let cq = LocationState.currentQuery;
    let pq = LocationState.previousQuery;
    let cp = LocationState.currentPath;
    let pp = LocationState.previousPath;
    if (cq.get('sel') != pq.get('sel')) {
        pageScanner();
    }

    if (cq.get('z') != pq.get('z') || cp.startsWith('/photo') && cp !== pp) {
        pvAddons();
    }

    if (cp.startsWith('/app')) {
        appActions()
    }

    profileActions();
}
