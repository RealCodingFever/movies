/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./movie-chat/**/*.{js,jsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui CSS-variable tokens
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)"
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)"
        },
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)"
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)"
        },
        // Genie chat widget colors
        brand: {
          bg: "#0b0b0f",
          panel: "#14141b",
          border: "#23232d",
          accent: "#ea4c89",
          accentDark: "#c2346e",
          muted: "#8a8a94"
        }
      },
      boxShadow: {
        widget: "0 20px 60px -10px rgba(0,0,0,0.7)",
        genie: "0 0 30px -5px rgba(234,76,137,0.4)"
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        slideDown: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(16px) scale(0.97)" }
        },
        pulseDot: {
          "0%, 80%, 100%": { opacity: "0.2" },
          "40%": { opacity: "1" }
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        genieFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        }
      },
      animation: {
        slideUp: "slideUp 280ms cubic-bezier(0.16,1,0.3,1)",
        slideDown: "slideDown 400ms cubic-bezier(0.16,1,0.3,1) forwards",
        pulseDot: "pulseDot 1.2s ease-in-out infinite",
        fadeIn: "fadeIn 300ms ease-out forwards",
        shimmer: "shimmer 1.8s infinite",
        genieFloat: "genieFloat 3s ease-in-out infinite",
        "spin-slow": "spin 5s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

module.exports = config;
