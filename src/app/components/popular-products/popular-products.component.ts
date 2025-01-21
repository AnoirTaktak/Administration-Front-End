import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { LigneFactureService } from 'src/app/services/ligneFacture/ligne-facture.service';

export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  price: string;
  sold: number;
  paid: string; // Placeholder for additional data if needed
  status: string; // Placeholder for additional data if needed
  progress: string; // Placeholder for additional data if needed
}

@Component({
  selector: 'app-popular-products',
  standalone: true,
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule,
  ],
  templateUrl: './popular-products.component.html',
})
export class AppPopularProductsComponent implements OnInit {
  displayedColumns: string[] = ['products', 'payment', 'sold','menu'];
  dataSource: productsData[] = [];

  constructor(private ligneFactureService: LigneFactureService) {}

  ngOnInit(): void {
    this.ligneFactureService.getTopServices().subscribe((data) => {
      this.dataSource = data.map((item, index) => ({
        id: index + 1,
        imagePath: '', // You can set a default or dynamic image path if needed
        uname: item.ServiceName,
        price: `${item.Price.toFixed(2)}`,
        sold: item.TotalSold,
        paid: 'Full paid', // Example placeholder
        status: 'Confirmed', // Example placeholder
        progress: 'success', // Example placeholder
      }));
    });
  }
}
