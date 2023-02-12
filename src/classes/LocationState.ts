import VKLocation from './VKLocation';
import location_mutations from '../modules/mutations/location_mutations';
import {lastOrDefault} from '../common/helpers/lastOrDefault';
import {isLog} from '../common/consts';
import {Logger} from "./Logger";

export default class LocationState {
    private static previousQuery: URLSearchParams | null = null;
    private static previousHref: string | null = null;
    private static query: URLSearchParams | null = null;
    private static href: string | null = null;

    private static locUpdScanner: NodeJS.Timer | null = null;

    public static init() {
        this.updateState();
        LocationState.locationScanner(); // Инициализируем слежение за изменениями в URL
    }

    public static changeState(href: string, newQuery: URLSearchParams) {
        this.previousQuery = this.query;
        this.previousHref = this.href;
        this.query = newQuery;
        this.href = href;
    }


    public static updateState() {
        this.changeState(location.href, VKLocation.getQueryParams());

        const getParamsQuery = (p: URLSearchParams | null) => {
            if (!p) {
                return null;
            }
            return {
                sel: p.get('sel'),
                z: p.get('z'),
            };
        };

        if (isLog) {
            Logger.warn('Updated location', {
                previousQuery: getParamsQuery(this.previousQuery),
                query: getParamsQuery(this.query),
            });
        }
    }

    public static getCurrentQuery() {
        return this.query;
    }

    public static getPreviousQuery() {
        return this.previousQuery;
    }

    public static getCurrentPath() {
        return '/' + lastOrDefault(this.href.split('/')) ?? '';
    }

    public static getPreviousPath() {
        return '/' + lastOrDefault(this.previousHref.split('/')) ?? '';
    }

    public static locationScanner() {
        if (this.locUpdScanner !== null) {
            clearInterval(this.locUpdScanner);
        }

        this.locUpdScanner = setInterval(() => {
            if (location.href !== this.href) {
                location_mutations();
            }
        }, 100);
    }
}
