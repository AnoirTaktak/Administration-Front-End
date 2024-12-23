export class LigneFacture {
  ID_LigneFV: number; // Identifiant de la ligne facture
  ID_Service: number; // Identifiant du service associé
  ID_FactureVente?: number; // Identifiant de la facture vente associée (optionnel)
  Quantite: number; // Quantité de service
  Total_LigneFV: number; // Total ligne facture vente
  Total_LigneHT: number; // Total ligne hors taxes

  constructor(
    ID_LigneFV: number,
    ID_Service: number,
    Quantite: number,
    Total_LigneFV: number,
    Total_LigneHT: number,
    ID_FactureVente?: number
  ) {
    this.ID_LigneFV = ID_LigneFV;
    this.ID_Service = ID_Service;
    this.Quantite = Quantite;
    this.Total_LigneFV = Total_LigneFV;
    this.Total_LigneHT = Total_LigneHT;
    this.ID_FactureVente = ID_FactureVente;
  }
}
