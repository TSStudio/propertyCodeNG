const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const { EnvironmentPlugin } = require("webpack");
const fs = require("fs");

module.exports = {
    entry: "./src/main.js",
    module: {
        rules: [
            { test: /\.vue$/, use: "vue-loader" },
            { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        targets: "last 2 major versions, not dead, not <.5%",
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "imgs/[hash][ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[hash][ext]",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new VueLoaderPlugin(),
        require("unplugin-auto-import/webpack").default({
            resolvers: [ElementPlusResolver()],
        }),
        require("unplugin-vue-components/webpack").default({
            resolvers: [ElementPlusResolver()],
        }),
        new EnvironmentPlugin({
            API_ARG:
                process.env.NODE_ENV == "development"
                    ? "dev=VXCVCX"
                    : "dev=NODEV",
        }),
    ],
    devServer: {
        host: "local.tmysam.top",
        port: 8000,
        hot: true,
        client: {
            overlay: {
                runtimeErrors: (error) => {
                    const ignoreErrors = [
                        "ResizeObserver loop completed with undelivered notifications.",
                    ];
                    return !ignoreErrors.includes(error.message);
                },
            },
        },
        server: {
            type: "https",
            options: fs.existsSync("./cert/local.tmysam.top-key.pem")
                ? {
                      key: fs.readFileSync("./cert/local.tmysam.top-key.pem"),
                      cert: fs.readFileSync("./cert/local.tmysam.top.pem"),
                  }
                : {},
        },
    },
};
