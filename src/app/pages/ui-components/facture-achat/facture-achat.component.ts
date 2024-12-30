import { CommonModule } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardImage, MatCardModule } from '@angular/material/card';
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

import { catchError, forkJoin, map, mergeMap, of, tap } from 'rxjs';
import { FactureAchatService } from 'src/app/services/factureAchat/facture-achat.service';
import { FactureAchat } from 'src/Models/factureAchat';
import { EditFactureAchatComponent } from '../edit-facture-achat/edit-facture-achat.component';
import { AddFactureAchatComponent } from '../add-facture-achat/add-facture-achat.component';
import { MatDatepicker, matDatepickerAnimations, MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { ViewImageDialogComponent } from '../view-image-dialog/view-image-dialog.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-facture-achat',
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
    MatDatepicker,
    MatDatepickerModule
  ],
  templateUrl: './facture-achat.component.html',
  styleUrls: ['./facture-achat.component.scss']
})
export class FactureAchatComponent {

  displayedColumns: string[] = ['numero', 'date', 'fournisseur', 'montant', 'actions'];
  factures: FactureAchat[] = []; // Liste des factures
  copiefactures: FactureAchat[] = []; // Liste des factures
  facturesFournisseur: FactureAchat[] = [];
  facturesEtatPaiement: FactureAchat[] = [];
  facturesDateRange: FactureAchat[] = [];
  filteredFactures: FactureAchat[] = []; // Liste filtrée
  searchEtatPaiement: boolean   ;
  searchFournisseur : string;
  dateDebut :string;
  dateFin : string;
  isLoading: boolean = false;
  pdfUrl: string | null = null;
  safeUrl: SafeResourceUrl;


  constructor(
    private factureAchatService: FactureAchatService,
    private fourServ: FournisseurService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,public authService: LoginService
  ) {}

  ngOnInit(): void {
    this.consulterFactures();



  }



  consulterFactures(): void {
    this.factureAchatService.getAllFacturesAchat().pipe(
      mergeMap(factures => {
        this.factures = factures;
        console.log('Factures récupérées:', factures); // Vérification des factures récupérées
        const fournisseurRequests = factures.map(f =>
          this.fourServ.getFournisseurById(f.ID_Fournisseur).pipe(
            tap(data => {
              f.RaisonSocialeFournisseur = data.RaisonSociale_Fournisseur;
              console.log('Fournisseur récupéré:', data); // Vérification des fournisseurs récupérés
            })
          )
        );
        return forkJoin(fournisseurRequests);
      })
    ).subscribe({
      next: () => {
        // Vérifiez après la récupération de toutes les données
        console.log('Factures après traitement:', this.factures);
        this.filteredFactures = [...this.factures];
        this.copiefactures = this.factures; // Copie des factures

      },
      error: err => {
        this.snackBar.open('Erreur lors de la récupération des factures.', 'Fermer', { duration: 3000 });
        console.error(err);
      }
    });
  }




