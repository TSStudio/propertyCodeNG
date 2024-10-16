require.ensure(
    [],
    function () {
        var _require = require("vue"),
            createApp = _require.createApp;

        var App = require("./App.vue").default;
        require("./css/style.css");

        var app = createApp(App);
        app.mount("#app");
        setTimeout(() => {
            document.getElementById("overlay").classList.add("overlay-hidden");
        }, 300);
        setTimeout(() => {
            document.getElementById("overlay").remove();
        }, 1000);
    },
    "vue"
);
