import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from 'src/Models/login';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';  // Correct import

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.urlHote + 'Auth/login';
  private tokenKey = 'token'; // Nom de la clé dans le localStorage
  constructor(private http: HttpClient,private router: Router) { }

  login(loginDto: Login): Observable<any> {
    return this.http.post<any>(this.baseUrl, loginDto);
  }

  logout() {
    // Suppression du token depuis localStorage ou sessionStorage
    localStorage.removeItem('token');
    // Optionnel : Vous pouvez aussi effacer d'autres informations d'authentification
    sessionStorage.removeItem('token'); // Si vous utilisez sessionStorage également

    // Redirection vers la page de login
    this.router.navigate(['/authentication/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string {
    const token = localStorage.getItem(this.tokenKey); // Récupérer le token JWT
    if (!token) {
      return ''; // Si le token n'existe pas
    }

    try {
      // Décoder le token
      const decodedToken: any = jwt_decode(token);
      return decodedToken.role || ''; // Retourne le rôle si défini, sinon une chaîne vide
    } catch (error) {
      console.error('Erreur lors du décodage du token JWT', error);
      return ''; // Retourne une chaîne vide en cas d'erreur
    }
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');  // Retourne true si le token est présent
  }

   // Vérifier si l'utilisateur a le rôle SuperAdmin
   isSuperAdmin(): boolean {
    return this.getRole() === 'SuperAdmin';
  }

  // Vérifier si l'utilisateur a le rôle Admin
  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  // Vérifier si l'utilisateur a le rôle User
  isUser(): boolean {
    return this.getRole() === 'User';
  }

  // Vérifier si l'utilisateur peut effectuer des actions spécifiques
  canEdit(): boolean {
    const role = this.getRole();
    return role === 'SuperAdmin' || role === 'Admin';
  }

  canDelete(): boolean {
    return this.isSuperAdmin();
  }

  canAdd(): boolean {
    const role = this.getRole();
    return role === 'SuperAdmin' || role === 'Admin';
  }

}
