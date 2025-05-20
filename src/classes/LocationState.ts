import {VKLocation} from './VKLocation';
import {locationMutations} from '../modules/mutations/locationMutations';
import {isLog} from '../common/consts';
import {Logger} from "./Logger";
import {extractPath} from "../common/helpers/extractPath";

export class LocationState {
    static #previousQuery: URLSearchParams | null = null;
    static #previousHref: string | null = null;
    static #query: URLSearchParams | null = null;
    static #href: string | null = null;
    static #locUpdScanner: NodeJS.Timeout | null = null;

    static init() {
        this.updateState();
        LocationState.locationScanner(); // Инициализируем слежение за изменениями в URL
    }

    static changeState(href: string, newQuery: URLSearchParams) {
        this.#previousQuery = this.#query;
        this.#previousHref = this.#href;
        this.#query = newQuery;
        this.#href = href;
    }


    static updateState() {
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
                previousQuery: getParamsQuery(this.#previousQuery),
                query: getParamsQuery(this.#query),
            });
        }
    }

    static get currentQuery() {
        return this.#query;
    }

    static get previousQuery() {
        return this.#previousQuery;
    }

    static get currentPath() {
        return extractPath(this.#href);
    }

    static get previousPath() {
        return extractPath(this.#previousHref);
    }

    static locationScanner() {
        if (this.#locUpdScanner !== null) {
            clearInterval(this.#locUpdScanner);
        }

        this.#locUpdScanner = setInterval(() => {
            if (location.href !== this.#href) {
                locationMutations();
            }
        }, 100);
    }
}
