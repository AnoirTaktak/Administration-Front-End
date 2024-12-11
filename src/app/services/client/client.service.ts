import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from 'src/Models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private urlHote = environment.urlHote;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.urlHote}Client`);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.urlHote}Client/${id}`);
  }

  addClient(client: Client): Observable<string> {
    return this.http.post<string>(`${this.urlHote}Client`, client);
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.urlHote}Client/${client.ID_Client}`, client);
  }

  deleteClient(id: number): Observable<string> {
    return this.http.delete<string>(`${this.urlHote}Client/${id}`);
  }

  getClientByRS(rs: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.urlHote}Client/rs/${rs}`);
  }

  getClientByMF(mf: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.urlHote}Client/mf/${mf}`);
  }

  getEmployesByTypeClient(TypeClient: string): Observable<Client[]> {
    console.log(TypeClient)
    return this.http.get<Client[]>(`${this.urlHote}Client/typeclient/${TypeClient}`);
  }
}
