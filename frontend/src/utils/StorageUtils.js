class StorageUtils {
    static clearAll() {
        localStorage.clear();
    }

    static getItem(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error("Error getting item from storage: ", e);
        }
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }

    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error("Error setting item in storage: ", e);
            return false;
        }
    }
}

export default StorageUtils;
