import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LigneFacture } from 'src/Models/lignefacture';


@Injectable({
  providedIn: 'root',
})
export class LigneFactureService {
  private urlHote = environment.urlHote;

  constructor(private http: HttpClient) {}

  getAllLignesFacture(): Observable<LigneFacture[]> {
    return this.http.get<LigneFacture[]>(`${this.urlHote}LigneFacture`);
  }

  getLignesByFactureId(factureId: number): Observable<LigneFacture[]> {
    return this.http.get<LigneFacture[]>(
      `${this.urlHote}LigneFacture/lignefactureId/${factureId}`
    );
  }

  createLigneFacture(ligne: LigneFacture): Observable<LigneFacture> {
    return this.http.post<LigneFacture>(`${this.urlHote}LigneFacture`, ligne);
  }

  updateLigneFacture(id: number, ligne: LigneFacture): Observable<LigneFacture> {
    return this.http.put<LigneFacture>(
      `${this.urlHote}LigneFacture/${id}`,
      ligne
    );
  }
}
