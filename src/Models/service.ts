export class Service {
  ID_Service: number;
  Designation_Service: string;
  PrixHT: number; // Calcul automatique
  PrixTTC: number;
  TVA: number;

  constructor(
    ID_Service: number,
    Designation_Service: string,
    PrixTTC: number,
    TVA: number
  ) {
    this.ID_Service = ID_Service;
    this.Designation_Service = Designation_Service;
    this.PrixTTC = PrixTTC;
    this.TVA = TVA;
    this.PrixHT = +(PrixTTC / (1 + TVA / 100)).toFixed(3); // Calcul PrixHT
  }
}
