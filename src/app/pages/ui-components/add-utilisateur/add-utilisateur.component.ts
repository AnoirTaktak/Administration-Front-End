import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilisateurService } from 'src/app/services/utilisateur/utilisateur.service';
import { Role, Utilisateur } from 'src/Models/utilisateur';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-add-utilisateur',
  templateUrl: './add-utilisateur.component.html',
  styleUrls: ['./add-utilisateur.component.scss'],
})
export class AddUtilisateurComponent implements OnInit {
  addUtilisateurForm!: FormGroup;
  roles = [Role.SuperAdmin, Role.Admin, Role.User]; // Liste des rôles

  existingEmails: string[] = [];
  existingUsernames: string[] = [];
  existingNames: string[] = [];  // Liste des noms existants

  constructor(
    public dialogRef: MatDialogRef<AddUtilisateurComponent>,
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.loadExistingUsersData();

    // Initialisation du formulaire
    this.addUtilisateurForm = this.fb.group({
      Nom_Utilisateur: [
        '',
        [Validators.required, this.uniqueValidator(this.existingNames, 'nomNotUnique')],
      ],
      Pseudo: [
        '',
        [Validators.required, this.uniqueValidator(this.existingUsernames, 'pseudoNotUnique')],
      ],
      Email_Utilisateur: [
        '',
        [
          Validators.required,
          Validators.email,
          this.uniqueValidator(this.existingEmails, 'emailNotUnique'),
        ],
      ],
      MotDePasse_Utilisateur: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'),
        ],
      ],
      Role_Utilisateur: [Role.User, Validators.required],
    });
  }

  // Charger les utilisateurs existants pour vérifier les doublons
  loadExistingUsersData(): void {
    this.utilisateurService.getAllUtilisateurs().subscribe(
      (utilisateurs) => {
        this.existingEmails = utilisateurs.map((user) => user.Email_Utilisateur);
        console.log(this.existingEmails)
        this.existingUsernames = utilisateurs.map((user) => user.Pseudo);
        console.log(this.existingUsernames)
        this.existingNames = utilisateurs.map((user) => user.Nom_Utilisateur);
        console.log(this.existingNames)

      // Mettre à jour les validateurs des champs
      this.addUtilisateurForm.get('Nom_Utilisateur')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingNames, 'nomNotUnique')
      ]);
      this.addUtilisateurForm.get('Nom_Utilisateur')?.updateValueAndValidity();

      this.addUtilisateurForm.get('Email_Utilisateur')?.setValidators([
        Validators.email,
        this.uniqueValidator(this.existingEmails, 'emailNotUnique')
      ]);
      this.addUtilisateurForm.get('Email_Utilisateur')?.updateValueAndValidity();

      this.addUtilisateurForm.get('Pseudo')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingUsernames, 'pseudoNotUnique')
      ]);
      this.addUtilisateurForm.get('Pseudo')?.updateValueAndValidity();
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    );
  }

  // Vérifier si le champ est invalide
  isFieldInvalid(field: string): boolean {
    const control = this.addUtilisateurForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // Validateur unique pour vérifier les doublons (pseudo, email, nom)
  uniqueValidator(existingValues: string[], errorKey: string) {
    return (control: AbstractControl) => {
      return existingValues.includes(control.value)
        ? { [errorKey]: true }
        : null;
    };
  }

  // Sauvegarder les données du formulaire
  save(): void {
    if (this.addUtilisateurForm.valid) {
      const formData = { ...this.addUtilisateurForm.value };
      formData.Role_Utilisateur = +formData.Role_Utilisateur; // Convertir le rôle en entier

      this.utilisateurService.addUtilisateur(formData).subscribe({
        next: () => {this.dialogRef.close(true); this.printUserDetails(formData.Pseudo, formData.MotDePasse_Utilisateur);} ,
        error: (err) => console.error('Erreur lors de l\'ajout de l\'utilisateur:', err),
      });
    }
  }

  printUserDetails(pseudo: string, motDePasse: string): void {
    // Créer un nouveau contenu HTML pour l'impression
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write('<html><head><title>Impression Utilisateur</title></head><body>');
    printWindow?.document.write('<h3>Détails Utilisateur</h3>');
    printWindow?.document.write(`<p><strong>Pseudo:</strong> ${pseudo}</p>`);
    printWindow?.document.write(`<p><strong>Mot de Passe:</strong> ${motDePasse}</p>`);
    printWindow?.document.write('</body></html>');

    // Lancer la fenêtre d'impression
    printWindow?.document.close();
    printWindow?.print();
  }

  // Fermer la fenêtre modale sans enregistrer
  close(): void {
    this.dialogRef.close(false);
  }
}
