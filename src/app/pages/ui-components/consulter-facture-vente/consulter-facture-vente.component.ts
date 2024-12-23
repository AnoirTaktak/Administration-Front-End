import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FactureVenteService } from 'src/app/services/factureVente/facture-vente.service';
import { FactureVente } from 'src/Models/facturevente';
import { ViewFactureVenteComponent } from '../view-facture-vente/view-facture-vente.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-consulter-facture-vente',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTableModule,
    MatIconModule,
    MatListModule,
    MatInputModule, // Import nécessaire
  ],
  templateUrl: './consulter-facture-vente.component.html',
  styleUrls: ['./consulter-facture-vente.component.scss']
})
export class ConsulterFactureVenteComponent {
  displayedColumns: string[] = ['numero', 'date', 'client', 'montant', 'actions'];
  factures: FactureVente[] = [];
  filteredFactures: FactureVente[] = [];
  searchClient: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  selectedFacture: FactureVente | null = null;

  constructor(private dialog: MatDialog , private factureVService:FactureVenteService) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
     this.factureVService.getAllFacturesVente().subscribe({
          next: (data: FactureVente[]) => {
            this.factures = data;
            this.filteredFactures=this.factures
            console.log(this.factures);

          },
        });

  }

  applyFilters(): void {
    this.filteredFactures = this.factures.filter(facture => {
      const matchClient = this.searchClient
        ? facture.Client.RS_Client.toLowerCase().includes(this.searchClient.toLowerCase())
        : true;
      const matchDate =
        (!this.dateDebut || new Date(facture.DateFacture) >= new Date(this.dateDebut)) &&
        (!this.dateFin || new Date(facture.DateFacture) <= new Date(this.dateFin));
      return matchClient && matchDate;
    });
  }

  resetFilters(): void {
    this.searchClient = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.filteredFactures = [...this.factures];
  }

  viewFacture(facture: FactureVente): void {
    this.selectedFacture = facture;
    this.dialog.open(ViewFactureVenteComponent, { data: facture });
  }
}
