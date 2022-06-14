import axios from "axios";

function repeatAsyncRequestWhileInProgress(response) {
    const asyncTasksUrls = ["autodetect_add"];
    const currentUrl = response.config.url;
    if (!asyncTasksUrls.includes(currentUrl)) {
        return response;
    }

    // async task result must include state.
    // there must have been some mistake here
    if (!("state" in response.data)) {
        return response;
    }

    // background task finished
    if (response.data.state !== "in_progress") {
        return response;
    }

    let retryCount = 0;
    if ("_retryCount" in response.config) {
        retryCount = response.config._retryCount;
    }
    retryCount += 1;
    response.config._retryCount = retryCount;

    const delay = Math.min(retryCount, 5) * 1000;

    return new Promise((resolve) =>
        setTimeout(() => resolve(axios(response.config)), delay)
    );
}

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

export {
    repeatAsyncRequestWhileInProgress,
    calculateReferenceDate,
    formatDate,
    getPagedResults,
    omit,
};
