const themeDir = __dirname + '/';
const siteDir = __dirname + '/../../';

const purgecss = require('@fullhuman/postcss-purgecss').default({
    // see https://gohugo.io/hugo-pipes/postprocess/#css-purging-with-postcss
    content: [
        './hugo_stats.json',
        themeDir + '/hugo_stats.json',
        siteDir + '/hugo_stats.json',
    ],
    safelist : [ /type/, /dark/ ],
    defaultExtractor: (content) => {
        let els = JSON.parse(content).htmlElements;
        return els.tags.concat(els.classes, els.ids);
    }
})

module.exports = {
    plugins: [
        require('@tailwindcss/postcss'),
        // require('tailwindcss')(themeDir + 'tailwind.config.js'),
        require('autoprefixer')({ path: [themeDir] }),
       ...(process.env.HUGO_ENVIRONMENT === 'production' ? [purgecss] : [])
    ]
}
