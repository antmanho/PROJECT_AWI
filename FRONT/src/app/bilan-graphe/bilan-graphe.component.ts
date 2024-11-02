import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-bilan-graphe',
  templateUrl: './bilan-graphe.component.html',
  styleUrls: ['./bilan-graphe.component.css']
})
export class BilanGrapheComponent implements OnInit {
    bilanParticulier?: boolean;
    sessionParticuliere?: boolean;
    emailParticulier?: string;
    numeroSession?: string;
chargesFixes: number = 0;
chart: Chart | undefined; // Déclarer le type comme Chart
ratioDisplay: string = ''; // Propriété pour le ratio
    
    constructor(private route: ActivatedRoute, private http: HttpClient) {}
    
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.bilanParticulier = params['bilanParticulier'] === 'true';
            this.sessionParticuliere = params['sessionParticuliere'] === 'true';
            this.emailParticulier = params['emailParticulier'];
            this.numeroSession = params['numeroSession'];
            this.chargesFixes = +params['chargesFixes'] || 0;
            
            this.fetchBilanData();
        });
    }
    
    fetchBilanData(): void {
        const url = `http://localhost:3000/bilan-graphe?bilanParticulier=${this.bilanParticulier}&sessionParticuliere=${this.sessionParticuliere}&emailParticulier=${this.emailParticulier}&numeroSession=${this.numeroSession}&chargesFixes=${this.chargesFixes}`;
        
        console.log('URL de la requête:', url);
        this.http.get(url).subscribe(
                                     (response: any) => {
                                         console.log('Données du bilan récupérées:', response);
                                         if (response.listeX && response.listeYSomme && response.listeY3Somme) {
                                             const { listeX, listeYSomme, listeY2Somme, listeY3Somme, totalQuantitéDéposée, totalQuantitéVendu } = response;
                                             
                                             this.calculateRatio(totalQuantitéDéposée, totalQuantitéVendu);
                                             
                                             if (this.emailParticulier) {
                                                 this.createChart(listeX, listeY2Somme, listeY3Somme, totalQuantitéDéposée, totalQuantitéVendu, this.chargesFixes);
                                             } else {
                                                 this.createChart(listeX, listeYSomme, listeY3Somme, totalQuantitéDéposée, totalQuantitéVendu, this.chargesFixes);
                                             }
                                             
                                             this.createPieChart(totalQuantitéDéposée, totalQuantitéVendu);
                                         } else {
                                             console.error('Données manquantes dans la réponse:', response);
                                         }
                                     },
                                     (error: any) => {
                                         console.error('Erreur lors de la récupération des données du bilan:', error);
                                     }
                                     );
    }
    
    calculateRatio(totalDéposé: number, totalVendu: number): void {
        if (totalDéposé > 0) {
            const ratio = (totalVendu / totalDéposé) * 100;
            this.ratioDisplay = `Ratio: ${ratio.toFixed(2)}%`;
        } else {
            this.ratioDisplay = 'Ratio: N/A';
        }
    }
    
    createChart(
                listeX: number[],
                listeY: number[],
                listeY3Somme: number[],
                totalQuantitéDéposée: number,
                totalQuantitéVendu: number,
                chargesFixes: number
                ): void {
                    if (this.chart) {
                        this.chart.destroy();
                    }
                    
                    const chargesFixesData = Array(listeX.length).fill(chargesFixes);
                    
                    this.chart = new Chart('canvas', {
                    type: 'line',
                    data: {
                    labels: listeX,
                    datasets: [
                        {
                        label: 'CA',
                        data: listeY,
                        borderColor: 'blue',
                        fill: false
                        },
                        {
                        label: 'Charges fixes',
                        data: chargesFixesData,
                        borderColor: 'yellow',
                        fill: false,
                        borderDash: [5, 5]
                        },
                        {
                        label: 'Bénéfice Festival',
                        data: listeY3Somme,
                        borderColor: 'green',
                        fill: false
                        }
                    ]
                    },
                    options: {
                    responsive: true,
                    scales: {
                    x: {
                    title: {
                    display: true,
                    text: 'Quantité de vente'
                    }
                    },
                    y: {
                    title: {
                    display: true,
                    text: 'Montant '
                    }
                    }
                    },
                    plugins: {
                    tooltip: {
                    callbacks: {
                    label: (tooltipItem) => {
                        const label = tooltipItem.dataset.label || '';
                        const montant = tooltipItem.raw;
                        return `${label}: ${montant}`;
                    }
                    }
                    },
                    legend: {
                    display: true,
                    position: 'top'
                    }
                    }
                    }
                    });
                }
    
    createPieChart(totalDéposé: number, totalVendu: number): void {
        const nonVendu = totalDéposé - totalVendu;
        const venduPourcentage = (totalVendu / totalDéposé) * 100;
        const nonVenduPourcentage = 100 - venduPourcentage;
        
        const pieChartData = [venduPourcentage, nonVenduPourcentage];
        const pieChartLabels = [
            `Total Vendu: ${totalVendu} jeux (${venduPourcentage.toFixed(2)}%)`,
            `Total Non Vendu: ${nonVendu} jeux (${nonVenduPourcentage.toFixed(2)}%)`,
            `Total Déposé: ${totalDéposé} jeux` // Ajout du total dans la légende
        ];
        
        const pieChartCtx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');
        if (pieChartCtx) {
            new Chart(pieChartCtx, {
            type: 'pie',
            data: {
            labels: pieChartLabels,
            datasets: [{
            data: [venduPourcentage, nonVenduPourcentage],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.4)']
            }]
            },
            options: {
            responsive: true,
            plugins: {
            legend: {
            display: true,
            position: 'top',
            labels: {
            font: {
            size: 14
            }
            }
            },
            tooltip: {
            callbacks: {
            label: (tooltipItem) => {
                const label = tooltipItem.label || '';
                const value = tooltipItem.raw as number; // Spécification du type ici
                return `${label}: ${value.toFixed(2)}%`;
            }
            }
            }
            }
            }
            });
        } else {
            console.error('Élément canvas non trouvé pour le graphique en camembert.');
        }
    }
}
