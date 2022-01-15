import axios from "axios";

function formatDate(value, options) {
    const date = new Date(value);
    return date.toLocaleString(undefined, options);
}

function getPagedResults(url, data) {
    return axios.get(url).then((response) => {
        const allData = [...data, ...response.data.results];
        const nextPage = response.data.next;
        if (nextPage) {
            return getPagedResults(nextPage, allData);
        }
        return allData;
    });
}

function omit(obj, omitKeys) {
    if (obj === undefined) {
        return {};
    }
    return Object.keys(obj).reduce((result, key) => {
        if (!omitKeys.includes(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

export { formatDate, getPagedResults, omit };
