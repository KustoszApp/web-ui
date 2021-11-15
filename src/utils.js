function formatDate(value, locale = "pl-PL", options) {
    const date = new Date(value);
    return date.toLocaleString(locale, options);
}

export { formatDate };
