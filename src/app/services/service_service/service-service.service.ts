import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Service } from 'src/Models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private urlHote = environment.urlHote;

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.urlHote}Services`);
  }

  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.urlHote}Services/${id}`);
  }

  addService(service: Service): Observable<string> {
    return this.http.post<string>(`${this.urlHote}Services`, service);
  }

  updateService(service: Service): Observable<Service> {
    return this.http.put<Service>(
      `${this.urlHote}Services/${service.ID_Service}`,
      service
    );
  }

  deleteService(id: number): Observable<string> {
    return this.http.delete<string>(`${this.urlHote}Services/${id}`);
  }

  getServiceByDesignation(designation: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.urlHote}Services/designation/${designation}`);
  }
}
