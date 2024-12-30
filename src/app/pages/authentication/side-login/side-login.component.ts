import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { LoginService } from 'src/app/services/login/login.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  loginForm = new FormGroup({
    Utilisateurname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private login: LoginService) {}

  newlogin: any = {};

  onSubmit() {
    if (this.loginForm.valid) {
      const { Utilisateurname, password } = this.loginForm.value;
      this.newlogin.pseudo = Utilisateurname;
      this.newlogin.password = password;

      console.log(this.newlogin);

      this.login.login(this.newlogin).subscribe({
        next: (response) => {
          console.log(response);

          // Stocker le token
          const token = response.Token;
          localStorage.setItem('token', token);

          // Décoder le token pour récupérer les données
          const decodedToken: any = jwt_decode(token);
          console.log(decodedToken);  // Vérifiez le contenu du token

          // Récupérer l'ID et le rôle depuis le token
          const userId = decodedToken.sub;  // Récupère l'ID (sub)
          const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];  // Récupère le rôle

          // Stocker l'ID et le rôle dans le localStorage
          localStorage.setItem('userId', userId);  // Save userId
          localStorage.setItem('userRole', userRole);  // Save role
          localStorage.setItem('mdp',this.newlogin.password)

          // Redirection après connexion réussie
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Invalid username or password.');
        },
      });
    }
  }

}
