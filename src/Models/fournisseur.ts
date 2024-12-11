export class Fournisseur {
  ID_Fournisseur: number;
  Type_Fournisseur: string; // Utilisation de string pour Type
  RaisonSociale_Fournisseur: string; // Raison Sociale
  MF_Fournisseur: string; // Matricule Fiscale
  Email_Fournisseur: string;
  Adresse_Fournisseur: string;
  Tel_Fournisseur: string;

  constructor(
    ID_Fournisseur: number,
    Type_Fournisseur: string,
    RaisonSociale_Fournisseur: string,
    MF_Fournisseur: string,
    Email_Fournisseur: string,
    Adresse_Fournisseur: string,
    Tel_Fournisseur: string
  ) {
    this.ID_Fournisseur = ID_Fournisseur;
    this.Type_Fournisseur = Type_Fournisseur;
    this.RaisonSociale_Fournisseur = RaisonSociale_Fournisseur;
    this.MF_Fournisseur = MF_Fournisseur;
    this.Email_Fournisseur = Email_Fournisseur;
    this.Adresse_Fournisseur = Adresse_Fournisseur;
    this.Tel_Fournisseur = Tel_Fournisseur;
  }
}
