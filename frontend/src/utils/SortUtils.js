class SortUtils {
    static sortData({ data, key, reverse }) {
        function sortBy(a, b) {
            const dir = reverse ? -1 : 1;
            const aVal = key ? a[key] : a;
            const bVal = key ? b[key] : b;
            return aVal === bVal ? 0 : aVal > bVal ? dir : -dir;
        }
        return data.sort(sortBy);
    }
}

export default SortUtils;
