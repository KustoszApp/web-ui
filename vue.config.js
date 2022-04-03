module.exports = {
    publicPath: "./",
    filenameHashing: false,
    css: {
        loaderOptions: {
            scss: {
                additionalData: "@import '~@/scss/variables.scss';"
            }
        }
    }
}
