import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ServiceService } from 'src/app/services/service_service/service-service.service';
import { Service } from 'src/Models/service';
import { EditServiceComponent } from '../edit-service/edit-service.component';
import { AddServiceComponent } from '../add-service/add-service.component';
import { catchError, of, tap } from 'rxjs';
import { error } from 'console';

@Component({
  selector: 'app-service',
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
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent {

  displayedColumns: string[] = ['des','pht','tva','pttc','actions'];
  Services: Service[] = []; // Liste des Services
  ServicesDes: Service[] = []; // Liste des Services recherchez by des

  modeEdition: boolean = false;
  ServiceOriginal: Service = {} as Service;
  filters :any ={};
  searchDes: string = '';


  constructor(
    private Serviceservice: ServiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.consulterServices();
    console.log(this.Services)
  }

  consulterServices(): void {
    this.Serviceservice.getAllServices().subscribe({
      next: (data: Service[]) => {
        this.Services = [...data];
        console.log(this.Services);
        this.Services = this.Services;
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la récupération des Services.', 'Fermer', { duration: 3000 });
        console.log(err.message)
      },
    });
  }

  openEditDialog(Service: Service): void {


    const dialogRef = this.dialog.open(EditServiceComponent, {
        panelClass: 'custom-dialog',
        width: '80%',
        data: Service
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterServices();
      }
    });
  }

  openAddDialog(): void {


    const dialogRef = this.dialog.open(AddServiceComponent, {
        panelClass: 'custom-dialog',
        width: '80%',
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données après la modification
        this.consulterServices();
      }
    });
  }

  deleteService(id: number): void {
    console.log(id)
    if (confirm('Voulez-vous vraiment supprimer ce Service ?')) {
      this.Serviceservice.deleteService(id).subscribe({
        next: () => {
          this.snackBar.open('Service supprimé avec succès.', 'Fermer', { duration: 3000 });
          this.Services = this.Services.filter(e => e.ID_Service != id);
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
        return 'Personne Physique';
      case 1:
        return 'Société';
      default:
        return 'Inconnu';
    }
  }


  applyFilters(): void {
    console.log('Filtrage avec:', this.searchDes);

    // Réinitialisation de la liste des employés avant chaque filtre
    this.Services = [];

    // Si aucun filtre n'est saisi, récupérer tous les employés
    if (!this.searchDes) {
      this.consulterServices();
      return;
    }


    this.Serviceservice.getServiceByDesignation(this.searchDes).pipe(
      tap(data => {
        this.ServicesDes = data;
        console.log('Résultats filtrés par Designation:', this.ServicesDes);
      }),
      catchError(err => {
        console.error('Erreur lors de la récupération des services:', err);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    ).subscribe();



this.Services = this.ServicesDes;

 console.log('Services après filtrage final:', this.ServicesDes);
}

}
