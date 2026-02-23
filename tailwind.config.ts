import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            },
            colors: {
              primary: '#1D4ED8', /* Darker blue (blue-700) for better contrast */
              primaryDark: '#1E3A8A', /* blue-900 */
              secondary: '#475569', /* slate-600 */
              success: '#059669', /* emerald-600 */
              error: '#DC2626', /* red-600 */
              surface: '#FFFFFF',
              background: '#F1F5F9', /* slate-100 */
              textMain: '#020617', /* slate-950 - Almost black */
              textMuted: '#64748B', /* slate-500 */
            }
          }
        }
  },
  plugins: [
    // This plugin enables the 'no-scrollbar' class used in your main wrapper
    function ({ addUtilities }: any) {
      addUtilities({
        '.no-scrollbar': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}

export default config