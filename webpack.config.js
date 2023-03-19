// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx", // Changed the entry file name

  output: {
    path: path.resolve(__dirname, "./dist/"),
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "./dist/"),
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/, // add |ts
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components/"),
      features: path.resolve(__dirname, "./src/features/"),
      stores: path.resolve(__dirname, "./src/stores/"),
      models: path.resolve(__dirname, "./src/models/"),
      layouts: path.resolve(__dirname, "./src/layouts/"),
      actions: path.resolve(__dirname, "./src/actions/"),
      api: path.resolve(__dirname, "./src/api/"),
      reducers: path.resolve(__dirname, "./src/reducers/"),
      store: path.resolve(__dirname, "./src/store/"),
      utils: path.resolve(__dirname, "./src/utils/"),
      constants: path.resolve(__dirname, "./src/constants/"),
      services: path.resolve(__dirname, "./src/services/"),
      hooks: path.resolve(__dirname, "./src/hooks/"),
      assets: path.resolve(__dirname, "./src/assets/"),
      mocks: path.resolve(__dirname, "./src/mocks/"),
      db: path.resolve(__dirname, "./src/db/"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"], // add .tsx, .ts
  },
};
