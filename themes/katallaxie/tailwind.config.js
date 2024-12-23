module.exports = {
    content: [
      "./themes/**/layouts/**/*.html",
      "./content/**/layouts/**/*.md",
      "./layouts/**/*.html",
      "./content/**/*.md"
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/line-clamp')
    ]
}
