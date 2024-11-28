export enum TypeContrat {
  CDD = 0,
  CDI = 1,
  Stage = 2
}

export class Employe {
  ID_Employe: number;
  Nom_Employe: string;
  Email_Employe: string;
  TypeContrat: TypeContrat; // Enum pour les types de contrat
  DateDebut: Date;
  DateFin?: Date; // Optionnel
  Salaire: number;
  CIN_Employe: string;
  CNSS_Employe?: string; // Nullable
  Poste_Employe: string;
  Tel_Employe?: string; // Optionnel

  constructor(
    ID_Employe: number,
    Nom_Employe: string,
    Email_Employe: string,
    TypeContrat: TypeContrat,
    DateDebut: Date,
    Salaire: number,
    CIN_Employe: string,
    Poste_Employe: string,
    DateFin?: Date,
    CNSS_Employe?: string,
    Tel_Employe?: string
  ) {
    this.ID_Employe = ID_Employe;
    this.Nom_Employe = Nom_Employe;
    this.Email_Employe = Email_Employe;
    this.TypeContrat = TypeContrat;
    this.DateDebut = DateDebut;
    this.DateFin = DateFin;
    this.Salaire = Salaire;
    this.CIN_Employe = CIN_Employe;
    this.CNSS_Employe = CNSS_Employe;
    this.Poste_Employe = Poste_Employe;
    this.Tel_Employe = Tel_Employe;
  }
}
