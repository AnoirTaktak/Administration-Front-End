import { Routes } from '@angular/router';

// ui
import { SocieteComponent } from './societe/societe.component';
import { EmployeComponent } from './employe/employe.component';
import { DocumentsAdministratifComponent } from './documents-administratif/documents-administratif.component';
import { ClientComponent } from './client/client.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { ServiceComponent } from './service/service.component';
import { FactureAchatComponent } from './facture-achat/facture-achat.component';
import { AjoutFactureVenteComponent } from './ajout-facture-vente/ajout-facture-vente.component';
import { ConsulterFactureVenteComponent } from './consulter-facture-vente/consulter-facture-vente.component';
import { ProfileComponent } from './profile/profile.component';
import { GererComptesComponent } from './gerer-comptes/gerer-comptes.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuardSuperAdmin } from 'src/guards/role.guard';
import { AccesDeniedComponent } from './acces-denied/acces-denied.component';


export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Societe',
        component: SocieteComponent,
        canActivate: [AuthGuard,RoleGuardSuperAdmin],
      },
      {
        path: 'Employe',
        component: EmployeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Documents',
        component: DocumentsAdministratifComponent,
        canActivate: [AuthGuard,RoleGuardSuperAdmin],

      },
      {
        path: 'Clients',
        component: ClientComponent,
        canActivate: [AuthGuard],
      },{
        path: 'Fournisseurs',
        component: FournisseurComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Services',
        component: ServiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'FacturesAchat',
        component: FactureAchatComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'AjoutFacturesVente',
        component: AjoutFactureVenteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'ConsulterFacturesVente',
        component: ConsulterFactureVenteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'Profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'gerer-comptes',
        component: GererComptesComponent,
        canActivate: [RoleGuardSuperAdmin],
      },
      {
        path: 'acces-denied',
        component: AccesDeniedComponent,

      },
      

    ],
  },
];
