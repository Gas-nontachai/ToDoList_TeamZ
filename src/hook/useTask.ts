import { getDBStore } from '@/utils/connect';
import { Task } from '@/misc/types';
const prefix = 'tasks'

const getTaskBy = async (filter: Partial<Task> = {}): Promise<{ docs: Task[], totalDocs: number }> => {
    const store = await getDBStore(prefix);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (!request.result) {
                resolve({ docs: [], totalDocs: 0 });
                return;
            }

            const tasks: Task[] = request.result.filter((task: Task) =>
                Object.entries(filter).every(([key, value]) => task[key as keyof Task] === value)
            );

            resolve({ docs: tasks, totalDocs: tasks.length });
        };

        request.onerror = (event) => {
            console.error("IndexedDB Error:", event);
            reject(new Error(`Error fetching tasks: ${(event.currentTarget as IDBRequest).error}`));
        };
    });
};

const getTaskByID = async (data: { task_id: string }): Promise<Task> => {
    const store = await getDBStore(prefix);
    const request = store.get(data.task_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                reject(new Error('Task not found'));
            }
        };

        request.onerror = (event) => {
            reject(new Error(`Error fetching task by ID: ${(event.target as IDBRequest).error}`));
        };
    });
};

const insertTask = async (data: Task): Promise<Task> => {
    const store = await getDBStore(prefix);
    const request = store.add(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error inserting task: ${(event.target as IDBRequest).error}`));
        };
    });
};

const updateTaskBy = async (data: Task): Promise<Task> => {
    const store = await getDBStore(prefix);
    const request = store.put(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error updating task: ${(event.target as IDBRequest).error}`));
        };
    });
};

const deleteTaskBy = async (data: { task_id: string }): Promise<void> => {
    const store = await getDBStore(prefix);
    const request = store.delete(data.task_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(new Error(`Error deleting task: ${(event.target as IDBRequest).error}`));
        };
    });
};

export default function useTask() {
    return {
        getTaskBy,
        getTaskByID,
        insertTask,
        updateTaskBy,
        deleteTaskBy
    };
}
