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
  totalTTCEnLettres: string = ''; // Variable pour stocker le montant en lettres

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
        this.convertirTotalTTCEnLettres(); // Calculer le montant en lettres
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

   /**
   * Convertir le Total TTC en toutes lettres
   */
   convertirTotalTTCEnLettres(): void {
    const montant = this.factureData?.Total_FactureVente || 0;
    this.totalTTCEnLettres = this.convertirNombreEnLettres(montant);
  }


  convertirNombreEnLettres(nombre: number): string {
    const unités = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const dizaines = [
      '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'
    ];
    const milliers = ['','mille','deux mille','trois mille','quatre mille','cinq mille','six mille','sept mille','huit mille','neuf mille'];

    let resultat = '';
    let centimes = 0;

    // Séparer les euros et les centimes
    let euros = Math.floor(nombre);
    centimes = Math.round((nombre - euros) * 100);

    if (euros === 0) return 'zéro';

    // Traitement des milliers
    if (euros >= 1000) {
      const millePart = Math.floor(euros / 1000);
      euros %= 1000;
      resultat += milliers[millePart] + ' ';
    }

    // Traitement des centaines
    if (euros >= 100) {
      const centaines = Math.floor(euros / 100);
      euros %= 100;
      if (centaines === 1) {
        resultat += 'cent ';
      } else if (centaines > 1) {
        resultat += unités[centaines] + ' cents ';
      }
    }

    // Traitement des dizaines et unités
    if (euros > 0) {
      if (euros < 10) {
        resultat += unités[euros];
      } else if (euros < 20) {
        if (euros === 11) {
          resultat += 'onze';
        } else if (euros === 12) {
          resultat += 'douze';
        } else {
          resultat += 'dix-' + unités[euros - 10];
        }
      } else {
        const dizaine = Math.floor(euros / 10);
        const unite = euros % 10;

        resultat += dizaines[dizaine];
        if (unite > 0) {
          resultat += '-' + unités[unite] + ' Dinars';
        }
      }
    }

    // Ajouter les centimes
    if (centimes > 0) {
      resultat += ' et ' + centimes + '0 Mellime' + (centimes > 1 ? 's' : '');
    }

    return resultat.trim();
  }

}
