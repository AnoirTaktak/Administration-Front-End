import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Accueil',
  },
  {
    navCap: '',
    divider: true
  },
  {
    displayName: 'Tableau de bord',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    displayName: 'Paramètres Societe',
    iconName: 'icon-park:setting',
    route: '/ui-components/Societe',
  },
  {
    displayName: 'Employes',
    iconName: 'icon-park:people',
    route: '/ui-components/Employe',
  },
  {
    displayName: 'Clients',
    iconName: 'icon-park:handle-c',
    route: '/ui-components/Clients',
  },
  {
    displayName: 'Fournisseurs',
    iconName: 'icon-park:foursquare',
    route: '/ui-components/Fournisseurs',
  },
  {
    displayName: 'Services',
    iconName: 'icon-park:health-products',
    route: '/ui-components/Services',
  },


  {
    displayName: 'Factures Achat',
    iconName: 'icon-park:buy',
    route: '/ui-components/FacturesAchat',
  },
  {
    displayName: 'Factures de Ventes',
    iconName: 'icon-park:preview-open',
    route: '/ui-components/ConsulterFacturesVente',
  },
  {
    displayName: 'Ajouter Factures Vente',
    iconName: 'icon-park:rss',
    route: '/ui-components/AjoutFacturesVente',
  },
  {
    displayName: 'Générer Documents',
    iconName: 'icon-park:doc-add',
    route: '/ui-components/Documents',
  },
  {
    navCap: 'Connexion',
    divider: true
  },

];
