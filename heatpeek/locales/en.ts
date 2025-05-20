export default {
  nav: {
    why: "Why Heatpeek?",
    pricing: "Pricing",
    dashboard: "Dashboard",
    signIn: "Sign In",
    signUp: "Sign Up",
  },
  auth: {
    signOut: "Sign Out",
    card: {
      signIn: "Sign in",
      signUp: "Sign up",
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Password",
      passwordPlaceholder: "Password",
      noAccount: "Don't have an account yet?",
      haveAccount: "Already have an account?",
      signUpLink: "Sign up",
      signInLink: "Sign in",
    },
  },
  sidebar: {
    newPage: "New Page",
  },
  tooltip: {
    copy: "Copy",
    copied: "Copied!",
  },
  optionsBar: {
    clickPatterns: "Analyze user click patterns",
    scroll: "Track user scroll",
    mobileView: "Mobile view",
    tabletView: "Tablet view",
    desktopView: "Desktop view",
    opacity: "Adjust overlay opacity",
  },
  home: {
    hero: {
      title: "Privacy-Focused Heatmap Analytics",
      description:
        "Understand your users without compromising their privacy. Heatpeek provides lightweight, privacy-respecting heatmap analytics for your website.",
      getStarted: "Get Started",
      viewDemo: "View Demo",
    },
    features: {
      title: "Why Choose Heatpeek?",
      privacy: {
        title: "Privacy First",
        description:
          "Built with privacy in mind. No personal data collection, just anonymous interaction data.",
      },
      lightweight: {
        title: "Lightweight",
        description:
          "Tiny script that won't slow down your website. Less than 5KB gzipped.",
      },
      insights: {
        title: "Powerful Insights",
        description:
          "Get clear visualizations of user behavior to improve your website's UX.",
      },
    },
    cta: {
      title: "Ready to Get Started?",
      description:
        "Join the private beta and start understanding your users better today.",
      button: "Join Private Beta",
    },
  },
  tracking: {
    title: "Tracking Script",
    copy: "Copy",
    copied: "Copied!",
    instructions:
      "Add this script to your website's HTML, either at the top of the <head> section after <meta> tags. Add it to every page you wish to track, then verify your installation.",
  },
  addPage: {
    selection: {
      title: "First, Add the Tracking Script",
      description:
        "Before creating your page, you need to add our tracking script to your website. This script will enable HeatPeek to collect and analyze user interactions on your pages.",
      chooseType: "Then, Choose Your Page Type",
      simple: {
        title: "Add a Simple Page",
        description: "Create a new single page.",
      },
      auth: {
        title: "Add a Page Behind Auth",
        description:
          "Create a new page that requires user authentication to access.",
      },
    },
    auth: {
      title: "Step 1: Take a Screenshot",
      back: "Back to Selection",
      instructions:
        "To create an auth-protected page, you'll need to take a screenshot of the page using our browser extension.",
      screenshot: {
        title: "How to take a screenshot:",
        steps: {
          install: "Install our browser extension if you haven't already",
          login: "Log in and navigate to the page you want to track",
          click: 'Click the extension icon and select "Take Screenshot"',
          wait: "Wait for the screenshot to be processed",
        },
        installButton: "Install Extension",
      },
    },
    simple: {
      title: "Step 1: Add Your Page URL",
      back: "Back to Selection",
      instructions:
        "Enter the URL of the page you want to track. Make sure the page is publicly accessible.",
      yourPage: "Your Page",
      websiteUrl: "Website URL",
      snapshotName: "Snapshot name",
      selectDevices: "Select Devices",
      blockingPopups: "Blocking Pop-Ups",
      popupOptions: {
        omit: "Omit pop-ups",
        dontBlock: "Don't block anything",
        specific: "Omit specific elements",
      },
      cssSelectors: {
        label: "CSS Selectors",
        placeholder: ".cookie-banner, #newsletter-popup",
        help: "Enter CSS selectors separated by commas",
      },
      continue: "Continue",
    },
  },
} as const;
