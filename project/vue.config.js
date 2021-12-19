module.exports = {
    devServer: {
      port: 8001,
      proxy: {
        "^/api/": {
          target: "http://192.168.11.50:8080"
        }
      }
    }
  };
