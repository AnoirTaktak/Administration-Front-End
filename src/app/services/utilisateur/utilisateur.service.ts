import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utilisateur } from 'src/Models/utilisateur';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private baseUrl = environment.urlHote + 'Utilisateur';

  constructor(private http: HttpClient) { }

  // Get all Utilisateurs
  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.baseUrl);
  }

  // Get Utilisateur by ID
  getUtilisateurById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/${id}`);
  }

  // Add a new Utilisateur
  addUtilisateur(Utilisateur: Utilisateur): Observable<string> {
    return this.http.post<string>(this.baseUrl, Utilisateur);
  }

  // Update Utilisateur details
  updateUtilisateur(Utilisateur: Utilisateur): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/${Utilisateur.ID_Utilisateur}`, Utilisateur);
  }

  // Delete a Utilisateur
  deleteUtilisateur(Utilisateur: Utilisateur): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${Utilisateur.ID_Utilisateur}`);
  }

  // Get Utilisateur by Utilisateurname
  getUtilisateurByUtilisateurname(Utilisateurname: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/Utilisateurname/${Utilisateurname}`);
  }

  // Login (Authentication) - Modify based on your authentication logic
  login(pseudo: string, password: string): Observable<any> {
    // Replace with your login API endpoint and logic
    return this.http.post<any>(`${this.baseUrl}/authenticate`, { pseudo, password });
  }

   // Méthode pour mettre à jour uniquement le rôle d'un utilisateur
   updateUserRole(id: number, newRole: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/updateRole`, newRole);
  }
}
