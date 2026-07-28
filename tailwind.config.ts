import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /* Light "golden morning" grade — token names keep their semantic roles:
         obsidian = page ground, charcoal = alternate section, graphite = cards,
         ivory = primary text ink, champagne = the house metal. */
      colors: {
        obsidian: "#faf8f2",
        charcoal: "#f3eee2",
        graphite: "#eae3d2",
        smoke: "#ded5c0",
        ivory: "#221c12",
        champagne: {
          DEFAULT: "#8a6d43",
          light: "#a8894f",
          dark: "#6b5230",
        },
        bronze: "#8a6d43",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.32em",
        wide2: "0.18em",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
