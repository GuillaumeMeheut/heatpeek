export default {
  nav: {
    why: "Pourquoi Heatpeek ?",
    pricing: "Tarifs",
    dashboard: "Dashboard",
    signIn: "Connexion",
    signUp: "Inscription",
  },
  auth: {
    signOut: "Déconnexion",
    card: {
      signIn: "Connexion",
      signUp: "Inscription",
      email: "Email",
      emailPlaceholder: "nom@exemple.com",
      password: "Mot de passe",
      passwordPlaceholder: "Mot de passe",
      noAccount: "Vous n'avez pas encore de compte ?",
      haveAccount: "Vous avez déjà un compte ?",
      signUpLink: "S'inscrire",
      signInLink: "Se connecter",
    },
  },
  sidebar: {
    newPage: "Nouvelle Page",
  },
  tooltip: {
    copy: "Copier",
    copied: "Copié !",
  },
  optionsBar: {
    clickPatterns: "Analyser les modèles de clics",
    scroll: "Suivre le défilement",
    mobileView: "Vue mobile",
    tabletView: "Vue tablette",
    desktopView: "Vue bureau",
    opacity: "Ajuster l'opacité de la superposition",
  },
  home: {
    hero: {
      title: "Analytique de Heatmap Respectueuse de la Vie Privée",
      description:
        "Comprenez vos utilisateurs sans compromettre leur vie privée. Heatpeek fournit des analyses de heatmap légères et respectueuses de la vie privée pour votre site web.",
      getStarted: "Commencer",
      viewDemo: "Voir la Démo",
    },
    features: {
      title: "Pourquoi Choisir Heatpeek ?",
      privacy: {
        title: "Vie Privée en Priorité",
        description:
          "Conçu avec la vie privée en tête. Pas de collecte de données personnelles, uniquement des données d'interaction anonymes.",
      },
      lightweight: {
        title: "Léger",
        description:
          "Script minuscule qui ne ralentira pas votre site web. Moins de 5KB compressé.",
      },
      insights: {
        title: "Analyses Puissantes",
        description:
          "Obtenez des visualisations claires du comportement des utilisateurs pour améliorer l'UX de votre site web.",
      },
    },
    cta: {
      title: "Prêt à Commencer ?",
      description:
        "Rejoignez la bêta privée et commencez à mieux comprendre vos utilisateurs dès aujourd'hui.",
      button: "Rejoindre la Bêta Privée",
    },
  },
  tracking: {
    title: "Tracking script",
    copy: "Copier",
    copied: "Copié !",
    instructions:
      "Ajoutez ce script à votre site web dans la section <head> après les balises <meta>. Ajoutez-le à chaque page que vous souhaitez suivre, puis vérifiez votre installation.",
  },
  addPage: {
    selection: {
      title: "D'abord, ajoutez le script de suivi",
      description:
        "Avant de créer votre page, vous devez ajouter notre script de suivi à votre site web. Ce script permettra à HeatPeek de collecter et d'analyser les interactions des utilisateurs sur vos pages.",
      chooseType: "Ensuite, choisissez votre type de page",
      simple: {
        title: "Ajouter une page simple",
        description: "Créer une nouvelle page unique.",
      },
      auth: {
        title: "Ajouter une page protégée",
        description:
          "Créer une nouvelle page qui nécessite une authentification utilisateur pour y accéder.",
      },
    },
    auth: {
      title: "Étape 1 : Prendre une capture d'écran",
      back: "Retour à la sélection",
      instructions:
        "Pour créer une page protégée par authentification, vous devrez prendre une capture d'écran de la page à l'aide de notre extension de navigateur.",
      screenshot: {
        title: "Comment prendre une capture d'écran :",
        steps: {
          install:
            "Installez notre extension de navigateur si ce n'est pas déjà fait",
          login:
            "Connectez-vous et naviguez vers la page que vous souhaitez suivre",
          click:
            "Cliquez sur l'icône de l'extension et sélectionnez \"Prendre une capture d'écran\"",
          wait: "Attendez que la capture d'écran soit traitée",
        },
        installButton: "Installer l'extension",
      },
    },
    simple: {
      title: "Étape 1 : Ajoutez l'URL de votre page",
      back: "Retour à la sélection",
      instructions:
        "Entrez l'URL de la page que vous souhaitez suivre. Assurez-vous que la page est accessible publiquement.",
      yourPage: "Votre page",
      websiteUrl: "URL du site web",
      snapshotName: "Nom de la capture",
      selectDevices: "Sélectionner les appareils",
      blockingPopups: "Bloquer les pop-ups",
      popupOptions: {
        omit: "Ignorer les pop-ups",
        dontBlock: "Ne rien bloquer",
        specific: "Ignorer des éléments spécifiques",
      },
      cssSelectors: {
        label: "Sélecteurs CSS",
        placeholder: ".cookie-banner, #newsletter-popup",
        help: "Entrez les sélecteurs CSS séparés par des virgules",
      },
      continue: "Continuer",
    },
  },
} as const;
