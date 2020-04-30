import VKLocation from "./VKLocation";
import location_mutations from "../modules/mutations/location_mutations";

export default class LocationState {
    private static previousQuery: URLSearchParams | null = null
    private static previousHref: string | null = null
    private static query: URLSearchParams | null = null
    private static href: string | null = null

    private static locUpdScanner: number | null = null

    public static changeState(href: string, newQuery: URLSearchParams) {
        this.previousQuery = this.query
        this.previousHref = this.href
        this.query = newQuery
        this.href = href
    }

    public static updateState() {
        this.changeState(location.href, VKLocation.getQueryParams())
        console.log("Updated location", {
            previousQuery: this.previousQuery ? this.previousQuery.get("sel") : null,
            query: this.query ? this.query.get("sel") : null
        })
    }

    public static getCurrentQuery() {
        return this.query
    }

    public static getPreviousQuery() {
        return this.previousQuery
    }

    public static locationScanner() {
        if (this.locUpdScanner !== null) clearInterval(this.locUpdScanner)
        this.locUpdScanner = setInterval(() => {
            if (location.href !== this.href)
                location_mutations()
        }, 875)
    }
}