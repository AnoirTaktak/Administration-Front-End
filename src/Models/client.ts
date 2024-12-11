export enum TypeClient {
  PersonnePhysique = 0,
  PersonneMorale = 1
}

export class Client {
  ID_Client: number;
  MF_Client: string; // Matricule Fiscale
  RS_Client: string; // Raison Sociale
  Adresse_Client: string;
  Email_Client:string;
  Tel_Client: string;
  Type_Client: TypeClient;

  constructor(
    ID_Client: number,
    MF_Client: string,
    RS_Client: string,
    Adresse_Client: string,
    Tel_Client: string,
    Email_Client:string,
    Type_Client: TypeClient
  ) {
    this.ID_Client = ID_Client;
    this.MF_Client = MF_Client;
    this.RS_Client = RS_Client;
    this.Adresse_Client = Adresse_Client;
    this.Tel_Client = Tel_Client;
    this.Email_Client=Email_Client;
    this.Type_Client = Type_Client;
  }
}
