import LocationState from '../../classes/LocationState';
import page_scanner from '../page_scanner';
import pv_addons from '../pv_addons';
import profile_actions from "../profile_actions";
import app_actions from "../app_actions";

export default function () {
    LocationState.updateState();
    let cq = LocationState.getCurrentQuery();
    let pq = LocationState.getPreviousQuery();
    let cp = LocationState.getCurrentPath();
    let pp = LocationState.getPreviousPath();
    if (cq.get('sel') != pq.get('sel')) {
        page_scanner();
    }

    if (cq.get('z') != pq.get('z') || cp.startsWith('/photo') && cp !== pp) {
        pv_addons();
    }

    if (cp.startsWith('/app')) {
        app_actions()
    }

    profile_actions();
}
