import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UtilisateurService } from 'src/app/services/utilisateur/utilisateur.service';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent {
  oldPassword: string = '';
  newPassword: string = '';
  passwordPattern: string = '^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$';

  constructor(
    private dialogRef: MatDialogRef<PasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UtilisateurService
  ) {}

  // Vérifier si le mot de passe contient au moins une majuscule
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  // Vérifier si le mot de passe contient un chiffre
  hasNumber(): boolean {
    return /\d/.test(this.newPassword);
  }

  // Vérifier si le mot de passe contient un caractère spécial
  hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.newPassword);
  }

  // Valider l'ancien mot de passe (comparaison avec le localStorage)
  isOldPasswordValid(): boolean {
    const storedPassword = localStorage.getItem('mdp');
    return storedPassword === this.oldPassword;
  }

  // Vérifier si le formulaire est valide
  isFormValid(): boolean {
    return (
      this.isOldPasswordValid() &&
      this.hasUpperCase() &&
      this.hasNumber() &&
      this.hasSpecialChar() &&
      this.newPassword.length >= 6
    );
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.isOldPasswordValid()) {
      alert('Ancien mot de passe incorrect');
      return;
    }

    // Mettre à jour le mot de passe de l'utilisateur
    this.data.user.MotDePasse_Utilisateur = this.newPassword;
    this.userService.updateUtilisateur(this.data.user).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      () => {
        alert('Erreur lors de la mise à jour du mot de passe.');
      }
    );
  }
}
