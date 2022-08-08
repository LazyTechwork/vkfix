import LocationState from '../../classes/LocationState';
import page_scanner from '../page_scanner';
import pv_addons from '../pv_addons';

export default function () {
  LocationState.updateState();
  let cq = LocationState.getCurrentQuery();
  let pq = LocationState.getPreviousQuery();
  if (cq.get('sel') != pq.get('sel')) {
    page_scanner();
  }

  if (cq.get('z') != pq.get('z')) {
    pv_addons();
  }
}
