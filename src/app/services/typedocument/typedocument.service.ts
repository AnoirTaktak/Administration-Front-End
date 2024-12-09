import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeDocument } from 'src/Models/typedocument';

@Injectable({
  providedIn: 'root'
})
export class TypedocumentService {
  private urlHote = `${environment.urlHote}TypeDocument`; // URL de base pour le contrôleur TypeDocument

  constructor(private http: HttpClient) {}

  // Création d'un type de document
  createTypeDocument(typeDocument: any): Observable<any> {
    return this.http.post<any>(`${this.urlHote}`, typeDocument);
  }

  // Récupération d'un type de document par ID
  getTypeDocumentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlHote}/${id}`);
  }

  // Récupération de tous les types de documents
  getAllTypeDocuments(): Observable<TypeDocument[]> {
    return this.http.get<any[]>(`${this.urlHote}`);
  }

  // Mise à jour d'un type de document
  updateTypeDocument(typeDocument: any): Observable<any> {
    return this.http.put<any>(`${this.urlHote}`, typeDocument);
  }

  // Suppression d'un type de document par ID
  deleteTypeDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlHote}/${id}`);
  }
}
