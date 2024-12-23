import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ClientService } from 'src/app/services/client/client.service';
import { FactureVenteService } from 'src/app/services/factureVente/facture-vente.service';
import { ServiceService } from 'src/app/services/service_service/service-service.service';
import { ViewFactureVenteComponent } from '../view-facture-vente/view-facture-vente.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-ajout-facture-vente',
  standalone:true,
  imports: [CommonModule,
    FormsModule, // Ajoutez FormsModule ici
  ],
  templateUrl: './ajout-facture-vente.component.html',
  styleUrls: ['./ajout-facture-vente.component.scss']
})
export class AjoutFactureVenteComponent implements OnInit {

  clients: any[] = [];
  services: any[] = [];
  service: any = null;
  lignesFacture: any[] = [];
  clientSelectionne: any = null;
  serviceSelectionne: any; // Service actuellement sélectionné
  quantite: number = 1; // Quantité par défaut
  timbreFiscale: number = 1; // Valeur par défaut
  totalFacture: number = 0;
  totalFactureHT: number = 0;
  remise:number=0;
  TVA : number=0;

  constructor(private factureService: FactureVenteService,
              private clientService : ClientService,
              private serviceService : ServiceService,
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe((data) => (this.clients = data));
    this.serviceService.getAllServices().subscribe(
      (data) => {
        this.services = data;

        // Parcourir les services et les afficher dans la console
        this.services.forEach((service) => {
          console.log(service);

        });
      },
      (error) => {
        console.error("Erreur lors du chargement des services :", error);
      }
    );
  }


  ajouterLigne(service: any, quantite: number): void {

    if (!service.PrixHT || !quantite || !service.TVA) {
      console.error('Données invalides pour le calcul de la ligne :', service);
      return;
    }
    const tauxTVA = service.TVA / 100; // Convertir TVA en décimal (ex: 20% => 0.2)

    const totalLigneHT = service.PrixHT * quantite; // Calcul du montant hors taxe
    const totalLigneTTC = totalLigneHT * (1 + tauxTVA); // Calcul TTC (HT + TVA)

    const ligne = {
      ID_Service: service.ID_Service,
      Designation_Service: service.Designation_Service,
      prixUHT : service.PrixHT,
      prixUTTC : service.PrixTTC,
      TVA: service.TVA,
      Quantite: quantite,
      Total_LigneHT: parseFloat(totalLigneHT.toFixed(3)), 
      Total_LigneFV: parseFloat(totalLigneTTC.toFixed(3)),
    };
    const exist = this.lignesFacture.map(l=> l.ID_Service == ligne.ID_Service);
    console.log(exist.includes(true))
    if(exist.includes(true)){
      alert("ce service est déja ajouté vous pouvez modifier la quantité")
    }else {
      this.lignesFacture.push(ligne);
      this.calculerTotalFacture();
    }

  }


  calculerTotalFacture(ligne?:any): void {

    if (ligne) {
      // Recalculer les totaux de la ligne modifiée

      ligne.Total_LigneHT = parseFloat(
        (ligne.Quantite * ligne.prixUHT).toFixed(3)
      ); // Calcul du HT avec 3 décimales
      ligne.Total_LigneFV = parseFloat(
        (ligne.Quantite * ligne.prixUTTC).toFixed(3)
      ); // Calcul TTC avec 3 décimales
      console.log(ligne)
    }

    if (!this.lignesFacture || this.lignesFacture.length === 0) {
      this.totalFacture = this.timbreFiscale; // Si aucune ligne, le total est juste le timbre fiscal
      this.TVA = 0;
      this.totalFactureHT = 0;
      return;
    }

    const totalLignes = this.lignesFacture.reduce(
      (total, ligne) => total + (ligne.Total_LigneFV || 0), // Somme des montants TTC
      0
    );

    const totalLignesht = this.lignesFacture.reduce(
      (total, ligne) => total + (ligne.Total_LigneHT || 0), // Somme des montants TTC
      0
    );



    this.totalFacture = parseFloat((totalLignes + this.timbreFiscale).toFixed(3)); // Total TTC avec timbre fiscal
    this.totalFacture = parseFloat((parseFloat(this.totalFacture.toFixed(3))-parseFloat((this.totalFacture*(this.remise/100)).toFixed(3))).toFixed(3));
    this.totalFactureHT =parseFloat((totalLignesht -parseFloat((totalLignesht*(this.remise/100)).toFixed(3))).toFixed(3));

    const tva = this.totalFacture - this.totalFactureHT;
    this.TVA = parseFloat(tva.toFixed(3));
  }

  enregistrerFacture(): void {
    if (!this.clientSelectionne) {
      alert('Veuillez sélectionner un client.');
      return;
    }

    const facture = {
      DateFacture: new Date().toISOString(),
      Remise:this.remise,
      Total_FactureVente: this.totalFacture,
      Total_FactureVenteHT:this.totalFactureHT,
      TimbreFiscale: this.timbreFiscale,
      Client: this.clientSelectionne,
      LignesFacture: this.lignesFacture,
    };

    this.factureService.createFacture(facture).subscribe(
      (response) => {
        console.log('Facture enregistrée', response);
        alert('Facture ajoutée avec succès.');

        this.dialog.open(ViewFactureVenteComponent, {
          data: { ...response }
        });

        console.log(facture)
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement de la facture', error);
      }
    );


  }



  openDialog():void {

  }
}
