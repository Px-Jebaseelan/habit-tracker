import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        // Dark theme (default)
        'dark-bg-start': '#1D2B3E',
        'dark-bg-end': '#2C3E50',
        'dark-card': 'rgba(30, 40, 55, 0.94)',
        'dark-input': 'rgba(44, 62, 80, 0.88)',
        'dark-text': '#ECF0F1',
        'dark-text-muted': '#B0C4DE',
        'dark-border': 'rgba(106, 13, 173, 0.4)',
        
        // Light theme
        'light-bg-start': '#E0EAFC',
        'light-bg-end': '#CFDEF3',
        'light-card': 'rgba(255, 255, 255, 0.92)',
        'light-input': 'rgba(236, 240, 241, 0.8)',
        'light-text': '#2c3e50',
        'light-text-muted': '#566573',
        'light-border': 'rgba(90, 45, 130, 0.4)',
        
        // Accent colors (same for both themes, with variants)
        'accent-primary': '#6A0DAD',
        'accent-primary-light': '#5A2D82',
        'accent-secondary': '#4169E1',
        'accent-secondary-light': '#3058D3',
        'accent-tertiary': '#20B2AA',
        'accent-tertiary-light': '#1A8A84',
        
        // Status colors
        'danger': '#E74C3C',
        'danger-light': '#C0392B',
        'warning': '#F39C12',
        'warning-light': '#D35400',
        'success': '#20B2AA',
        'success-light': '#1A8A84',
        'points': '#FFD700',
        'points-light': '#E67E22',
      },
      backgroundColor: {
        'gradient-dark-start': '#1D2B3E',
        'gradient-dark-end': '#2C3E50',
        'gradient-light-start': '#E0EAFC',
        'gradient-light-end': '#CFDEF3',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(140deg, #1D2B3E, #2C3E50)',
        'gradient-light': 'linear-gradient(140deg, #E0EAFC, #CFDEF3)',
        'header-gradient': 'linear-gradient(90deg, #e6eaf3 0%, #7f8cff 40%, #b388ff 100%)',
        'header-gradient-light': 'linear-gradient(90deg, #4a90e2 0%, #007bff 40%, #00c9a7 100%)',
        'progress-gradient': 'linear-gradient(90deg, #4169E1 0%, #20B2AA 100%)',
        'progress-gradient-light': 'linear-gradient(90deg, #3058D3 0%, #1A8A84 100%)',
        'button-gradient': 'linear-gradient(135deg, #6A0DAD, #4169E1)',
        'button-gradient-light': 'linear-gradient(135deg, #5A2D82, #3058D3)',
      },
      maxWidth: {
        '1111': '1111px',
      },
      spacing: {
        'gutter': '20px',
        'container-x': '35px',
        'container-y': '40px',
      },
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '8px',
        'pill': '15px',
      },
      boxShadow: {
        'dark': '0 12px 30px rgba(0, 0, 0, 0.35), 0 8px 15px rgba(0, 0, 0, 0.28)',
        'dark-sm': '0 6px 15px rgba(0, 0, 0, 0.18)',
        'light': '0 10px 25px rgba(0, 0, 0, 0.15), 0 6px 10px rgba(0, 0, 0, 0.1)',
        'light-sm': '0 3px 8px rgba(65, 105, 225, 0.3)',
        'inset-dark': 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
        'glow-purple': '0 0 20px rgba(106, 13, 173, 0.5), 0 0 45px rgba(106, 13, 173, 0.3)',
        'glow-blue': '0 0 10px rgba(65, 105, 225, 0.4)',
        'glow-teal': '0 0 10px rgba(32, 178, 170, 0.5)',
        'glow-purple-light': '0 0 20px rgba(90, 45, 130, 0.5), 0 0 45px rgba(90, 45, 130, 0.3)',
        'glow-blue-light': '0 0 10px rgba(48, 88, 211, 0.4)',
        'glow-teal-light': '0 0 10px rgba(26, 138, 132, 0.5)',
      },
      transitionDuration: {
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        'smooth': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      animation: {
        'fade-in-slide-up': 'fadeInSlideUp 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'rotate-glow': 'rotateGlow 25s linear infinite',
        'cool-flow': 'coolFlow 10s ease-in-out infinite alternate',
        'move-shine': 'moveShine 2s linear infinite',
        'pop-in': 'popIn 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'bounce-emoji': 'bounceEmoji 2s infinite ease-in-out',
        'celebrate-particle': 'celebrateParticle 1.5s ease-out forwards',
        'slide-out-left': 'slideOutLeft 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
        'fade-in-modal': 'fadeInModal 0.3s ease',
      },
      keyframes: {
        fadeInSlideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        rotateGlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        coolFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        moveShine: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        },
        popIn: {
          from: { opacity: '0', transform: 'translateY(15px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        bounceEmoji: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-15px)' },
          '60%': { transform: 'translateY(-7px)' },
        },
        celebrateParticle: {
          '0%': { transform: 'translateY(50vh) scale(0.5)', opacity: '1' },
          '100%': { transform: 'translateY(-20px) scale(0)', opacity: '0' },
        },
        slideOutLeft: {
          to: {
            opacity: '0',
            transform: 'translateX(-100px) scale(0.8)',
            height: '0',
            paddingTop: '0',
            paddingBottom: '0',
            marginBottom: '0',
            border: 'none',
          },
        },
        fadeInModal: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
        '103': '1.03',
        '97': '0.97',
      },
      rotate: {
        '5': '5deg',
        '-5': '-5deg',
        '15': '15deg',
      },
      blur: {
        '4xl': '50px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
