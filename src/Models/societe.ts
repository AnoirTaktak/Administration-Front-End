export class Societe {
  ID_Societe: number;
  MF_Societe: string;
  RaisonSociale_Societe: string;
  Adresse_Societe: string;
  Tel_Societe: string;
  CodePostal: string;
  CachetSignature: Uint8Array;
  Email_Societe: string;

  constructor(
    ID_Societe: number,
  MF_Societe: string,
  RaisonSociale_Societe: string,
  Adresse_Societe: string,
  Tel_Societe: string,
  CodePostal: string,
  CachetSignature: Uint8Array,
  Email_Societe: string,
  ) {
    this.ID_Societe = ID_Societe;
    this.MF_Societe = MF_Societe;
    this.RaisonSociale_Societe = RaisonSociale_Societe;
    this.Adresse_Societe = Adresse_Societe;
    this.Tel_Societe = Tel_Societe;
    this.CodePostal = CodePostal;
    this.CachetSignature = CachetSignature;
    this.Email_Societe = Email_Societe;
  }
}
