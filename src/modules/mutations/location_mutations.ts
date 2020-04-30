import LocationState from "../../classes/LocationState";

export default function (ev: any) {
    LocationState.updateQuery()
    let cq = LocationState.getCurrentQuery()
    let pq = LocationState.getPreviousQuery()
    if (cq.get("sel") != pq.get("sel")) {

    }
}