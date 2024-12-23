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


export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Societe',
        component: SocieteComponent,
      },
      {
        path: 'Employe',
        component: EmployeComponent,
      },
      {
        path: 'Documents',
        component: DocumentsAdministratifComponent,
      },
      {
        path: 'Clients',
        component: ClientComponent,
      },{
        path: 'Fournisseurs',
        component: FournisseurComponent,
      },
      {
        path: 'Services',
        component: ServiceComponent,
      },
      {
        path: 'FacturesAchat',
        component: FactureAchatComponent,
      },
      {
        path: 'AjoutFacturesVente',
        component: AjoutFactureVenteComponent,
      },
      {
        path: 'ConsulterFacturesVente',
        component: ConsulterFactureVenteComponent,
      },
    ],
  },
];
