export class Document {
  ID_Employe: number;
  ID_TypeDocument: number;
  ID_Societe : number;
  Date: string;
  Contenu: string;
  Doc_Pdf: Uint8Array;

  constructor(
    ID_Employe: number,
    ID_TypeDocument: number,
    ID_Societe: number,
    Date: string,
    Contenu: string,
    Doc_Pdf: Uint8Array
  ) {
    this.ID_Employe = ID_Employe;
    this.ID_TypeDocument = ID_TypeDocument;
    this.ID_Societe = ID_Societe;
    this.Date = Date;
    this.Contenu = Contenu;
    this.Doc_Pdf = Doc_Pdf;
  }
}
