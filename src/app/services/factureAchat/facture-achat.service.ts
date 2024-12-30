import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FactureAchat } from 'src/Models/factureAchat';


@Injectable({
  providedIn: 'root',
})
export class FactureAchatService {
  private urlHote = environment.urlHote;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les factures d'achat
  getAllFacturesAchat(): Observable<FactureAchat[]> {
    return this.http.get<FactureAchat[]>(`${this.urlHote}FactureAchat`);
  }

  // Récupérer une facture par son ID
  getFactureAchatById(id: number): Observable<FactureAchat> {
    return this.http.get<FactureAchat>(`${this.urlHote}FactureAchat/${id}`);
  }

  // Récupérer les factures par fournisseur
  getFacturesAchatByFournisseur(idFournisseur: number): Observable<FactureAchat[]> {
    return this.http.get<FactureAchat[]>(
      `${this.urlHote}FactureAchat/byfournisseur/${idFournisseur}`
    );
  }

  // Récupérer les factures par état de paiement
  getFacturesAchatByEtat(etat: boolean): Observable<FactureAchat[]> {
    console.log('Requête API avec état de paiement:', etat);
    return this.http.get<FactureAchat[]>(
      `${this.urlHote}FactureAchat/by-etat/${etat}`
    );
  }

  // Récupérer les factures par intervalle de dates
  getFacturesAchatByDateRange(params: { startDate?: string, endDate?: string }): Observable<FactureAchat[]> {
    console.log(params.startDate,params.endDate)
    return this.http.get<FactureAchat[]>(`${this.urlHote}FactureAchat/ByDateRange`, { params });
  }


  // Ajouter une nouvelle facture
  addFactureAchat(facture: FormData): Observable<string> {
    return this.http.post<string>(`${this.urlHote}FactureAchat`, facture);
  }

  // Mettre à jour une facture existante
  updateFactureAchat(id: number, facture: FormData): Observable<string> {
    return this.http.put<string>(`${this.urlHote}FactureAchat/${id}`, facture);
  }

  // Supprimer une facture par son ID
  deleteFactureAchat(id: number): Observable<string> {
    return this.http.delete<string>(`${this.urlHote}FactureAchat/${id}`);
  }

  getIncomeStats(): Observable<any> {
    return this.http.get<any>(`${this.urlHote}FactureAchat/income-stats`);
  }
}
