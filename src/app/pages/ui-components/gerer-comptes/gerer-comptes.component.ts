import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTable, MatTableModule } from '@angular/material/table';
import { UtilisateurService } from 'src/app/services/utilisateur/utilisateur.service';
import { Role, Utilisateur } from 'src/Models/utilisateur';
import { AddUtilisateurComponent } from '../add-utilisateur/add-utilisateur.component';

@Component({
  selector: 'app-gerer-comptes',
  standalone: true,
  imports: [CommonModule, MatTable, MatMenuModule, MatHeaderCell, MatCell, MatIcon, MatHeaderRow, MatRow, MatTableModule, MatSelect, MatOption],
  templateUrl: './gerer-comptes.component.html',
  styleUrl: './gerer-comptes.component.scss'
})
export class GererComptesComponent implements OnInit {

  utilisateurs: Utilisateur[] = [];
  utilisateurForm: FormGroup;
  displayedColumns: string[] = ['Nom_Utilisateur', 'Role_Utilisateur', 'actions'];
  selectedUtilisateur: Utilisateur | null = null;

  isLoading = false;
  selectedRole: { [key: number]: Role } = {}; // Stocke le rôle sélectionné de chaque utilisateur
  isEditing: { [key: number]: boolean } = {}; // Pour savoir si un utilisateur est en mode édition
  //roles = Object.values(Role); // Récupère les rôles sous forme de tableau

  roles = [Role.SuperAdmin, Role.Admin, Role.User];  // Assurez-vous de spécifier les rôles directement

  constructor(
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  // Charger la liste des utilisateurs
  private loadUtilisateurs(): void {
    this.isLoading = true;
    this.utilisateurService.getAllUtilisateurs().subscribe(
      (data) => {
        this.utilisateurs = data;
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Erreur lors de la récupération des utilisateurs.', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  // Ouvrir le mode édition pour un utilisateur
  onEdit(utilisateur: Utilisateur): void {
    this.isEditing[utilisateur.ID_Utilisateur] = true; // Active le mode édition
    this.selectedRole[utilisateur.ID_Utilisateur] = utilisateur.Role_Utilisateur; // Sauvegarde le rôle actuel pour la sélection
  }

  // Enregistrer les modifications de l'utilisateur (mise à jour du rôle)
  onSave(utilisateur: Utilisateur): void {
    utilisateur.Role_Utilisateur = this.selectedRole[utilisateur.ID_Utilisateur]; // Met à jour le rôle de l'utilisateur

    this.utilisateurService.updateUtilisateur(utilisateur).subscribe(
      () => {
        this.snackBar.open('Utilisateur modifié avec succès.', 'Fermer', { duration: 3000 });
        this.loadUtilisateurs();
        this.isEditing[utilisateur.ID_Utilisateur] = false; // Désactive le mode édition
      },
      (error) => {
        this.snackBar.open('Erreur lors de la modification de l\'utilisateur.', 'Fermer', { duration: 3000 });
      }
    );
  }



  // Changer le rôle d'un utilisateur
  onRoleChange(utilisateur: Utilisateur): void {
    // Cette fonction est déclenchée à chaque changement de sélection de rôle
    console.log(`Le rôle de l'utilisateur ${utilisateur.Nom_Utilisateur} a été modifié.`);
  }

  // Supprimer un utilisateur
  onDelete(utilisateur: Utilisateur): void {


    if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      this.utilisateurService.deleteUtilisateur(utilisateur).subscribe(() => {
        this.loadUtilisateurs();
        this.snackBar.open('Utilisateur supprimé avec succès.', 'Fermer', { duration: 3000 });
      });
    }
  }

  // Fonction pour convertir le rôle en chaîne lisible
  convertRoleToString(role: Role): string {
    if (typeof role === 'string') {
      // Si role est une chaîne de caractères, on le convertit en un Role valide
      switch (role) {
        case Role.SuperAdmin:
          return 'Super Admin';
        case Role.Admin:
          return 'Admin';
        case Role.User:
          return 'User';
        default:
          return 'Unknown';
      }
    }

    // Sinon, si c'est déjà un Role
    switch (role) {
      case Role.SuperAdmin:
        return 'Super Admin';
      case Role.Admin:
        return 'Admin';
      case Role.User:
        return 'User';
      default:
        return 'Unknown';
    }
  }



  // Ajouter un utilisateur
  onAddUser(): void {
    const dialogRef = this.dialog.open(AddUtilisateurComponent, {
      width: '500px'
    });

    // Réagir à la fermeture du modal
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUtilisateurs(); // Recharger les utilisateurs après ajout
      }
    });
  }
}
