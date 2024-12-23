import { Component, Inject, OnInit } from '@angular/core';

import { FactureAchat } from 'src/Models/factureAchat';
import { Fournisseur } from 'src/Models/fournisseur';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FactureAchatService } from 'src/app/services/factureAchat/facture-achat.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard, MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { ViewImageDialogComponent } from '../view-image-dialog/view-image-dialog.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-facture-achat',
  standalone :true,
  imports:[CommonModule,
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
      MatDatepickerModule

  ],
  templateUrl: './edit-facture-achat.component.html',
  styleUrls: ['./edit-facture-achat.component.scss']
})
export class EditFactureAchatComponent implements OnInit {

  factureAchat: FactureAchat = {} as FactureAchat;
  fournisseurs: Fournisseur[] = [];
  imageVisible: boolean = false;
  file: File;


  constructor(
    private factureAchatService: FactureAchatService,
    private fournisseurService: FournisseurService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: FactureAchat,

  ) {}

  ngOnInit(): void {
    this.factureAchat = this.data
    this.loadFournisseurs();
  }



  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des fournisseurs', err);
      }
    });
  }

  toggleImageVisibility(): void {
    this.imageVisible = !this.imageVisible;
  }

  updateFactureAchat(): void {
    const formData = new FormData();

    // Ajoutez les propriétés de FactureAchat à FormData
    formData.append('ID_FactureAchat', this.factureAchat.ID_FactureAchat.toString());
    formData.append('ID_Fournisseur', this.factureAchat.ID_Fournisseur.toString());
    formData.append('DateAchat', new Date(this.factureAchat.DateAchat).toISOString().split('T')[0]);
    formData.append('Montant', this.factureAchat.Montant.toString());
    formData.append('Numero_FactureAchat', this.factureAchat.Numero_FactureAchat);
    formData.append('EtatPaiement', this.factureAchat.EtatPaiement.toString());


    // Gestion du fichier ImageFacture
  if (this.file) {
    // Nouveau fichier sélectionné par l'utilisateur
    formData.append('ImageFacture', this.file, this.file.name);
  } else if (this.factureAchat.ImageFacture) {
    // Fichier existant dans `factureAchat.ImageFacture` (sous forme de byte array)
    const mimeType = this.getMimeTypeFromBytes(this.factureAchat.ImageFacture);
    const extension = mimeType === 'application/pdf' ? 'pdf' : 'png'; // Ajoutez des extensions au besoin
    const blob = new Blob([new Uint8Array(this.factureAchat.ImageFacture)], { type: mimeType });
    formData.append('ImageFacture', blob, `facture.${extension}`);
  }

    console.log('FormData values:');
    formData.forEach((value, key) => console.log(key, value));
    // Appelez le service avec FormData
    this.factureAchatService.updateFactureAchat(this.factureAchat.ID_FactureAchat, formData).subscribe({
      next: (response) => {
        this.dialog.closeAll();
        this.snackBar.open('Facture mise à jour avec succès', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la facture', err);
        this.snackBar.open('Erreur lors de la mise à jour de la facture', 'Fermer', { duration: 3000 });
      }
    });
  }



  openFactureModal(file: Uint8Array): void {

      const fileType = this.getMimeTypeFromBytes(file);
      this.dialog.open(ViewImageDialogComponent, {
        data: { file },
        width: '80%',
        height: '80%'
      });
    }
    
    getMimeTypeFromBytes(bytes: Uint8Array): string {
      const signature = Array.from(bytes.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
      switch (signature) {
        case '89504e47': // PNG
          return 'image/png';
        case '25504446': // PDF
          return 'application/pdf';
        case 'ffd8ffe0': // JPEG
        case 'ffd8ffe1':
        case 'ffd8ffe2':
          return 'image/jpeg';
        default:
          return 'application/octet-stream'; // Par défaut si non reconnu
      }
    }


    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Met à jour l'image dans l'objet
          this.factureAchat.ImageFacture = e.target.result.split(',')[1];
          this.file = file;


        };
        reader.readAsDataURL(file);
      }
    }


  cancelChanges(): void {
    // Logique pour annuler les modifications
    this.snackBar.open('Modifications annulées', 'Fermer', { duration: 3000 });
  }
}
