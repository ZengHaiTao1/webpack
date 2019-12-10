var webpack = require("webpack");
var path = require("path");
let HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var DIST_PATH = path.resolve(__dirname, './dist');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV === 'production'

const PurifyCSSPlugin = require('purifycss-webpack');

const glob = require("glob")
const htmls = glob.sync("src/page?/page?.js")
const entrys = {}; //定义一个 entrys 动态添加入口文件
const htmlCfgs = []; //定义一个 htmlCfg 动态添加入口文件配置


//entrys["vendors"] = ["./src/lib/jquery-3.2.1.js"]

htmls.forEach(filePath => {    // "src/page1/page1.js"
    let path = filePath.trim().split('/'); //分割路径, ['src', 'page1', 'page1.js'], 放进 path 数组里
    let file = path.pop();   //'page1.js'
    let name = file.split(".")[0];  //page1
    entrys[name] = "./" + filePath
    htmlCfgs.push(
        new HtmlWebpackPlugin({
            template: "./src/" + name + "/" + name.trim() + ".html",  //  "./src/page1/page1.html"
            chunks: [name, 'commons',],
            filename: (name == "pagea" ? "index" : name) + ".html",
            inlineSource: '.(js|css)$',
            //inject: true, //默认值，script标签位于html文件的body底部  
            // minify: {
            //     removeComments: true,  // 移除注释
            //     collapseWhitespace: true,  // 折叠空白区域
            //     removeAttributeQuotes: true // 移除属性的引号
            // removeRedundantAttributes:true, // 删除多余的属性
            // collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
            // },
            chunksSortMode: 'dependency', //按照不同文件的依赖关系来排序，
        })
    )
});
// entrys["vendors"] = ["./src/lib/jquery-1.8.3.min.js", "vue"]


