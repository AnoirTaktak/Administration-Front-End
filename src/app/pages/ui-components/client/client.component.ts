import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ClientService } from 'src/app/services/client/client.service';
import { Client } from 'src/Models/client';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { AddClientComponent } from '../add-client/add-client.component';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatNativeDateModule,
  ],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  displayedColumns: string[] = ['mf','rs','tel','email', 'adresse', 'type','actions'];
  clients: Client[] = []; // Liste des clients
  clientsMF: Client[] = []; // Liste des clients recherchez by mf
  clientsRS: Client[] = []; // Liste des clients recherchez by rs
  clientsTc: Client[] = []; // Liste des clients recherche by type
  modeEdition: boolean = false;
  clientOriginal: Client = {} as Client;
  filters :any ={};
  searchMF: string = '';
  searchRS: string = '';
  searchTC: string = '';

  constructor(
    private clientservice: ClientService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.consulterclients();
    console.log(this.clients)
  }

  consulterclients(): void {
    this.clientservice.getAllClients().subscribe({
      next: (data: Client[]) => {
        this.clients = [...data];
        console.log(this.clients);
        this.clients = this.clients;
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la récupération des employés.', 'Fermer', { duration: 3000 });
        console.log(err.message)
      },
    });
  }

  openEditDialog(client: Client): void {


    const dialogRef = this.dialog.open(EditClientComponent, {
        panelClass: 'custom-dialog',
        width: '80%',
        data: client
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterclients();
      }
    });
  }

  openAddDialog(): void {


    const dialogRef = this.dialog.open(AddClientComponent, {
        panelClass: 'custom-dialog',
        width: '80%',
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterclients();
      }
    });
  }

  deleteclient(id: number): void {
    console.log(id)
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientservice.deleteClient(id).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé avec succès.', 'Fermer', { duration: 3000 });
          this.clients = this.clients.filter(e => e.ID_Client != id);
          //this.ngOnInit()
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
          console.error('Erreur lors de la suppression :', err)
        },
      });
    }
  }




  getTypeContratText(type: number): string {
    switch (type) {
      case 0:
        return 'Personne Physique';
      case 1:
        return 'Société';
      default:
        return 'Inconnu';
    }
  }


  applyFilters(): void {
    console.log('Filtrage avec:', this.searchMF, this.searchRS, this.searchTC);

    // Réinitialisation de la liste des employés avant chaque filtre
    this.clients = [];

    // Si aucun filtre n'est saisi, récupérer tous les employés
    if (!this.searchMF && !this.searchRS && !this.searchTC) {
      this.consulterclients();
      return;
    }

    const filterRequests = [];

    // Si un filtre de nom est spécifié
    if (this.searchMF) {
      filterRequests.push(
        this.clientservice.getClientByMF(this.searchMF).pipe(
          tap(data => {
            this.clientsMF = data || [];
            console.log('Résultats filtrés par MF:', this.clientsMF);
          })
        )
      );
    }

    // Si un filtre de CIN est spécifié
    if (this.searchRS) {
      filterRequests.push(
        this.clientservice.getClientByRS(this.searchRS).pipe(
          tap(data => {
            this.clientsRS = data || [];
            console.log('Résultats filtrés par CIN:', this.clientsRS);
          })
        )
      );
    }

    // Si un filtre de type de contrat est spécifié
    if (this.searchTC) {
      filterRequests.push(
        this.clientservice.getEmployesByTypeClient(this.searchTC).pipe(
          tap(data => {
            this.clientsTc = data || [];
            console.log('Résultats filtrés par Type Client:', this.clientsTc);
          })
        )
      );
    }

    // Si nous avons des filtres en attente, lancer les appels API
    forkJoin(filterRequests).subscribe(() => {
      // Après que toutes les requêtes soient terminées, fusionner les résultats
      this.mergeTables();
    });
  }

  // Fonction pour fusionner les employés en utilisant un Set pour éliminer les doublons
  mergeTables(): void {
    console.log('Fusion des résultats des filtres');

    // Créer une Map pour fusionner les résultats des filtres sans doublons
    const uniqueclientes = new Map<number, any>();

    // Ajouter les résultats du filtre par nom si disponibles
    if (this.clientsMF.length > 0) {
        this.clientsMF.forEach(emp => {
            uniqueclientes.set(emp.ID_Client, emp);
        });
    }

    // Ajouter les résultats du filtre par CIN si disponibles
    if (this.clientsRS.length > 0) {
        this.clientsRS.forEach(emp => {
            uniqueclientes.set(emp.ID_Client, emp);
        });
    }

    // Ajouter les résultats du filtre par TypeContrat si disponibles
    if (this.clientsTc.length > 0) {
        this.clientsTc.forEach(emp => {
            uniqueclientes.set(emp.ID_Client, emp);
        });
    }

    // Vérifier si un tableau est vide malgré une saisie dans le filtre
    const checkmf = !(this.clientsMF.length === 0 && this.searchMF);
    const checkrs = !(this.clientsRS.length === 0 && this.searchRS);
    const checktc = !(this.clientsTc.length === 0 && this.searchTC);

    console.log('Check MF:', checkmf);
    console.log('Check RS:', checkrs);
    console.log('Check TC:', checktc);

    // Si au moins un tableau est vide malgré une saisie, vider la liste des employés
    if (!checkmf || !checkrs || !checktc) {
        console.log('Aucun client ne correspond aux filtres');
        this.clients = []; // Vider la liste des employés
        return; // Sortir de la fonction
    }

 // Convertir la Map en tableau d'objets
 let mergedclientes = Array.from(uniqueclientes.values());

 // Ajout du filtrage final : conserver uniquement les employés communs
 if (this.searchMF) {
     mergedclientes = mergedclientes.filter(emp =>
         this.clientsMF.some(cinEmp => cinEmp.ID_Client === emp.ID_Client)
     );
 }
 if (this.searchRS) {
     mergedclientes = mergedclientes.filter(emp =>
         this.clientsRS.some(nameEmp => nameEmp.ID_Client === emp.ID_Client)
     );
 }
 if (this.searchTC) {
     mergedclientes = mergedclientes.filter(emp =>
         this.clientsTc.some(tcEmp => tcEmp.ID_Client === emp.ID_Client)
     );
 }

 // Mettre à jour la liste des employés
 this.clients = mergedclientes;

 console.log('Clients après filtrage final:', this.clients);
}

}
