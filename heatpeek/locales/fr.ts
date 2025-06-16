export default {
  global: {
    errorTitle: "Erreur",
    successTitle: "Succès",
  },
  nav: {
    why: "Pourquoi Heatpeek ?",
    pricing: "Tarifs",
    dashboard: "Tableau de bord",
    overview: "Vue d'ensemble",
    view: "Voir",
    signIn: "Connexion",
    signUp: "Inscription",
    getStarted: "Commencer",
    heatmap: "Heatmap",
    elements: "Éléments",
    myAccount: "Mon Compte",
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
      confirmPassword: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "Confirmez votre mot de passe",
      validation: {
        invalidEmail: "Adresse email invalide",
        passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
        passwordsDontMatch: "Les mots de passe ne correspondent pas",
      },
      error: "Une erreur est survenue. Veuillez réessayer.",
      errorEmailTaken: "Cette adresse email est déjà utilisée",
      successSignUp:
        "Un email a été envoyé à votre adresse, cliquez sur le lien pour confirmer votre compte.",
      successSignIn: "Vous êtes maintenant connecté.",
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
    verify: "Vérifier",
    verifying: "Vérification...",
    verified: "Installation vérifiée",
    not_verified: "Installation non trouvée",
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
      pageUrl: "URL de la page",
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
      validation: {
        invalidUrl: "Veuillez entrer une URL valide",
        snapshotNameRequired: "Le nom de la capture est requis",
        selectDevice: "Veuillez sélectionner au moins un appareil",
        cssSelectorsRequired:
          "Les sélecteurs CSS sont requis lors de la sélection d'éléments spécifiques",
      },
      success: {
        title: "Succès !",
        description: "Votre page a été capturée avec succès.",
      },
      error: {
        title: "Erreur",
        description: "Échec de la capture de la page. Veuillez réessayer.",
      },
    },
  },
  pricing: {
    title: "Tarification simple et transparente",
    subtitle: "Choisissez le forfait qui vous convient",
    plans: {
      free: {
        name: "Gratuit",
        price: "0€",
        description:
          "Parfait pour les projets passion et les sites web simples",
        features: {
          clickHeatmap: "Heatmap de clics",
          rageClicks: "Clics de rage",
          scrollTracking: "Suivi du défilement",
          retention: "Rétention",
          trackedPage: "Page suivie",
          pageviews: "Pages vues",
        },
      },
      independent: {
        name: "Indépendant",
        price: "9€/mois",
        description:
          "Pour les applications en production avec la puissance d'évoluer",
        popular: "Le plus populaire",
      },
      pro: {
        name: "Pro",
        price: "29€/mois",
        description:
          "Pour les entreprises en croissance avec des besoins avancés",
      },
      scale: {
        name: "Scale",
        price: "79€+",
        description:
          "Pour les applications à grande échelle exécutant des charges de travail Internet",
      },
    },
    features: {
      basic: "Basique",
      advanced: "Avancé",
      unlimited: "Illimité",
      perMonth: "/mois",
      getStarted: "Commencer",
      contactUs: "Contactez-nous",
    },
  },
  setupSite: {
    title: "Configuration du Site",
    siteLabel: "Nom du Site",
    siteLabelPlaceholder: "Entrez le nom de votre site",
    websiteType: "Type de site",
    websiteTypePlaceholder: "Selectionner votre type de site",
    baseUrl: "URL de Base",
    baseUrlPlaceholder: "https://exemple.com",
    baseUrlDescription:
      "Entrez l'URL racine de votre site web (ex: https://exemple.com)",
    validate: "Valider",
    error: "Échec de la création du site",
  },
  projects: {
    title: "Vos Projets",
    addNew: "Ajouter un Site",
    delete: "Supprimer",
  },
  why: {
    hero: {
      description:
        "La nouvelle génération d'analytique web qui privilégie la confidentialité tout en offrant des analyses puissantes",
    },
    features: {
      dashboard: {
        title: "Tableau de Bord Intuitif",
        description:
          "Profitez d'un tableau de bord d'analyse rationalisé qui met les métriques les plus importantes à portée de main. Notre interface intuitive facilite la compréhension du comportement de vos utilisateurs sans aucune expertise technique.",
        benefits: {
          realtime: "Visualisation des données en temps réel",
          customizable: "Métriques et rapports personnalisables",
          responsive: "Design adaptatif mobile",
        },
      },
      lightweight: {
        title: "Léger et Rapide",
        description:
          "Notre script d'analyse est incroyablement léger, pesant moins de 10KB. Cela signifie un impact nul sur les performances et les temps de chargement de votre site web.",
        benefits: {
          footprint: "Empreinte inférieure à 10KB",
          performance: "Impact nul sur les Core Web Vitals",
          loading: "Chargement asynchrone",
        },
      },
      privacy: {
        title: "Confidentialité en Priorité",
        description:
          "Conçu avec la confidentialité en tête. Pas de cookies requis, entièrement conforme au RGPD, et nous ne collectons jamais d'informations personnellement identifiables (PII). Pas besoin de bannière de cookies !",
        benefits: {
          gdpr: "Conforme au RGPD par conception",
          cookies: "Pas de cookies ni de stockage local",
          pii: "Pas de collecte de PII",
        },
      },
      respect: {
        title: "Respect de la Vie Privée",
        description:
          "Contrairement aux autres outils d'analyse de heatmap, nous n'utilisons pas l'enregistrement d'écran. Nous croyons en la collecte d'informations tout en respectant la vie privée et le confort de vos utilisateurs.",
        benefits: {
          tracking: "Pas de suivi invasif",
          ethical: "Collecte de données éthique",
          transparent: "Analytique transparente",
        },
      },
    },
    additional: {
      title: "Avantages Supplémentaires",
      analytics: {
        title: "Analytique Avancée",
        description:
          "Obtenez des analyses détaillées du comportement des utilisateurs, des performances des pages et des métriques de conversion.",
      },
      infrastructure: {
        title: "Infrastructure Fiable",
        description:
          "Construite sur une infrastructure cloud robuste garantissant une disponibilité de 99,9% et un traitement rapide des données.",
      },
      security: {
        title: "Données Sécurisées",
        description:
          "Sécurité de niveau entreprise avec transmission et stockage des données chiffrés.",
      },
    },
  },
  filters: {
    searchPages: "Rechercher des pages...",
    allPages: "Toutes les Pages",
    new: "Nouveau",
    manage: "Gérer",
  },
  urlManagement: {
    title: "Gestion des URLs",
    description: "Gérez et suivez les URLs de votre projet de site web",
  },
  urlsTable: {
    title: "Pages",
    description: "Gérez vos pages suivies",
    columns: {
      urlAndName: "URL & Nom",
      status: "Statut",
      performance: "Performance",
      actions: "Actions",
    },
    status: {
      active: "Actif",
      inactive: "Inactif",
    },
    performance: {
      views: "vues",
      clicks: "clics",
    },
    deleteUrl: {
      success: "URL supprimée avec succès",
      error: "Échec de la suppression de l'URL",
    },
    buttons: {
      view: "Voir",
      edit: "Modifier",
      delete: "Supprimer",
    },
    editDialog: {
      title: "Modifier l'URL",
      description:
        "Mettre à jour les paramètres de l'URL et la configuration du suivi",
      urlLabel: "URL",
      nameLabel: "Nom de la page",
      trackingLabel: "Activer le suivi",
      cancelButton: "Annuler",
      saveButton: "Enregistrer",
    },
  },
  addUrl: {
    trigger: "Ajouter une URL",
    title: "Ajouter une nouvelle URL",
    description:
      "Ajoutez une nouvelle URL pour suivre les interactions et le comportement des utilisateurs.",
    urlLabel: "URL *",
    urlPlaceholder: "https://exemple.com/page",
    labelLabel: "Label",
    labelPlaceholder: "Page d'accueil",
    trackingLabel: "Activer le suivi immédiatement",
    cancelButton: "Annuler",
    addButton: "Ajouter l'URL",
    success: "URL ajoutée avec succès",
    error: "Échec de l'ajout de l'URL",
  },
} as const;
