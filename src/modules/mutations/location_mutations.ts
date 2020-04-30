import LocationState from "../../classes/LocationState";
import page_scanner from "../page_scanner";

export default function (ev: any) {
    LocationState.updateState()
    let cq = LocationState.getCurrentQuery()
    let pq = LocationState.getPreviousQuery()
    if (cq.get("sel") != pq.get("sel")) {
        page_scanner()
    }
}