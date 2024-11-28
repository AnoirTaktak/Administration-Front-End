import { Injectable } from '@angular/core'; // Fournisseur de services Angular
import { HttpClient } from '@angular/common/http'; // Pour les requêtes HTTP
import { Observable } from 'rxjs'; // Pour gérer les données asynchrones
import { environment } from 'src/environments/environment'; // Pour récupérer l'URL de l'API depuis les environnements
import { Employe } from 'src/Models/employe';
 // Le modèle Employe (à adapter selon votre structure)

@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  private urlHote = environment.urlHote; // URL de l'API définie dans le fichier environment

  constructor(private http: HttpClient) {}

  // Récupérer tous les employés
  getAllEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.urlHote}Employe`);
  }

  // Récupérer un employé par ID
  getEmployeById(id: number): Observable<Employe> {
    return this.http.get<Employe>(`${this.urlHote}Employe/${id}`);
  }

  // Ajouter un nouvel employé
  addEmploye(employe: Employe): Observable<string> {
    return this.http.post<string>(`${this.urlHote}Employe`, employe, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Mettre à jour un employé existant
  updateEmploye(employe: Employe): Observable<Employe> {
    console.log(employe)
    return this.http.put<Employe>(`${this.urlHote}Employe/${employe.ID_Employe}`, employe);
  }

  // Supprimer un employé par ID
  deleteEmploye(id: number): Observable<string> {
    console.log("en cours de suppression")
    return this.http.delete<string>(`${this.urlHote}Employe/${id}`);
  }

  // Rechercher des employés par nom
  getEmployeByNom(nom: string): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.urlHote}Employe/Nom/${nom}`);
  }

  // Rechercher des employés par CIN
  getEmployeByCin(cin: string): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.urlHote}Employe/Cin/${cin}`);
  }

  // Rechercher des employés par type de contrat
  getEmployesByTypeContrat(typeContrat: string): Observable<Employe[]> {
    console.log(typeContrat)
    return this.http.get<Employe[]>(`${this.urlHote}Employe/TypeContrat/${typeContrat}`);
  }



}
