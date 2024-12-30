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
          name: 'Total',
          data: [29, 52, 38, 47, 56], // Exemple, sera remplacé
        },
        {
          name: 'Followers',
          data: [71, 71, 71, 71, 71], // Exemple, sera remplacé
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: 100,
        stacked: true,
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      grid: { show: false },
      colors: ['#ff6692', '#e7d0d9'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: [3],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
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
  }

  private loadTotalAchats(): void {
    this.factureAchatService.getIncomeStats().subscribe((data) => {
      this.totalAchats = data.currentMonthTotal;
      this.progressionPourcentage = data.progressPercentage;

      // Met à jour le graphique
      this.totalfollowersChart.series[0].data = [this.totalAchats];
      this.totalfollowersChart.series[1].data = [this.totalAchats * 0.5]; // Exemple
    });
  }
}
