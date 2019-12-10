// babel.config.js

module.exports = function (api) {
    api.cache(true)

    const presets = [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage"
            }
        ],
        [
            '@babel/preset-typescript',
            {
                allExtensions: true,        // 🔴支持所有文件扩展名
            },
        ],

    ]
    const plugins = [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 2
            },
            "transform-typescript"
        ]
    ]

    return {
        presets,
        plugins
    }
}