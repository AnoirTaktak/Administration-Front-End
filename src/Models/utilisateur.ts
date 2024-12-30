export enum Role {
  SuperAdmin = 0,
  Admin = 1,
  User = 2
}

export class Utilisateur {
  ID_Utilisateur: number;
  Nom_Utilisateur: string;
  Pseudo: string;
  Email_Utilisateur: string;
  MotDePasse_Utilisateur: string;
  Role_Utilisateur: Role;

  constructor(
    ID_Utilisateur: number,
    Nom_Utilisateur: string,
    Pseudo: string,
    Email_Utilisateur: string,
    MotDePasse_Utilisateur: string,
    Role_Utilisateur: Role
  ) {
    this.ID_Utilisateur = ID_Utilisateur;
    this.Nom_Utilisateur = Nom_Utilisateur;
    this.Pseudo = Pseudo;
    this.Email_Utilisateur = Email_Utilisateur;
    this.MotDePasse_Utilisateur = MotDePasse_Utilisateur;
    this.Role_Utilisateur = Role_Utilisateur;
  }
}
