import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmployeService } from 'src/app/services/employe/employe.service';
import { Employe, TypeContrat } from 'src/Models/employe';
import { EditEmployeComponent } from '../edit-employe/edit-employe.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { AddEmployeComponent } from '../add-employe/add-employe.component';
import { forkJoin, mergeMapTo, tap } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';



@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    provideNativeDateAdapter(),
  ],
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss']
})
export class EmployeComponent implements OnInit {

  displayedColumns: string[] = ['assigned','cin','cnss','tel', 'salaire', 'contrat','date debut','date fin','email', 'actions'];
  employes: Employe[] = []; // Liste des employés
  employesName: Employe[] = []; // Liste des employés recherchez by nom
  employesCin: Employe[] = []; // Liste des employés recherchez by cin
  employesTc: Employe[] = []; // Liste des employés recherche by type contrat
  modeEdition: boolean = false;
  employeOriginal: Employe = {} as Employe;
  filters :any ={};
  searchName: string = '';
  searchCin: string = '';
  searchTC: string = '';

  constructor(
    private employeService: EmployeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,public authService: LoginService
  ) {}

  ngOnInit(): void {
    this.consulterEmployes();
    console.log(this.employes)
  }

  consulterEmployes(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (data: Employe[]) => {
        this.employes = [...data];
        console.log(this.employes);
        this.employes = this.employes;
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la récupération des employés.', 'Fermer', { duration: 3000 });
      },
    });
  }

  openEditDialog(employe: Employe): void {


    const dialogRef = this.dialog.open(EditEmployeComponent, {
        panelClass: 'custom-dialog',
        width: '80%',
        data: employe
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterEmployes();
      }
    });
  }

  openAddDialog(): void {


    const dialogRef = this.dialog.open(AddEmployeComponent, {
        panelClass: 'custom-dialog',
        width: '90%',
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterEmployes();
      }
    });
  }

  deleteEmploye(id: number): void {
    console.log(id)
    if (confirm('Voulez-vous vraiment supprimer cet employé ?')) {
      this.employeService.deleteEmploye(id).subscribe({
        next: () => {
          this.snackBar.open('Employé supprimé avec succès.', 'Fermer', { duration: 3000 });
          this.employes = this.employes.filter(e => e.ID_Employe != id);
          //this.ngOnInit()
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression.', 'Fermer', { duration: 3000 });
          console.error('Erreur lors de la suppression :', err)
        },
      });
    }
  }




  getTypeContratText(type: number): string {
    switch (type) {
      case 0:
        return 'CDD';
      case 1:
        return 'CDI';
      case 2:
        return 'Stage';
      default:
        return 'Inconnu';
    }
  }


  applyFilters(): void {
    console.log('Filtrage avec:', this.searchCin, this.searchName, this.searchTC);

    // Réinitialisation de la liste des employés avant chaque filtre
    this.employes = [];

    // Si aucun filtre n'est saisi, récupérer tous les employés
    if (!this.searchCin && !this.searchName && !this.searchTC) {
      this.consulterEmployes();
      return;
    }

    const filterRequests = [];

    // Si un filtre de nom est spécifié
    if (this.searchName) {
      filterRequests.push(
        this.employeService.getEmployeByNom(this.searchName).pipe(
          tap(data => {
            this.employesName = data || [];
            console.log('Résultats filtrés par nom:', this.employesName);
          })
        )
      );
    }

    // Si un filtre de CIN est spécifié
    if (this.searchCin) {
      filterRequests.push(
        this.employeService.getEmployeByCin(this.searchCin).pipe(
          tap(data => {
            this.employesCin = data || [];
            console.log('Résultats filtrés par CIN:', this.employesCin);
          })
        )
      );
    }

    // Si un filtre de type de contrat est spécifié
    if (this.searchTC) {
      filterRequests.push(
        this.employeService.getEmployesByTypeContrat(this.searchTC).pipe(
          tap(data => {
            this.employesTc = data || [];
            console.log('Résultats filtrés par TypeContrat:', this.employesTc);
          })
        )
      );
    }

    // Si nous avons des filtres en attente, lancer les appels API
    forkJoin(filterRequests).subscribe(() => {
      // Après que toutes les requêtes soient terminées, fusionner les résultats
      this.mergeTables();
    });
  }

  // Fonction pour fusionner les employés en utilisant un Set pour éliminer les doublons
  mergeTables(): void {
    console.log('Fusion des résultats des filtres');

    // Créer une Map pour fusionner les résultats des filtres sans doublons
    const uniqueEmployees = new Map<number, any>();

    // Ajouter les résultats du filtre par nom si disponibles
    if (this.employesName.length > 0) {
        this.employesName.forEach(emp => {
            uniqueEmployees.set(emp.ID_Employe, emp);
        });
    }

    // Ajouter les résultats du filtre par CIN si disponibles
    if (this.employesCin.length > 0) {
        this.employesCin.forEach(emp => {
            uniqueEmployees.set(emp.ID_Employe, emp);
        });
    }

    // Ajouter les résultats du filtre par TypeContrat si disponibles
    if (this.employesTc.length > 0) {
        this.employesTc.forEach(emp => {
            uniqueEmployees.set(emp.ID_Employe, emp);
        });
    }

    // Vérifier si un tableau est vide malgré une saisie dans le filtre
    const checkcin = !(this.employesCin.length === 0 && this.searchCin);
    const checkname = !(this.employesName.length === 0 && this.searchName);
    const checktc = !(this.employesTc.length === 0 && this.searchTC);

    console.log('Check CIN:', checkcin);
    console.log('Check Name:', checkname);
    console.log('Check TC:', checktc);

    // Si au moins un tableau est vide malgré une saisie, vider la liste des employés
    if (!checkcin || !checkname || !checktc) {
        console.log('Aucun employé ne correspond aux filtres');
        this.employes = []; // Vider la liste des employés
        return; // Sortir de la fonction
    }

 // Convertir la Map en tableau d'objets
 let mergedEmployees = Array.from(uniqueEmployees.values());

 // Ajout du filtrage final : conserver uniquement les employés communs
 if (this.searchCin) {
     mergedEmployees = mergedEmployees.filter(emp =>
         this.employesCin.some(cinEmp => cinEmp.ID_Employe === emp.ID_Employe)
     );
 }
 if (this.searchName) {
     mergedEmployees = mergedEmployees.filter(emp =>
         this.employesName.some(nameEmp => nameEmp.ID_Employe === emp.ID_Employe)
     );
 }
 if (this.searchTC) {
     mergedEmployees = mergedEmployees.filter(emp =>
         this.employesTc.some(tcEmp => tcEmp.ID_Employe === emp.ID_Employe)
     );
 }

 // Mettre à jour la liste des employés
 this.employes = mergedEmployees;

 console.log('Employés après filtrage final:', this.employes);
}






}
