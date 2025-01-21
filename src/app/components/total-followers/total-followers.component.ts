import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FactureAchatService } from 'src/app/services/factureAchat/facture-achat.service';

export interface totalfollowersChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string | any;
}

@Component({
  selector: 'app-total-followers',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, MatButtonModule, TablerIconsModule],
  templateUrl: './total-followers.component.html',
})
export class AppTotalFollowersComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public totalfollowersChart!: Partial<any> | any;
  public totalAchats: number = 0; // Total des achats
  public progressionPourcentage: number = 0; // Pourcentage de progression

  constructor(private factureAchatService: FactureAchatService) {
    this.totalfollowersChart = {
      series: [
        {
          name: 'Total Achats',
          data: [29, 52, 38, 47, 56], // Exemple, sera remplacé par les données dynamiques
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: 100,
        sparkline: { enabled: false },
      },
      grid: { show: false },
      colors: ['#ff6692'],
      plotOptions: {
        area: {
          borderRadius: 5,
        },
      },
      dataLabels: { enabled: false },
      xaxis: { labels: { show: false } },
      yaxis: { labels: { show: false } },
      tooltip: { theme: 'dark' },
      legend: { show: false },
    };
  }

  ngOnInit() {
    this.loadTotalAchats();
    this.loadTotalAchatsLastFiveMonths();
  }

  private loadTotalAchats(): void {
    this.factureAchatService.getIncomeStats().subscribe((data) => {
      this.totalAchats = data.currentMonthTotal;

    });
  }

  private loadTotalAchatsLastFiveMonths(): void {
    this.factureAchatService.getTotalAchatsLastFiveMonths().subscribe((data) => {
      // Mise à jour du total des achats (somme de 5 derniers mois)
      console.log(data)
      this.totalfollowersChart.series[0].data = data;

      // Calcul du pourcentage de progression
      const lastMonthTotal = data[data.length - 2] || 0; // Total du mois précédent

      this.progressionPourcentage = lastMonthTotal > 0
        ? ((this.totalAchats - lastMonthTotal) / lastMonthTotal) * 100
        : 100;
    });
  }

}
