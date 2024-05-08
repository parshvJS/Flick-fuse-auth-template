import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Border, input, ring, and other base colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(210, 36%, 96%)", // Light blue background
          dark: "hsl(220, 20%, 20%)",  // Dark background
        },
        foreground: {
          DEFAULT: "hsl(220, 15%, 20%)", // Dark blue foreground
          light: "hsl(210, 36%, 96%)",  // Light foreground for dark mode
        },
        primary: {
          DEFAULT: "hsl(220, 90%, 56%)", // Bright blue
          foreground: "hsl(220, 100%, 98%)",  // Light text on blue background
        },
        secondary: {
          DEFAULT: "hsl(200, 85%, 65%)", // Light blue
          foreground: "hsl(210, 100%, 98%)", // Light text for secondary elements
        },
        destructive: {
          DEFAULT: "hsl(360, 80%, 60%)", // Red (if needed)
          foreground: "hsl(360, 100%, 98%)", // Light text for red background
        },
        muted: {
          DEFAULT: "hsl(210, 36%, 85%)", // Muted light blue
          foreground: "hsl(210, 10%, 50%)", // Dark muted foreground
        },
        accent: {
          DEFAULT: "hsl(220, 90%, 56%)",  // Accent similar to primary
          foreground: "hsl(210, 100%, 98%)", // Light accent foreground
        },
        popover: {
          DEFAULT: "hsl(220, 15%, 20%)", // Popover color
          foreground: "hsl(210, 36%, 96%)", // Foreground for popover
        },
        card: {
          DEFAULT: "hsl(210, 36%, 96%)",  // Card background
          foreground: "hsl(220, 15%, 20%)",  // Card text
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
