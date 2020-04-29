export default class LocationState {
    private static previousQuery: URLSearchParams | null = null
    private static query: URLSearchParams | null = null

    public static changeQuery(newQuery: URLSearchParams) {
        this.previousQuery = this.query
        this.query = newQuery
    }

    public static getCurrentQuery() {
        return this.query
    }

    public static getPreviousQuery() {
        return this.previousQuery
    }
}