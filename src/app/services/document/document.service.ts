import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private urlHote = `${environment.urlHote}Document`; // URL de base pour le contrôleur Document

  constructor(private http: HttpClient) {}

  // Création d'un document
  createDocument(formData: FormData): Observable<any> {
    console.log('FormData envoyé :', formData);
    return this.http.post<any>(`${this.urlHote}`, formData ,{
      headers: {
          'accept': '*/*'
      },
      //responseType: 'object' // Cette ligne indique qu'on attend une réponse en texte
  });
  }

  // Récupération d'un document par ID
  getDocumentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlHote}/${id}`);
  }

  // Récupération des documents d'un employé par son ID
  getDocumentsByEmployeeId(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlHote}/employee/${employeeId}`);
  }

  // Mise à jour d'un document
  updateDocument(document: any): Observable<any> {
    return this.http.put<any>(`${this.urlHote}`, document);
  }

  // Suppression d'un document par ID
  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlHote}/${id}`);
  }
}
