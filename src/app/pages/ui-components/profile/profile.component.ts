import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilisateurService } from 'src/app/services/utilisateur/utilisateur.service';
import { Role, Utilisateur } from 'src/Models/utilisateur';
import { PasswordModalComponent } from '../password-modal/password-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ CommonModule,
      MatFormFieldModule,
      MatSelectModule,
      FormsModule,
      ReactiveFormsModule,
      MatRadioModule,
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatCheckboxModule,
      MatSnackBarModule,MatError
    ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user: Utilisateur | null = null; // Pour stocker les données de l'utilisateur
  userId: number | null = null; // ID de l'utilisateur (récupéré depuis le localStorage)
  isEditing: boolean = false;
  allUsers: Utilisateur[] = [];
  pseudoError: boolean = false;
  emailError: boolean = false;
  nomError: boolean = false;

  constructor(private utilisateurService: UtilisateurService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis le localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10); // Convertir l'ID en nombre
      this.getUserProfile(this.userId); // Appeler la fonction pour récupérer les données utilisateur
    }
    this.getAllUtilisateurs();
  }

  getAllUtilisateurs(): void {
    this.utilisateurService.getAllUtilisateurs().subscribe(
      (users: Utilisateur[]) => {
        // Exclure l'utilisateur actuel
        this.allUsers = users.filter((u) => u.ID_Utilisateur !== this.userId);
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  validateUniqueFields(): void {
    if (!this.user) return;

    const pseudoTrimmed = this.user.Pseudo?.trim().toLowerCase();
    const emailTrimmed = this.user.Email_Utilisateur?.trim().toLowerCase();
    const nomTrimmed = this.user.Nom_Utilisateur?.trim().toLowerCase();

    // Validation des erreurs
    this.pseudoError = pseudoTrimmed!=null && this.allUsers.some((u) => u.Pseudo.trim().toLowerCase() === pseudoTrimmed);
    this.emailError = emailTrimmed!=null && this.allUsers.some((u) => u.Email_Utilisateur.trim().toLowerCase() === emailTrimmed);
    this.nomError = nomTrimmed!=null && this.allUsers.some((u) => u.Nom_Utilisateur.trim().toLowerCase() === nomTrimmed);

    console.log('Pseudo Error:', this.pseudoError); // Debugging
    console.log('Email Error:', this.emailError);  // Debugging
    console.log('Nom Error:', this.nomError);      // Debugging

    // Forcer la mise à jour de l'affichage après modification des erreurs
    this.cdr.detectChanges();
  }

  toggleEdit() {


    if (this.isEditing) {
      // Enregistrer les modifications

      console.log(this.user)
      this.utilisateurService.updateUtilisateur(this.user!).subscribe(() => {
        alert('Utilisateur mis à jour avec succès.');
        this.isEditing = false;
      });
    } else {
      // Activer l'édition
      this.isEditing = true;
    }
  }

  canSave(): boolean {
    // Bouton désactivé si champs vides ou erreurs d'unicité
    return (
      !!this.user?.Pseudo &&
      !!this.user?.Email_Utilisateur &&
      !!this.user?.Nom_Utilisateur &&
      !this.pseudoError &&
      !this.emailError &&
      !this.nomError
    );
  }

  // Fonction pour récupérer les détails de l'utilisateur par ID
  getUserProfile(id: number): void {
    this.utilisateurService.getUtilisateurById(id).subscribe(
      (user: Utilisateur) => {
        const mdp = localStorage.getItem('mdp');
        if(mdp)
        user.MotDePasse_Utilisateur = mdp;
        this.user = user; // Stocker les données utilisateur dans la variable 'user'

        console.log(mdp);
       ;
      },
      (error) => {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    );
  }

   // Méthode pour obtenir le texte lisible à partir de l'énumération
  // Méthode pour obtenir le texte lisible à partir de l'entier du rôl

  getRoleText(type: number): string {
    switch (type) {
      case 0:
        return 'Super Administrateur';
      case 1:
        return 'Administrateur';
      case 2:
        return 'Utilisateur';
      default:
        return 'Inconnu';
    }
  }

  openPasswordModal() {
    const dialogRef = this.dialog.open(PasswordModalComponent, {
      width: '400px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        alert('Mot de passe mis à jour avec succès.');
      }
    });
  }
}
