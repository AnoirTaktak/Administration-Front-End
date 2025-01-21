import { Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FactureVenteService } from 'src/app/services/factureVente/facture-vente.service';
import { MaterialModule } from 'src/app/material.module';


export interface TotalIncomeChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    responsive: ApexResponsive;
    grid: ApexGrid;
    fill: ApexFill;
    markers: ApexMarkers;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    colors: string | any;
}

@Component({
    selector: 'app-total-income',
    standalone: true,
    imports: [MaterialModule, NgApexchartsModule, MatButtonModule, TablerIconsModule],
    templateUrl: './total-income.component.html',
})
export class AppTotalIncomeComponent {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public totalincomeChart!: Partial<TotalIncomeChart> | any;

    totalIncome: number = 0;
    progressPercentage: number = 0;

    constructor(private factureService: FactureVenteService) {
        this.loadData();
        this.initChart();
        this.loadFactureVenteSeries()
    }

    // Charger les données depuis le service
    private loadData(): void {
        this.factureService.getIncomeStats().subscribe((data: any) => {
            this.totalIncome = data.currentMonthTotal;
            this.progressPercentage = data.progressPercentage;
        });
    }
    private loadFactureVenteSeries(): void {
      this.factureService.getFactureVenteSeries().subscribe((data: number[]) => {
        this.totalincomeChart.series[0].data = data;
      });
    }

    // Initialiser le graphique
    private initChart(): void {
        this.totalincomeChart = {
            chart: {
                id: "total-income",
                type: "area",
                height: 75,
                sparkline: {
                    enabled: true,
                },
                group: "sparklines",
                fontFamily: "inherit",
                foreColor: "#adb0bb",
            },
            series: [
                {
                    name: "Total Income",
                    color: "#8965E5",
                    data: [25, 66, 20, 40, 12, 58, 20], // Exemples statiques à remplacer si nécessaire
                },
            ],
            stroke: {
                curve: "smooth",
                width: 2,
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 0,
                    inverseColors: false,
                    opacityFrom: 0,
                    opacityTo: 0,
                    stops: [20, 180],
                },
            },
            markers: {
                size: 0,
            },
            tooltip: {
                theme: "dark",
                fixed: {
                    enabled: false,
                    position: "right",
                },
                x: {
                    show: false,
                },
            },
        };
    }
}
