class SortUtils {
    static sortData({ data, key }) {
        function sortBy(a, b) {
            const aVal = key ? a[key] : a;
            const bVal = key ? b[key] : b;
            return aVal === bVal ? 0 : aVal > bVal ? 1 : -1;
        }
        return data.sort(sortBy);
    }
}

export default SortUtils;
