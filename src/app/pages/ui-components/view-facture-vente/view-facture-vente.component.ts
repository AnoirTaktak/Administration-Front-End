import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FactureVenteService } from 'src/app/services/factureVente/facture-vente.service';
import { ServiceService } from 'src/app/services/service_service/service-service.service';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { Societe } from 'src/Models/societe';

@Component({
  selector: 'app-view-facture-vente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-facture-vente.component.html',
  styleUrls: ['./view-facture-vente.component.scss']
})
export class ViewFactureVenteComponent implements OnInit {

  factureData: any = null; // Une seule facture
  societe: Societe | null = null;
  services: any[] = [];

  constructor(
    private factureDataService: FactureVenteService,
    private societeService: SocieteService,
    @Inject(MAT_DIALOG_DATA) public data: { facture: any },
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    // Récupérer la facture depuis les données passées
    this.factureData = this.data;
    console.log(this.factureData)
    this.consulterSociete();

    // Ajouter la désignation du service à chaque ligne
    this.serviceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;

        // Associer chaque ligne avec la désignation correspondante
        this.factureData.LignesFacture.forEach((ligne: any) => {
          const service = this.services.find(s => s.ID_Service === ligne.ID_Service);
          if (service) {
            ligne.Designation_Service = service.Designation_Service;
            ligne.TVA_Service = service.TVA;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des services :', err);
      }
    });
    console.log(this.factureData)
  }

  consulterSociete(): void {
    this.societeService.getSocietes().subscribe({
      next: (data) => {
        this.societe = { ...data };
      },
      error: () => {
        console.error('Erreur lors de la récupération des données de la société');
      }
    });
  }

  imprimerFacture(): void {

    window.print();
  }
}
