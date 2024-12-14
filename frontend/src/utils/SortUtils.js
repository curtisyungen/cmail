class SortUtils {
    static sortData({ data, key, reverse, parseKeys }) {
        function keyParser(name) {
            return parseInt(name.split(" ")[1], 10);
        }

        function sortBy(a, b) {
            const dir = reverse ? -1 : 1;
            const aVal = key ? (parseKeys ? keyParser(a[key]) : a[key]) : a;
            const bVal = key ? (parseKeys ? keyParser(b[key]) : b[key]) : b;
            return aVal === bVal ? 0 : aVal > bVal ? dir : -dir;
        }
        return data.sort(sortBy);
    }
}

export default SortUtils;
