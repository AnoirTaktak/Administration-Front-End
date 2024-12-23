import { LigneFacture } from './lignefacture';
import { Client } from './client'; // Supposant qu'un modèle Client existe

export class FactureVente {


  NumeroFacture? : string;
  DateFacture: string; // Date de la facture
  Total_FactureVente: number; // Total de la facture
  Total_FactureVenteHT: number; // Total de la facture
  Remise : number;
  TimbreFiscale: number; // Timbre fiscal
  LignesFacture: LigneFacture[]; // Liste des lignes de facture
  Client: Client; // Client associé à la facture

  constructor(
    NumeroFacture:string,
    DateFacture: string,
    Total_FactureVente: number,
    Total_FactureVenteHT : number,
    Remise : number ,
    TimbreFiscale: number,
    LignesFacture: LigneFacture[],
    Client: Client
  ) {
    this.NumeroFacture=NumeroFacture;
    this.DateFacture = DateFacture;
    this.Total_FactureVente = Total_FactureVente;
    this.TimbreFiscale = TimbreFiscale;
    this.LignesFacture = LignesFacture;
    this.Client = Client;
    this.Total_FactureVenteHT = Total_FactureVenteHT;
    this.Remise = Remise;
  }
}