module.exports = {
    // devtool: "true",
    //mode: "development",
    // externals: {
    //     '$': "window.jQuery",
    // },
    // optimization: {
    //     splitChunks: {
    //         chunks: "all", // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
    //         cacheGroups: {
    //             //打包公共模块
    //             // vendors: { // 键值可以自定义
    //             //     //chunks: 'initial', // 
    //             //     minChunks: 1, // 代码块至少被引用的次数
    //             //     test: /[\\/]node_modules[\\/]/,
    //             //     name: "vendors", // 入口的entry的key
    //             //     // enforce: true   // 强制 
    //             //     // priority: -10   //抽取优先级
    //             //     priority: -10,    //会使第三方js先被抽离出来，而不是一起打包进公用部分
    //             // },
    //             // commons: {
    //             //     chunks: 'initial', //initial表示提取入口文件的公共部分
    //             //     minChunks: 2, //表示提取公共部分最少的文件数
    //             //     minSize: 0, //表示提取公共部分最小的大小
    //             //     name: 'commons', //提取出来的文件命名
    //             //     priority: 10
    //             // },
    //         }
    //     }
    // },
    // 入口JS路径
    // 指示Webpack应该使用哪个模块，来作为构建其内部依赖图的开始
    // entry: {
    //     main1: path.resolve(__dirname, "./src/page1/page1.js"),
    //     main2: path.resolve(__dirname, "./src/page2/page2.js"),
    // },
    entry: entrys,
    output: {
        // 编译输出的JS入路径 
        // 告诉Webpack在哪里输出它所创建的bundle，以及如何命名这些文件
        path: DIST_PATH,   // 创建的bundle生成到哪里  
        filename: 'js/[name].js', // 创建的bundle的名称
        publicPath: devMode ? './' : "",
    },
    // 模块解析 
    resolve: {
        alias: {
            // vue$: path.resolve(__dirname, "./src/lib/vue.js"),
            // vue: path.resolve(__dirname, "./src/lib/qqq.js"),
            // jquery: path.resolve(__dirname, "./src/lib/jquery-3.2.1.js"),
        },
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [ //配置加载器, 用来处理源文件, 可以把es6, jsx等转换成js, sass, less等转换成css
            // {
            //     test: path.resolve(__dirname, "./src/pagea/pagea.js"),
            //     exclude: /node_module/,
            //     use: [{
            //         loader: "imports-loader",
            //         options: {
            //             $: 'jquery',
            //             jquery: 'jquery'
            //         }
            //     }
            //     ]
            // },
            // {
            //     test: require.resolve(path.resolve(__dirname, "./src/lib/jquery-3.2.1.js")),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: 'jQuery'
            //     }, {
            //         loader: 'expose-loader',
            //         options: '$'
            //     }]
            // },

            // test: /\.(ts|js)x?$/,
            {
                test: /\.pug$/,
                loader: 'pug-html-loader',
            },
            {
                test: /\.ts|.tsx$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                ],
                use:
                {
                    // loader: 'ts-loader',
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: { loader: 'babel-loader' } // options 在 .babelrc 定义
            },
            {
                test: /\.(sa|sc|c)ss$/,  // 可以打包后缀为sass/scss/css的文件
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            // publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
                            // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
                            // publicPath: './',
                            publicPath: devMode ? './' : '../',   // 根据不同环境指定不同的publicPath
                            hmr: devMode, // 仅dev环境启用HMR功能
                        },
                    },
                    {
                        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                    }, {
                        loader: "sass-loader" // 将 Sass 编译成 CSS
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require('autoprefixer')//postcss-loader会叫autoprefixer插件添加浏览器前缀
                            ]
                        }
                    }
                ],
            },
            // {
            //     test: /\.css$/, //配置要处理的文件格式，一般使用正则表达式匹配
            //     use: [
            //         {
            //             loader: "style-loader"
            //         },
            //         {
            //             loader: "css-loader",
            //         }
            //     ]
            // },
            // {
            //     test: /\.scss$/,
            //     use: [{
            //         loader: "style-loader" // 将 JS 字符串生成为 style 节点
            //     }, {
            //         loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
            //     }, {
            //         loader: "sass-loader" // 将 Sass 编译成 CSS
            //     }]
            // },
            // {
            //     test: /\.(png|jpe?g|gif)$/i,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //         },
            //     ],
            // },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name].[ext]',
                        limit: 1024,
                    }
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'font',
                    }

                }
            },

        ]
    },
    // 插件 
    // plugins: [
    //     new CleanWebpackPlugin(),
    //     new MiniCssExtractPlugin({
    //         // 这里的配置和webpackOptions.output中的配置相似
    //         // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
    //         filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
    //         chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
    //     }),
    //     new HtmlWebpackPlugin({
    //         filename: __dirname + '/dist/page1/index.html',
    //         template: __dirname + "/src/page1/index.html",
    //         chunks: ['main1', "commons"],
    //         inlineSource: '.(js|css)$'
    //     }),
    //     new HtmlWebpackPlugin({
    //         filename: __dirname + '/dist/page2/index.html',
    //         template: __dirname + "/src/page2/index.html",
    //         chunks: ['main2', "commons"],
    //         inlineSource: '.(js|css)$'
    //     }),
    // ],

    // 为 webpack 运行时代码创建单独的chunk
    // runtimeChunk: {
    //     name: 'manifest'
    // },

    // resolve alias的作用是装 jquery的模块指向本地文件 ./src/lib/jquery.min.js
    plugins: [
        new MiniCssExtractPlugin({
            // 这里的配置和webpackOptions.output中的配置相似
            // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, './src/**/*.html')),
        }),
        // new webpack.ProvidePlugin({
        //     // $: 'jquery',
        //     // jQuery: 'jquery',
        //     // "window.$": 'jquery',
        //     // "window.jQuery": 'jquery',
        //     //  $: 'jquery',
        //     //Vue: 'vue'
        //     //   name: ["vendors"]
        // })
        new CleanWebpackPlugin(),
    ].concat(htmlCfgs),
    devtool: 'inline-source-map',
    // 开发服务器 
    devServer: {
        hot: true, // 热更新，无需手动刷新 
        host: '0.0.0.0', // host地址
        port: 8080, // 服务器端口 
        contentBase: DIST_PATH,//默认根路径
        historyApiFallback: true,// 该选项的作用所用404都连接到index.html 
        // proxy: {
        //     "/api": "http://localhost:3000" // 代理到后端的服务地址，会拦截所有以api开头的请求地址
        // }
    },
}