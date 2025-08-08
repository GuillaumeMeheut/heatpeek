export default {
  global: {
    errorTitle: "Erreur",
    successTitle: "Succès",
    cancel: "Annuler",
    delete: "Supprimer",
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
      successConfirm: "Votre compte est maintenant confirmé.",
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
    rageClicks: "Détecter les clics de rage (indicateurs de frustration)",
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
    title: "Gestion des projets",
    description: "Gérez et suivez vos projets de sites web",
    addNew: "Ajouter un Site",
    delete: "Supprimer",
    emptyState:
      "Vous n'avez pas encore de projets. Ajoutez un nouveau projet pour commencer.",
    validation: {
      labelTooLong: "Le label doit faire moins de 40 caractères",
      baseUrlRequired: "L'URL de base est requise",
      invalidUrl: "Veuillez entrer une URL valide",
    },
    deleteProject: {
      success: "Projet supprimé avec succès",
      error: "Échec de la suppression du projet",
      confirmTitle: "Êtes-vous sûr ?",
      confirmDescription:
        "Cette action ne peut pas être annulée. Cela supprimera définitivement votre projet et toutes les données associées de nos serveurs.",
    },
    actions: {
      edit: "Modifier",
      delete: "Supprimer",
    },
    stats: {
      urls: "URLs",
      views: "Vues",
    },
    buttons: {
      viewAnalytics: "Voir les analyses",
      manageUrls: "Gérer les URLs",
    },
    editDialog: {
      title: "Modifier le projet",
      description:
        "Mettre à jour les paramètres et la configuration du projet.",
      labels: {
        projectName: "Nom du projet *",
        baseUrl: "URL de base *",
        category: "Catégorie",
      },
      buttons: {
        cancel: "Annuler",
        saveChanges: "Enregistrer les modifications",
      },
      success: "Projet mis à jour avec succès",
      error: "Échec de la mise à jour du projet",
    },
    addProject: {
      title: "Créer un Nouveau Projet",
      description:
        "Créez un nouveau projet pour suivre les interactions des utilisateurs sur votre site web.",
      button: "Nouveau Projet",
      labels: {
        projectName: "Nom du Projet",
        projectNamePlaceholder: "Mon Projet de Site Web",
        baseUrl: "URL de Base *",
        baseUrlPlaceholder: "https://exemple.com",
        category: "Catégorie",
        categoryPlaceholder: "Sélectionner une catégorie",
      },
      buttons: {
        cancel: "Annuler",
        create: "Créer le Projet",
      },
      success: "Projet créé avec succès",
      error: "Échec de la création du projet",
    },
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
    allPages: "Toutes les pages suivies",
    new: "Nouveau",
    manage: "Gérer",
    last24hours: "Dernières 24 heures",
    last7days: "7 derniers jours",
    last30days: "30 derniers jours",
    last90days: "90 derniers jours",
  },
  urlManagement: {
    title: "Gestion des URLs",
    description: "Gérez et suivez les URLs de votre projet de site web",
    emptyState:
      "Vous n'avez pas encore de pages à suivre. Ajoutez une nouvelle page pour suivre les données sur celle-ci.",
    validation: {
      urlRequired: "URL est requis",
      invalidUrl: "Veuillez entrer une URL valide",
      urlTooLong: "URL doit être inférieure à 200 caractères",
      labelTooLong: "Label doit être inférieure à 20 caractères",
    },
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
      confirmTitle: "Êtes-vous sûr ?",
      confirmDescription:
        "Cette action ne peut pas être annulée. Cela supprimera définitivement l'URL et toutes les données associées de nos serveurs.",
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
      saveButton: "Enregistrer les modifications",
      success: "URL mise à jour avec succès",
      error: "Échec de la mise à jour de l'URL",
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
  urlList: {
    manageSites: "Gérer les sites",
  },
  snapshots: {
    deleteButton: "Supprimer la capture",
    deleteConfirmTitle: "Supprimer la capture ?",
    deleteConfirmDescription:
      "Cette action ne peut pas être annulée. Cela supprimera définitivement cette capture.",
    toastDeleted: "Capture supprimée",
    toastDeleteFailed: "Échec de la suppression de la capture",
    selectPlaceholder: "Sélectionner une capture",
    noLabel: "Sans nom",
  },
  versioning: {
    createNewVersionButton: "Créer une nouvelle version",
    confirmTitle: "Créer une nouvelle version de la heatmap ?",
    confirmDescription:
      "Cela va créer une nouvelle version de la heatmap pour l'appareil sélectionné. Les versions précédentes resteront accessibles pour comparaison.",
    createNewVersionAction: "Confirmer et créer la version",
  },
  pricing: {
    header: {
      badge: "Plans Tarifaires",
      title: "Tarification Simple et Transparente",
      description:
        "Choisissez le plan parfait pour vos besoins d'analyse. Commencez gratuitement et évoluez selon vos besoins.",
    },
    billing: {
      monthly: "Mensuel",
      yearly: "Annuel",
      yearlySavings: "(2 mois gratuits)",
    },
    plans: {
      starter: {
        name: "Starter",
        description:
          "Pour les développeurs indépendants ou petits projets souhaitant des analyses approfondies",
        features: [
          "Analytique de pages",
          "Heatmap de clics",
          "Heatmap de clics de rage",
          "Heatmap de profondeur de défilement",
          "Suivi du premier élément cliqué",
          "30 000 pages vues suivies/mois",
          "3 sites web suivis",
          "10 pages suivies",
          "Stockage de rétention 3 mois",
          "Tableau de bord d'analyse",
          "Support par email",
        ],
        buttons: {
          getStarted: "Commencer Gratuitement",
        },
      },
      pro: {
        name: "Pro",
        description:
          "Pour les développeurs indépendants ou petits projets souhaitant des analyses approfondies",
        features: [
          "Tout ce qui est inclus dans Starter",
          "100 000 pages vues suivies/mois",
          "10 sites web suivis",
          "30 pages suivies",
          "Stockage de rétention 6 mois",
          "Support par email",
        ],
        buttons: {
          upgrade: "Passer à Pro",
        },
      },
      business: {
        name: "Business",
        description:
          "Pour les produits en croissance et équipes nécessitant de l'évolutivité",
        features: [
          "Tout ce qui est inclus dans Starter",
          "400 000 pages vues suivies/mois",
          "30 sites web suivis",
          "100 pages suivies",
          "Stockage de rétention 12 mois",
          "Support prioritaire par email",
        ],
        buttons: {
          upgrade: "Passer à Business",
        },
      },
    },
    badges: {
      mostPopular: "Le Plus Populaire",
      currentPlan: "Plan Actuel",
    },
    buttons: {
      manageSubscription: "Gérer l'Abonnement",
    },
  },
} as const;