  applyFilters(): void {
    console.log(this.copiefactures)

    console.log('Filtrage avec:', this.searchFournisseur, this.searchEtatPaiement, this.dateDebut, this.dateFin);

    // Réinitialisation de la liste des factures avant chaque filtre
    this.factures = [];

    // Si aucun filtre n'est saisi, récupérer toutes les factures
    if (!this.searchFournisseur && (this.searchEtatPaiement == undefined) && !this.dateDebut && !this.dateFin) {
      this.consulterFactures();
      return;
    }

    const filterRequests = [];


    // Si un filtre de fournisseur est spécifié
    if (this.searchFournisseur) {
      // Vérifier si la valeur de searchFournisseur est définie et affichage dans la console
      console.log('Filtrage par fournisseur, recherche de:', this.searchFournisseur);

      this.facturesFournisseur = this.copiefactures.filter(c =>
        c.RaisonSocialeFournisseur?.toLowerCase().includes(this.searchFournisseur.toLowerCase())

      );

      this.facturesFournisseur.forEach(facture => {
        console.log('Facture:', facture); // Afficher chaque facture
      });
      filterRequests.push(this.facturesFournisseur)
    }


    // Si un filtre d'état de paiement est spécifié
   // Si un filtre d'état de paiement est spécifié
  if (this.searchEtatPaiement !== undefined) {
    filterRequests.push(
      this.factureAchatService.getFacturesAchatByEtat(this.searchEtatPaiement).pipe(
        mergeMap(factures => {
          // Ajouter RaisonSocialeFournisseur pour chaque facture
          const fournisseurRequests = factures.map(f =>
            this.fourServ.getFournisseurById(f.ID_Fournisseur).pipe(
              tap(data => f.RaisonSocialeFournisseur = data.RaisonSociale_Fournisseur)
            )
          );
          return forkJoin(fournisseurRequests).pipe(
            // Retourner les factures enrichies avec RaisonSocialeFournisseur
            map(() => factures)
          );
        }),
        tap(factures => {
          this.facturesEtatPaiement = factures || [];
          console.log('Résultats filtrés par état de paiement:', this.facturesEtatPaiement);
        })
      )
    );
  }




    // Si un filtre d'intervalle de dates est spécifié
  // Si un filtre d'intervalle de dates est spécifié
if (this.dateDebut || this.dateFin) {
  const dateRangeParams: any = {};
  if (this.dateDebut) {
    dateRangeParams.startDate = new Date(this.dateDebut).toISOString().split('T')[0]; // Format YYYY-MM-DD
  }
  if (this.dateFin) {
    dateRangeParams.endDate = new Date(this.dateFin).toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  filterRequests.push(
    this.factureAchatService.getFacturesAchatByDateRange(dateRangeParams).pipe(
      mergeMap(factures => {
        // Ajouter RaisonSocialeFournisseur pour chaque facture
        const fournisseurRequests = factures.map(f =>
          this.fourServ.getFournisseurById(f.ID_Fournisseur).pipe(
            tap(data => f.RaisonSocialeFournisseur = data.RaisonSociale_Fournisseur)
          )
        );
        return forkJoin(fournisseurRequests).pipe(
          // Retourner les factures enrichies avec RaisonSocialeFournisseur
          map(() => factures)
        );
      }),
      tap(factures => {
        this.facturesDateRange = factures || [];
        console.log('Résultats filtrés par intervalle de dates:', this.facturesDateRange);
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

  // Fonction pour fusionner les factures en utilisant un Set pour éliminer les doublons
  mergeTables(): void {
    console.log('Fusion des résultats des filtres');

    const uniqueFactures = new Map<number, any>();

    // Ajouter les résultats des différents filtres si disponibles
    if (this.facturesFournisseur?.length) {
      this.facturesFournisseur.forEach(facture => uniqueFactures.set(facture.ID_FactureAchat, facture));
    }
    if (this.facturesEtatPaiement?.length) {
      this.facturesEtatPaiement.forEach(facture => uniqueFactures.set(facture.ID_FactureAchat, facture));
    }
    if (this.facturesDateRange?.length) {
      this.facturesDateRange.forEach(facture => uniqueFactures.set(facture.ID_FactureAchat, facture));
    }

    // Vérifier si un tableau est vide malgré une saisie dans le filtre
    const checkFournisseur = !(this.facturesFournisseur?.length === 0 && this.searchFournisseur);
    const checkEtatPaiement = !(this.facturesEtatPaiement?.length === 0 && (this.searchEtatPaiement !== null && this.searchEtatPaiement !== undefined));
    const checkDateRange = !(this.facturesDateRange?.length === 0 && this.dateDebut && this.dateFin);

    if (!checkFournisseur || !checkEtatPaiement || !checkDateRange) {
      console.log('Aucune facture ne correspond aux filtres');
      this.factures = []; // Vider la liste des factures
      return;
    }

    // Fusionner les résultats pour obtenir les factures communes
    let mergedFactures = Array.from(uniqueFactures.values());

    if (this.searchFournisseur) {
      mergedFactures = mergedFactures.filter(facture =>
        this.facturesFournisseur.some(f => f.ID_FactureAchat === facture.ID_FactureAchat)
      );
    }
    if (this.searchEtatPaiement !== undefined) {
      mergedFactures = mergedFactures.filter(facture =>
        this.facturesEtatPaiement.some(f => f.ID_FactureAchat === facture.ID_FactureAchat)
      );
    }
    if (this.dateDebut || this.dateFin) {
      mergedFactures = mergedFactures.filter(facture =>
        this.facturesDateRange.some(f => f.ID_FactureAchat === facture.ID_FactureAchat)
      );
    }

    // Mettre à jour la liste des factures
    this.factures = mergedFactures;

    console.log('Factures après filtrage final:', this.factures);
    console.log('Factures avant fusion par état de paiement:', this.facturesEtatPaiement);

  }


  openEditDialog(facture: FactureAchat): void {
    const dialogRef = this.dialog.open(EditFactureAchatComponent, {
      panelClass: 'custom-dialog',
      width: '80%',
      data: facture,
    });


    dialogRef.afterClosed().subscribe(result => {

        // Rafraîchir les données après la modification
        this.consulterFactures();

    });

  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddFactureAchatComponent, {
      panelClass: 'custom-dialog',
      width: '80%',
    });


    dialogRef.afterClosed().subscribe(result => {

        // Rafraîchir les données après la modification
        this.consulterFactures();

    });

  }

  deleteFacture(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette facture ?')) {
      this.factureAchatService.deleteFactureAchat(id).subscribe({
        next: () => {
          this.snackBar.open('Facture supprimée avec succès.', 'Fermer', { duration: 3000 });
          this.factures = this.factures.filter(f => f.ID_FactureAchat !== id);
          this.filteredFactures = this.factures;
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
          console.error(err);
        },
      });
    }
  }

  getMimeTypeFromBytes(fileBytes: Uint8Array): string {
    const header = fileBytes.slice(0, 4).toString();
    switch (header) {
      case '37,80,68,70': // PDF
        return 'application/pdf';
      case '137,80,78,71': // PNG
        return 'image/png';
      case '255,216,255,224': // JPEG
      case '255,216,255,225':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
  }

  openFactureModal(file: Uint8Array): void {
    const fileType = this.getMimeTypeFromBytes(file);
    this.dialog.open(ViewImageDialogComponent, {
      data: { file },
      width: '80%',
      height: '80%'
    });
  }



}


