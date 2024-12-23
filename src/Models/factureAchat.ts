export class FactureAchat {
  ID_FactureAchat: number; // Identifiant unique de la facture d'achat
  Numero_FactureAchat : string;
  DateAchat: Date; // Date de la facture d'achat
  Montant: number; // Montant de la facture
  EtatPaiement: boolean; // Etat de paiement : payé ou non payé
  ID_Fournisseur: number; // Identifiant du fournisseur associé
  ImageFacture: Uint8Array; // Image de la facture sous forme de tableau d'octets
  RaisonSocialeFournisseur?: string;

  constructor(
    ID_FactureAchat: number,
    Numero_FactureAchat : string,
    DateAchat: Date,
    Montant: number,
    EtatPaiement: boolean,
    ID_Fournisseur: number,
    ImageFacture: Uint8Array,
    RaisonSocialeFournisseur:string
  ) {
    this.ID_FactureAchat = ID_FactureAchat;
    this.DateAchat = DateAchat;
    this.Montant = Montant;
    this.EtatPaiement = EtatPaiement;
    this.ID_Fournisseur = ID_Fournisseur;
    this.ImageFacture = ImageFacture;
    this.Numero_FactureAchat = Numero_FactureAchat;
    this.RaisonSocialeFournisseur=RaisonSocialeFournisseur;
  }
}
