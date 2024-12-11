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
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { Fournisseur } from 'src/Models/fournisseur';
import { EditFournisseurComponent } from '../edit-fournisseur/edit-fournisseur.component';
import { AddFournisseurComponent } from '../add-fournisseur/add-fournisseur.component';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-fournisseur',
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
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent implements OnInit {
  displayedColumns: string[] = ['mf','rs','tel','email', 'adresse', 'type','actions'];
  Fournisseurs: Fournisseur[] = []; // Liste des Fournisseurs
  FournisseursMF: Fournisseur[] = []; // Liste des Fournisseurs recherchez by mf
  FournisseursRS: Fournisseur[] = []; // Liste des Fournisseurs recherchez by rs
  FournisseursTc: Fournisseur[] = []; // Liste des Fournisseurs recherche by type
  modeEdition: boolean = false;
  FournisseurOriginal: Fournisseur = {} as Fournisseur;
  filters :any ={};
  searchMF: string = '';
  searchRS: string = '';
  searchTC: string = '';

  constructor(
    private Fournisseurservice: FournisseurService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.consulterFournisseurs();
    console.log(this.Fournisseurs)
  }

  consulterFournisseurs(): void {
    this.Fournisseurservice.getAllFournisseurs().subscribe({
      next: (data: Fournisseur[]) => {
        this.Fournisseurs = [...data];
        console.log(this.Fournisseurs);
        this.Fournisseurs = this.Fournisseurs;
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la récupération des fournisseurs.', 'Fermer', { duration: 3000 });
        console.log(err.message)
      },
    });
  }

  openEditDialog(Fournisseur: Fournisseur): void {


    const dialogRef = this.dialog.open(EditFournisseurComponent, {
        panelClass: 'custom-dialog',
        width: '80%',
        data: Fournisseur
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterFournisseurs();
      }
    });
  }

  openAddDialog(): void {


    const dialogRef = this.dialog.open(AddFournisseurComponent, {
        panelClass: 'custom-dialog',
        width: '80%',
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterFournisseurs();
      }
    });
  }

  deleteFournisseur(id: number): void {
    console.log(id)
    if (confirm('Voulez-vous vraiment supprimer ce Fournisseur ?')) {
      this.Fournisseurservice.deleteFournisseur(id).subscribe({
        next: () => {
          this.snackBar.open('Fournisseur supprimé avec succès.', 'Fermer', { duration: 3000 });
          this.Fournisseurs = this.Fournisseurs.filter(e => e.ID_Fournisseur != id);
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
    this.Fournisseurs = [];

    // Si aucun filtre n'est saisi, récupérer tous les employés
    if (!this.searchMF && !this.searchRS && !this.searchTC) {
      this.consulterFournisseurs();
      return;
    }

    const filterRequests = [];

    // Si un filtre de nom est spécifié
    if (this.searchMF) {
      filterRequests.push(
        this.Fournisseurservice.getFournisseurByMF(this.searchMF).pipe(
          tap(data => {
            this.FournisseursMF = data || [];
            console.log('Résultats filtrés par MF:', this.FournisseursMF);
          })
        )
      );
    }

    // Si un filtre de CIN est spécifié
    if (this.searchRS) {
      filterRequests.push(
        this.Fournisseurservice.getFournisseurByRS(this.searchRS).pipe(
          tap(data => {
            this.FournisseursRS = data || [];
            console.log('Résultats filtrés par CIN:', this.FournisseursRS);
          })
        )
      );
    }

    // Si un filtre de type de contrat est spécifié
    if (this.searchTC) {
      filterRequests.push(
        this.Fournisseurservice.getFournisseurByTypeFournisseur(this.searchTC).pipe(
          tap(data => {
            this.FournisseursTc = data || [];
            console.log('Résultats filtrés par Type Fournisseur:', this.FournisseursTc);
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
    const uniqueFournisseures = new Map<number, any>();

    // Ajouter les résultats du filtre par nom si disponibles
    if (this.FournisseursMF.length > 0) {
        this.FournisseursMF.forEach(emp => {
            uniqueFournisseures.set(emp.ID_Fournisseur, emp);
        });
    }

    // Ajouter les résultats du filtre par CIN si disponibles
    if (this.FournisseursRS.length > 0) {
        this.FournisseursRS.forEach(emp => {
            uniqueFournisseures.set(emp.ID_Fournisseur, emp);
        });
    }

    // Ajouter les résultats du filtre par TypeContrat si disponibles
    if (this.FournisseursTc.length > 0) {
        this.FournisseursTc.forEach(emp => {
            uniqueFournisseures.set(emp.ID_Fournisseur, emp);
        });
    }

    // Vérifier si un tableau est vide malgré une saisie dans le filtre
    const checkmf = !(this.FournisseursMF.length === 0 && this.searchMF);
    const checkrs = !(this.FournisseursRS.length === 0 && this.searchRS);
    const checktc = !(this.FournisseursTc.length === 0 && this.searchTC);

    console.log('Check MF:', checkmf);
    console.log('Check RS:', checkrs);
    console.log('Check TC:', checktc);

    // Si au moins un tableau est vide malgré une saisie, vider la liste des employés
    if (!checkmf || !checkrs || !checktc) {
        console.log('Aucun Fournisseur ne correspond aux filtres');
        this.Fournisseurs = []; // Vider la liste des employés
        return; // Sortir de la fonction
    }

 // Convertir la Map en tableau d'objets
 let mergedFournisseures = Array.from(uniqueFournisseures.values());

 // Ajout du filtrage final : conserver uniquement les employés communs
 if (this.searchMF) {
     mergedFournisseures = mergedFournisseures.filter(emp =>
         this.FournisseursMF.some(cinEmp => cinEmp.ID_Fournisseur === emp.ID_Fournisseur)
     );
 }
 if (this.searchRS) {
     mergedFournisseures = mergedFournisseures.filter(emp =>
         this.FournisseursRS.some(nameEmp => nameEmp.ID_Fournisseur === emp.ID_Fournisseur)
     );
 }
 if (this.searchTC) {
     mergedFournisseures = mergedFournisseures.filter(emp =>
         this.FournisseursTc.some(tcEmp => tcEmp.ID_Fournisseur === emp.ID_Fournisseur)
     );
 }

 // Mettre à jour la liste des employés
 this.Fournisseurs = mergedFournisseures;

 console.log('Fournisseurs après filtrage final:', this.Fournisseurs);
}

}
