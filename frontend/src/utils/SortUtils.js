class SortUtils {
    static sortData({ data = [] }) {
        function sortBy(a, b) {
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return data.sort(sortBy);
    }
}

export default SortUtils;
