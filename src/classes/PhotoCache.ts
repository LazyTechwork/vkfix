import {Logger} from "./Logger";
import {PhotoSticker} from "../modules/messenger/types";

const DB_NAME = 'vkfix_photo_cache';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

export class PhotoCache {
    private static instance: PhotoCache;
    private db: IDBDatabase | null = null;

    static getInstance(): PhotoCache {
        if (!PhotoCache.instance) {
            PhotoCache.instance = new PhotoCache();
        }
        return PhotoCache.instance;
    }

    async init(): Promise<void> {
        if (this.db) return;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                Logger.error('PhotoCache: Failed to open database');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, {keyPath: 'albumId'});
                }
            };
        });
    }

    async getPhotos(albumId: number): Promise<PhotoSticker[] | null> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(albumId);

            request.onsuccess = () => {
                resolve(request.result?.photos || null);
            };

            request.onerror = () => {
                Logger.error('PhotoCache: Failed to get photos');
                reject(request.error);
            };
        });
    }

    async setPhotos(albumId: number, photos: PhotoSticker[]): Promise<void> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({albumId, photos});

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                Logger.error('PhotoCache: Failed to set photos');
                reject(request.error);
            };
        });
    }

    async clear(): Promise<void> {
        await this.init();

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                Logger.error('PhotoCache: Failed to clear cache');
                reject(request.error);
            };
        });
    }
} 