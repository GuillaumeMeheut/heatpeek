export default {
  global: {
    errorTitle: "Error",
    successTitle: "Success",
    cancel: "Cancel",
    delete: "Delete",
  },
  nav: {
    why: "Why Heatpeek?",
    pricing: "Pricing",
    dashboard: "Dashboard",
    overview: "Overview",
    view: "View",
    signIn: "Sign In",
    signUp: "Sign Up",
    getStarted: "Get Started",
    heatmap: "Heatmap",
    elements: "Elements",
    myAccount: "My Account",
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
      error: "An error occurred. Please try again.",
      errorEmailTaken: "Email already taken",
      successSignUp:
        "An email has been sent to your address, click on the link to comfirm your account.",
      successSignIn: "You are now signed in.",
      successConfirm: "Your account is now confirmed.",
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
    error: "Failed to create site",
  },
  projects: {
    title: "Projects management",
    description: "Manage and track your website projects",
    addNew: "Add New Site",
    delete: "Delete",
    emptyState:
      "You don't have any projects yet. Add a new project to get started.",
    validation: {
      labelTooLong: "Label must be less than 40 characters",
      baseUrlRequired: "Base URL is required",
      invalidUrl: "Please enter a valid URL",
    },
    deleteProject: {
      success: "Project deleted successfully",
      error: "Failed to delete project",
      confirmTitle: "Are you sure?",
      confirmDescription:
        "This action cannot be undone. This will permanently delete your project and remove all the data related to it from our servers.",
    },
    actions: {
      edit: "Edit",
      delete: "Delete",
    },
    stats: {
      urls: "URLs",
      views: "Views",
    },
    buttons: {
      viewAnalytics: "View Analytics",
      manageUrls: "Manage URLs",
    },
    editDialog: {
      title: "Edit Project",
      description: "Update the project settings and configuration.",
      labels: {
        projectName: "Project Name *",
        baseUrl: "Base URL *",
        category: "Category",
      },
      buttons: {
        cancel: "Cancel",
        saveChanges: "Save Changes",
      },
      success: "Project updated successfully",
      error: "Failed to update project",
    },
    addProject: {
      title: "Create New Project",
      description:
        "Create a new project to track user interactions on your website.",
      button: "New Project",
      labels: {
        projectName: "Project Name",
        projectNamePlaceholder: "My Website Project",
        baseUrl: "Base URL *",
        baseUrlPlaceholder: "https://example.com",
        category: "Category",
        categoryPlaceholder: "Select category",
      },
      buttons: {
        cancel: "Cancel",
        create: "Create Project",
      },
      success: "Project created successfully",
      error: "Failed to create project",
    },
  },
  why: {
    hero: {
      description:
        "The next generation of web analytics that puts privacy first while delivering powerful insights",
    },
    features: {
      dashboard: {
        title: "User-Friendly Dashboard",
        description:
          "Experience a streamlined analytics dashboard that puts the most important metrics at your fingertips. Our intuitive interface makes it easy to understand your users' behavior without any technical expertise.",
        benefits: {
          realtime: "Real-time data visualization",
          customizable: "Customizable metrics and reports",
          responsive: "Mobile-responsive design",
        },
      },
      lightweight: {
        title: "Lightweight & Fast",
        description:
          "Our analytics script is incredibly lightweight, weighing in at under 10KB. This means zero impact on your website's performance and loading times.",
        benefits: {
          footprint: "Less than 10KB footprint",
          performance: "Zero impact on Core Web Vitals",
          loading: "Asynchronous loading",
        },
      },
      privacy: {
        title: "Privacy First",
        description:
          "Built with privacy in mind from the ground up. No cookies required, fully GDPR compliant, and we never collect personally identifiable information (PII). No cookie banner needed!",
        benefits: {
          gdpr: "GDPR compliant by design",
          cookies: "No cookies or local storage",
          pii: "No PII collection",
        },
      },
      respect: {
        title: "Respects User Privacy",
        description:
          "Unlike other heatmap analytics tools, we don't use screen recording. We believe in gathering insights while respecting your users' privacy and comfort.",
        benefits: {
          tracking: "No invasive tracking",
          ethical: "Ethical data collection",
          transparent: "Transparent analytics",
        },
      },
    },
    additional: {
      title: "Additional Benefits",
      analytics: {
        title: "Advanced Analytics",
        description:
          "Get detailed insights into user behavior, page performance, and conversion metrics.",
      },
      infrastructure: {
        title: "Reliable Infrastructure",
        description:
          "Built on robust cloud infrastructure ensuring 99.9% uptime and fast data processing.",
      },
      security: {
        title: "Secure Data",
        description:
          "Enterprise-grade security with encrypted data transmission and storage.",
      },
    },
  },
  filters: {
    searchPages: "Search pages...",
    allPages: "All Pages",
    new: "New",
    manage: "Manage",
  },
  urlsTable: {
    title: "Pages",
    description: "Manage your tracked pages",
    columns: {
      urlAndName: "URL & Name",
      status: "Status",
      performance: "Performance",
      actions: "Actions",
    },
    status: {
      active: "Active",
      inactive: "Inactive",
    },
    performance: {
      views: "views",
      clicks: "clicks",
    },
    deleteUrl: {
      success: "URL deleted successfully",
      error: "Failed to delete URL",
      confirmTitle: "Are you sure?",
      confirmDescription:
        "This action cannot be undone. This will permanently delete the URL and remove all the data related to it from our servers.",
    },
    buttons: {
      view: "View",
      edit: "Edit",
      delete: "Delete",
    },
    editDialog: {
      title: "Edit URL",
      description: "Update the URL settings and tracking configuration",
      urlLabel: "URL",
      nameLabel: "Page Name",
      trackingLabel: "Enable tracking",
      cancelButton: "Cancel",
      saveButton: "Save Changes",
      success: "URL updated successfully",
      error: "Failed to update URL",
    },
  },
  urlManagement: {
    title: "URL Management",
    description: "Manage and track URLs for your website project",
    emptyState:
      "You don't have any pages to track yet. Add a new page to track data on this one.",
    validation: {
      urlRequired: "URL is required",
      invalidUrl: "Please enter a valid URL",
      urlTooLong: "URL must be less than 200 characters",
      labelTooLong: "Label must be less than 20 characters",
    },
  },

  addUrl: {
    trigger: "Add URL",
    title: "Add New URL",
    description: "Add a new URL to track user interactions and behavior.",
    urlLabel: "URL *",
    urlPlaceholder: "https://example.com/page",
    labelLabel: "Label",
    labelPlaceholder: "Homepage",
    trackingLabel: "Enable tracking immediately",
    cancelButton: "Cancel",
    addButton: "Add URL",
    success: "URL added successfully",
    error: "Failed to add URL",
  },
  urlList: {
    manageSites: "Manage sites",
  },
} as const;
