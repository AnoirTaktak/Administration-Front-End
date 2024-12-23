import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    navCap: '',
    divider: true
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    displayName: 'Paramétres Societe',
    iconName: 'icon-park:setting',
    route: '/ui-components/Societe',
  },
  {
    displayName: 'Notre Employes',
    iconName: 'icon-park:people',
    route: '/ui-components/Employe',
  },
  {
    displayName: 'Générer Documents',
    iconName: 'icon-park:doc-add',
    route: '/ui-components/Documents',
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
    displayName: 'Ajouter Factures Vente',
    iconName: 'icon-park:rss',
    route: '/ui-components/AjoutFacturesVente',
  },{
    displayName: 'Consulter Factures Vente',
    iconName: 'icon-park:preview-open',
    route: '/ui-components/ConsulterFacturesVente',
  },
  {
    navCap: 'Auth',
    divider: true
  },
  {
    displayName: 'Login',
    iconName: 'solar:login-3-line-duotone',
    route: '/authentication/login',
  },
 
];
