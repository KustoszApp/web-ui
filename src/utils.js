import axios from "axios";

function calculateReferenceDate(daysAgo, sliceNum = -5) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, sliceNum);
}

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

export { calculateReferenceDate, formatDate, getPagedResults, omit };
