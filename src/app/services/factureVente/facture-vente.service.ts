import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FactureVente } from 'src/Models/facturevente';


@Injectable({
  providedIn: 'root',
})
export class FactureVenteService {
  private urlHote = environment.urlHote;

  constructor(private http: HttpClient) {}

  getIncomeStats(): Observable<any> {
    return this.http.get<any>(`${this.urlHote}FactureVente/income-stats`);
  }

  getAllFacturesVente(): Observable<FactureVente[]> {
    return this.http.get<FactureVente[]>(`${this.urlHote}FactureVente`);
  }

  getFactureByNumero(numeroFacture: string): Observable<FactureVente> {
    return this.http.get<FactureVente>(
      `${this.urlHote}FactureVente/numero/${numeroFacture}`
    );
  }

  getFacturesByClient(clientId: number): Observable<FactureVente[]> {
    return this.http.get<FactureVente[]>(
      `${this.urlHote}FactureVente/client/${clientId}`
    );
  }

  createFacture(facture: FactureVente): Observable<FactureVente> {
    return this.http.post<FactureVente>(`${this.urlHote}FactureVente`, facture);
  }

  getFactureVenteSeries() {
    return this.http.get<number[]>('https://localhost:7155/api/FactureVente/total-ventes-last-five-months');
  }
}
