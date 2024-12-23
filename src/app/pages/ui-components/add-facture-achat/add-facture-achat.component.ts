import { Component, OnInit } from '@angular/core';
import { FactureAchat } from 'src/Models/factureAchat';
import { Fournisseur } from 'src/Models/fournisseur';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FactureAchatService } from 'src/app/services/factureAchat/facture-achat.service';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageDialogComponent } from '../view-image-dialog/view-image-dialog.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-facture-achat',
  standalone :true,
    imports:[
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
        MatDatepickerModule

    ],
  templateUrl: './add-facture-achat.component.html',
  styleUrls: ['./add-facture-achat.component.scss']
})
export class AddFactureAchatComponent implements OnInit {
  factureAchatForm: FormGroup;
  fournisseurs: Fournisseur[] = [];
  file: File;
  imageVisible: boolean = false;
  selectedFile: any | null = null;

  constructor(
    private factureAchatService: FactureAchatService,
    private fournisseurService: FournisseurService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFournisseurs();
  }

  initForm(): void {
    this.factureAchatForm = this.fb.group({
      Numero_FactureAchat: ['', [Validators.required]],
      DateAchat: ['', [Validators.required]],
      ID_Fournisseur: ['', [Validators.required]],
      Montant: ['', [Validators.required]],
      EtatPaiement: [false, [Validators.required]],
      ImageFacture: [null]
    });
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


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Créer une URL pour le fichier sélectionné
      const fileUrl = URL.createObjectURL(file);

      // Mettre à jour l'objet fichier et l'URL
      this.file = file;
      this.selectedFile = fileUrl;  // On garde l'URL pour l'affichage dans le modal
    }
  }

  toggleImageVisibility(): void {
    this.imageVisible = !this.imageVisible;
  }

  openFactureModal(): void {
    if (this.selectedFile) {
      this.dialog.open(ViewImageDialogComponent, {
        data: { file: this.selectedFile },  // Passer la chaîne base64
        width: '80%',
        height: '80%'
      });
    } else {
      this.snackBar.open('Aucun fichier sélectionné.', 'Fermer', { duration: 3000 });
    }
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


  onSubmit(): void {
    if (this.factureAchatForm.invalid) {
      this.snackBar.open('Formulaire invalide. Veuillez vérifier tous les champs.', 'Fermer', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('Numero_FactureAchat', this.factureAchatForm.get('Numero_FactureAchat')?.value);
    formData.append('DateAchat', new Date(this.factureAchatForm.value.DateAchat).toISOString().split('T')[0]);
    formData.append('ID_Fournisseur', this.factureAchatForm.get('ID_Fournisseur')?.value);
    formData.append('Montant', this.factureAchatForm.get('Montant')?.value);
    formData.append('EtatPaiement', this.factureAchatForm.get('EtatPaiement')?.value.toString());

    // Ajouter l'image de la facture
    if (this.file) {
      formData.append('ImageFacture', this.file, this.file.name);
    }

    // Appel du service pour ajouter la facture d'achat
    this.factureAchatService.addFactureAchat(formData).subscribe({
      next: (response) => {
        this.dialog.closeAll();
        this.snackBar.open('Facture d\'achat ajoutée avec succès!', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la facture', err);
        this.snackBar.open('Erreur lors de l\'ajout de la facture', 'Fermer', { duration: 3000 });
      }
    });
  }
}
