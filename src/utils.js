function formatDate(value, locale = "pl-PL", options) {
    const date = new Date(value);
    return date.toLocaleString(locale, options);
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

export { formatDate, omit };
