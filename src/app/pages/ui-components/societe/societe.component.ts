import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Societe } from 'src/Models/societe';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-societe',
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
    MatSnackBarModule
  ],

  templateUrl: './societe.component.html',
  styleUrls: ['./societe.component.scss']
})
export class SocieteComponent implements OnInit {


  societe: Societe = {} as Societe;
  modeEdition: boolean = false;
  societeOriginal: Societe = {} as Societe;
  file: File;



  constructor(private societeService: SocieteService,private sanitizer: DomSanitizer,private snackBar: MatSnackBar,public authService: LoginService) {}

  ngOnInit(): void {
    console.log("Initialisation du composant...");
    this.consulterSociete();
  }

  consulterSociete(): void {
    console.log("Récupérer les paramètres de la société");
    this.societeService.getSocietes().subscribe({
        next: (data: Societe) => {
            this.societe = { ...data };
            this.societeOriginal={ ...data };
            console.log("Données de la société récupérées:", this.societe);
            console.log("Données de la société copié:", this.societeOriginal);

        },
        error: (err) => {
            console.log("Erreur lors de la récupération des données de la société", err);
        }
    });
  }




  // Gestion du fichier sélectionné
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Met à jour l'image dans l'objet societe
        this.societe.CachetSignature = e.target.result.split(',')[1];
        this.file = file;
        //.append('CachetSignature', file, file.name);

      };
      reader.readAsDataURL(file);
    }
  }



  updateSociete1() {
    console.log("l'appel",this.societe)
    console.log("Fichier sélectionné : ", this.file);
    if(this.file){
      this.societeService.updateSociete(this.societe.ID_Societe,this.societe,this.file)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Modification enregistrée avec succès', 'Fermer', {
            duration: 3000
          });
          console.log("Société mise à jour avec succès:", response);
        },
        error: (err: HttpErrorResponse) => {
          console.error("Erreur lors de la mise à jour de la société", err);
          if (err.error && err.error.errors) {
            console.log("Détails des erreurs de validation:", err.error.errors);
          }
        }
      });
    }
    const byteArray = new Uint8Array(this.societeOriginal.CachetSignature);

// Créer un Blob à partir du tableau d'octets
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Spécifiez le type MIME approprié

// Créer un fichier à partir du Blob
    const file = new File([blob], "CachetSignature.jpg", { type: 'image/jpeg' });
    this.societeService.updateSociete(this.societe.ID_Societe,this.societe,file)
      .subscribe({
        next: (response) => {
          console.log("Société mise à jour avec succès:", response);
          this.snackBar.open('Modification enregistrée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error("Erreur lors de la mise à jour de la société", err);
          if (err.error && err.error.errors) {
            console.log("Détails des erreurs de validation:", err.error.errors);
          }
        }
      });

  }


  cancelChanges(): void {
        console.log("Données de la société lors de l'annulation des changements:", this.societe);
        console.log("Données de la société copié lors de l'annulation des changements:", this.societeOriginal);
    this.societe = { ...this.societeOriginal }; // Restaurer les valeurs originales
    alert("Les modifications ont été annulées.");
    this.snackBar.open('Modifications annulées', 'Fermer', {
      duration: 3000
    });
  }

  showme(): void {
    console.log("Données de la société lors de l'appel de la méthode showme",this.societe);
    console.log("Données de la copie société lors de l'appel de la méthode showme",this.societeOriginal);
  }

}
