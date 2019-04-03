const path = require('path')

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ["mocha"],
        
        exclude: [],
        files: [
            { pattern: "src/test/index.js" }
        ],
        preprocessors: {
            "src/test/index.js": ["webpack"],
        },
        reporters: ['progress','coverage-istanbul'],
        

  
        autoWatch: true,
        webpack : {
            entry: "./src/test/index.js",
            resolve: {
              extensions: [ '.tsx', '.ts', '.js', '.html' ]
            },
            module: {
              rules: [
                {
                  test: /\.tsx?$/,
                  use: 'ts-loader',
                  exclude: /node_modules/
                },
                {
                  test: /\.mp4$/,
                  loader: 'url-limit=10000&mimetype=video/mp4'
                },
                {
                  test: /\.([jt])s$/,
                  enforce: 'post',
                  exclude: /(node_modules)/,
                  use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: {esModules: true}
                  }
                }
              ]
            },
            node: {
              fs: 'empty'
            }
        },
        coverageIstanbulReporter: {
          reports: [ 'html', 'text-summary' ],
          dir: path.join(__dirname, 'coverage'),
          fixWebpackSourcePaths: true,
          'report-config': {
            html: { outdir: 'html' }
          }
        },
       
        browsers: ["Chrome"],
    
          

    });
};