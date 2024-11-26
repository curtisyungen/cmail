class StorageUtils {
    static getItem(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }

    static setItem(key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }
}

export default StorageUtils;
