module.exports = {
    css: {
        loaderOptions: {
            sass: {
                // TODO : might be better to only include main.scss in App component
                // (see 'Caveats': https://vueschool.io/articles/vuejs-tutorials/globally-load-sass-into-your-vue-js-applications/)
                data: `@import "@/scss/main.scss";`
            }
        }
    }
};
