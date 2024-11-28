import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, retry, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Societe } from 'src/Models/societe';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class SocieteService {

  private urlHote = environment.urlHote+'Societe/'; // URL de l'API définie dans le fichier environment
  constructor(private http :HttpClient)
  {

  }



  getSocietes(): Observable<Societe> {
    return this.http.get<Societe[]>(this.urlHote).pipe(
        map((data: Societe[]) => data[0]) // Prend le premier élément du tableau
    );
}
  deleteSociete(idP: number|undefined)
  {
    return this.http.delete (this.urlHote+idP);
  }

  addSociete(nouveau: Societe) {
    return this.http.post<Array<Societe>> (this.urlHote,nouveau);
  }



  updateSociete(id: number, societeData: any, file: File): Observable<any> {
    const url = `${this.urlHote}/${id}`;

    // Création de l'objet FormData pour inclure le fichier image et les données
    const formData = new FormData();
    formData.append('MF_Societe', societeData.MF_Societe);
    formData.append('RaisonSociale_Societe', societeData.RaisonSociale_Societe);
    formData.append('Adresse_Societe', societeData.Adresse_Societe);
    formData.append('Tel_Societe', societeData.Tel_Societe);
    formData.append('CodePostal', societeData.CodePostal);
    formData.append('Email_Societe', societeData.Email_Societe);

    // Ajout de l'image à FormData
    if (file) {
        formData.append('CachetSignature', file, file.name);
    }

    // Envoie la requête PUT avec FormData et spécifie responseType
    return this.http.put(url, formData, {
        headers: {
            'accept': '*/*'
        },
        responseType: 'text' // Cette ligne indique qu'on attend une réponse en texte
    });
}






}



