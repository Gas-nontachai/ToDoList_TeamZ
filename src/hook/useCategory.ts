import { getDBStore } from '@/utils/connect';
import { Category } from '@/misc/types';
const prefix = 'category'

const getCategoryBy = async (filter: Partial<Category> = {}): Promise<{ docs: Category[], totalDocs: number }> => {
    const store = await getDBStore(prefix);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (!request.result) {
                resolve({ docs: [], totalDocs: 0 });
                return;
            }

            const categorys: Category[] = request.result.filter((category: Category) =>
                Object.entries(filter).every(([key, value]) => category[key as keyof Category] === value)
            );

            resolve({ docs: categorys, totalDocs: categorys.length });
        };

        request.onerror = (event) => {
            console.error("IndexedDB Error:", event);
            reject(new Error(`Error fetching categorys: ${(event.currentTarget as IDBRequest).error}`));
        };
    });
};

const getCategoryByID = async (data: { category_id: string }): Promise<Category> => {
    const store = await getDBStore(prefix);
    const request = store.get(data.category_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                reject(new Error('Category not found'));
            }
        };

        request.onerror = (event) => {
            reject(new Error(`Error fetching category by ID: ${(event.target as IDBRequest).error}`));
        };
    });
};

const insertCategory = async (data: Category): Promise<Category> => {
    const store = await getDBStore(prefix);
    const request = store.add(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error inserting category: ${(event.target as IDBRequest).error}`));
        };
    });
};

const updateCategoryBy = async (data: Category): Promise<Category> => {
    const store = await getDBStore(prefix);
    const request = store.put(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error updating category: ${(event.target as IDBRequest).error}`));
        };
    });
};

const deleteCategoryBy = async (data: { category_id: string }): Promise<void> => {
    const store = await getDBStore(prefix);
    const request = store.delete(data.category_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(new Error(`Error deleting category: ${(event.target as IDBRequest).error}`));
        };
    });
};

export default function useCategory() {
    return {
        getCategoryBy,
        getCategoryByID,
        insertCategory,
        updateCategoryBy,
        deleteCategoryBy
    };
}
