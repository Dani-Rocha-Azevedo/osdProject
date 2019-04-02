
module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ["mocha", "chai", "sinon"],
        
        exclude: [],
        files: [
            { pattern: "src/test/index.js" }
        ],
        preprocessors: {
            "src/test/index.js": ["webpack"],
        },
        reporters: ['progress'],

        // karmaTypescriptConfig: {
        //     compilerOptions: {
        //       "target": "es5",
        //       module: "commonjs",
        //       "moduleResolution": "node",
        //       "experimentalDecorators": true,
        //       //
        //       "emitDecoratorMetadata": true,
        //       /* Strict Type-Checking Options */
        //      // "strict": true,                           /* Enable all strict type-checking options. */
        //       "strictNullChecks": true,
        //       "noImplicitThis": true,
        //       // "noImplicitAny": true,
        //       "allowSyntheticDefaultImports": true,
        //       "lib": ["es2017", "es6", "es5", "dom"],
        //       "sourceMap": true,
        //       "outDir": "./dist",
        //       "baseUrl": "./",
        //       allowJs: true,
        //     },
        //   },
        //autoWatch: true,
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
                }
              ]
            },
            node: {
              fs: 'empty'
            }
        },
       
        browsers: ["Chrome"],
    
          

    });
};