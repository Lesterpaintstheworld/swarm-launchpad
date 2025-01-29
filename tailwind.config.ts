import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsla(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsla(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsla(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsla(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent-1))',
				'2': 'hsl(var(--accent-2))',
				'3': 'hsl(var(--accent-3))',
  			},
			success: {
				DEFAULT: 'hsl(var(--success))',
			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 4px)',
  			sm: 'calc(var(--radius) - 8px)',
  		},
		animation: {
			'spin-slow': 'spin 120s linear infinite',
			'fade-in-grow': 'fade-in-grow 0.5s ease-in-out forwards',
			'flash': 'flash 4s ease-out infinite',
			'moveLight': 'moveLight 3s linear infinite'
		},
		keyframes: {
			'fade-in-grow': {
				'0%': { scale: '0.7', },
				'100%': { scale: '1', }
			},
			moveLight: {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(500%)' }
			},
			flash: {
				'0%': { 
					opacity: '0',
					transform: 'scale(1)'
				},
				'1%': { 
					opacity: '0.8',
					transform: 'scale(1.2)'
				},
				'2%': { 
					opacity: '0',
					transform: 'scale(1.4)'
				},
				'100%': { 
					opacity: '0',
					transform: 'scale(1)'
				}
			}
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
