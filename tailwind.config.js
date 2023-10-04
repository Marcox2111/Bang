/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,tsx}"],
    theme: {
        borderWidth: {
            DEFAULT: '1px',
            '0': '0',
            '2': '2px',
            '3': '3px',
            '4': '4px',
            '6': '6px',
            '8': '8px',
            '14': '14px',
        },
        extend: {
            gridTemplateColumns: {
                sidebar: "300px auto", //for sidebar layout
                "sidebar-collapsed": "64px auto", //for collapsed sidebar layout
            },
        },
    },
    plugins: [],
}
