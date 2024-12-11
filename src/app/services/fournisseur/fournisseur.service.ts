import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fournisseur } from 'src/Models/fournisseur';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private urlHote = environment.urlHote;

  constructor(private http: HttpClient) {}

  getAllFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.urlHote}Fournisseur`);
  }

  getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.urlHote}Fournisseur/${id}`);
  }

  addFournisseur(fournisseur: Fournisseur): Observable<string> {
    return this.http.post<string>(`${this.urlHote}Fournisseur`, fournisseur);
  }

  updateFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(
      `${this.urlHote}Fournisseur/${fournisseur.ID_Fournisseur}`,
      fournisseur
    );
  }

  deleteFournisseur(id: number): Observable<string> {
    return this.http.delete<string>(`${this.urlHote}Fournisseur/${id}`);
  }

  getFournisseurByRS(rs: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.urlHote}Fournisseur/rs/${rs}`);
  }

  getFournisseurByMF(mf: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.urlHote}Fournisseur/mf/${mf}`);
  }

  getFournisseurByTypeFournisseur(Type: string): Observable<Fournisseur[]> {
    console.log(Type)
    return this.http.get<Fournisseur[]>(`${this.urlHote}Fournisseur/tf/${Type}`);
  }
}
