export default {
  nav: {
    why: "Why Heatpeek?",
    pricing: "Pricing",
    dashboard: "Dashboard",
    overview: "Overview",
    view: "View",
    signIn: "Sign In",
    signUp: "Sign Up",
    upgrade: "Upgrade",
    getStarted: "Get Started",
    heatmap: "Heatmap",
    elements: "Elements",
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
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      validation: {
        invalidEmail: "Invalid email address",
        passwordTooShort: "Password must be at least 6 characters",
        passwordsDontMatch: "Passwords don't match",
      },
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
    verify: "Verify",
    verifying: "Verifying...",
    verified: "Installation verified",
    not_verified: "Installation not found",
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
      pageUrl: "Page URL",
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
      validation: {
        invalidUrl: "Please enter a valid URL",
        snapshotNameRequired: "Snapshot name is required",
        selectDevice: "Please select at least one device",
        cssSelectorsRequired:
          "CSS selectors are required when selecting specific elements",
      },
      success: {
        title: "Success!",
        description: "Your page has been successfully captured.",
      },
      error: {
        title: "Error",
        description: "Failed to capture the page. Please try again.",
      },
    },
  },
  pricing: {
    title: "Simple, transparent pricing",
    subtitle: "Choose the plan that's right for you",
    plans: {
      free: {
        name: "Free",
        price: "$0",
        description: "Perfect for passion projects & simple websites",
        features: {
          clickHeatmap: "Click Heatmap",
          rageClicks: "Rage Clicks",
          scrollTracking: "Scroll Tracking",
          retention: "Retention",
          trackedPage: "Tracked Page",
          pageviews: "Pageviews",
        },
      },
      independent: {
        name: "Independent",
        price: "$9/mo",
        description: "For production applications with the power to scale",
        popular: "Most Popular",
      },
      pro: {
        name: "Pro",
        price: "$29/mo",
        description: "For growing businesses with advanced needs",
      },
      scale: {
        name: "Scale",
        price: "$79+",
        description:
          "For large-scale applications running Internet scale workloads",
      },
    },
    features: {
      basic: "Basic",
      advanced: "Advanced",
      unlimited: "Unlimited",
      perMonth: "/month",
      getStarted: "Get Started",
      contactUs: "Contact Us",
    },
  },
  setupSite: {
    title: "Setup Your Site",
    siteLabel: "Site Label",
    siteLabelPlaceholder: "Enter your site label",
    websiteType: "Website Type",
    websiteTypePlaceholder: "Select your website type",
    baseUrl: "Base URL",
    baseUrlPlaceholder: "https://example.com",
    baseUrlDescription:
      "Enter the root URL of your website (e.g., https://example.com)",
    validate: "Validate",
    error: {
      title: "Error",
      description: "Failed to create site",
    },
  },
  projects: {
    title: "Your Projects",
    addNew: "Add New Site",
    delete: "Delete",
  },
} as const;
