export const dbName = 'TaskDB';
export const taskStoreName = 'tasks';
export const categoryStoreName = 'category';

let db: IDBDatabase | null = null;

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 2);

        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB'));
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;

            if (!db.objectStoreNames.contains(taskStoreName)) {
                db.createObjectStore(taskStoreName, { keyPath: 'task_id' });
            }
            if (!db.objectStoreNames.contains(categoryStoreName)) {
                db.createObjectStore(categoryStoreName, { keyPath: 'category_id' });
            }
        };
    });
};

export const getStore = (storeName: string): IDBObjectStore => {
    if (!db) throw new Error('Database not opened');
    return db.transaction(storeName, 'readwrite').objectStore(storeName);
};

export const getDBStore = async (storeName: string): Promise<IDBObjectStore> => {
    await openDB();
    return getStore(storeName);
};
