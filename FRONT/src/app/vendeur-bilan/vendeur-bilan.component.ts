import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceVendeur, BilanResponse } from '../Services/service-vendeur.service'; // Import du service

Chart.register(...registerables);

@Component({
  selector: 'app-vendeur-bilan',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './vendeur-bilan.component.html',
  styleUrls: ['./vendeur-bilan.component.css'],
})
export class VendeurBilanComponent implements OnInit {

    bilanParticulier?: boolean;
    sessionParticuliere?: boolean;
    emailParticulier?: string;
    numeroSession?: string;
    reponse?: string;
    chargesFixes: number = 0;
    chart: Chart | undefined;
    ratioDisplay: string = '';

    constructor(
        private route: ActivatedRoute,
        private serviceVendeur: ServiceVendeur, // Injection du ServiceVendeur
        private cdRef: ChangeDetectorRef
    ) {}

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

    /** Récupération des données du bilan via le ServiceVendeur */
    fetchBilanData(): void {
        this.serviceVendeur.fetchBilanData(
            this.bilanParticulier || false,
            this.sessionParticuliere || false,
            this.emailParticulier || '',
            this.numeroSession || '',
            this.chargesFixes
        ).subscribe(
            (response: BilanResponse) => {
                console.log('Données du bilan récupérées:', response);

                if (response.message === "Aucun graphe ne peut être effectué, aucune vente réalisée pour cette situation") {
                    this.reponse = "aucune";
                } else if (response.listeX && response.listeYSomme && response.listeY3Somme) {
                    const { listeX, listeYSomme, listeY2Somme, listeY3Somme, totalQuantiteDeposee, totalQuantiteVendu } = response;

                    this.calculateRatio(totalQuantiteDeposee || 0, totalQuantiteVendu || 0);
                    
                    if (this.emailParticulier) {
                        this.createChart(listeX || [], listeY2Somme || [], listeY3Somme || [], totalQuantiteDeposee || 0, totalQuantiteVendu || 0, this.chargesFixes);
                    } else {
                        this.createChart(listeX || [], listeYSomme || [], listeY3Somme || [], totalQuantiteDeposee || 0, totalQuantiteVendu || 0, this.chargesFixes);
                    }

                    this.createPieChart(totalQuantiteDeposee || 0, totalQuantiteVendu || 0);
                    this.reponse = "graphique";
                    setTimeout(() => {
                        this.cdRef.detectChanges();
                    }, 0);
                } else {
                    console.error('Données manquantes dans la réponse:', response);
                    this.reponse = "aucune";
                }
            },
            (error: any) => {
                console.error('Erreur lors de la récupération des données du bilan:', error);
                this.reponse = "aucune";
            }
        );
    }

    /** Calcule le ratio de ventes */
    calculateRatio(totalDepose: number, totalVendu: number): void {
        if (totalDepose > 0) {
            const ratio = (totalVendu / totalDepose) * 100;
            this.ratioDisplay = `Ratio: ${ratio.toFixed(2)}%`;
        } else {
            this.ratioDisplay = 'Ratio: N/A';
        }
    }

    /** Crée le graphique principal */
    createChart(
        listeX: number[],
        listeY: number[],
        listeY3Somme: number[],
        totalQuantiteDeposee: number,
        totalQuantiteVendu: number,
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
                    { label: 'CA', data: listeY, borderColor: 'blue', fill: false },
                    { label: 'Charges fixes', data: chargesFixesData, borderColor: 'yellow', fill: false, borderDash: [5, 5] },
                    { label: 'Bénéfice Festival', data: listeY3Somme, borderColor: 'green', fill: false }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Quantité de vente' } },
                    y: { title: { display: true, text: 'Montant' } }
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
                    legend: { display: true, position: 'top' }
                }
            }
        });
    }

    /** Crée un graphique en camembert */
    createPieChart(totalDepose: number, totalVendu: number): void {
        const nonVendu = totalDepose - totalVendu;
        const venduPourcentage = (totalVendu / totalDepose) * 100;
        const nonVenduPourcentage = 100 - venduPourcentage;

        const pieChartCtx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');
        if (pieChartCtx) {
            new Chart(pieChartCtx, {
                type: 'pie',
                data: {
                    labels: [
                        `Total Vendu: ${totalVendu} jeux (${venduPourcentage.toFixed(2)}%)`,
                        `Total Non Vendu: ${nonVendu} jeux (${nonVenduPourcentage.toFixed(2)}%)`
                    ],
                    datasets: [{
                        data: [venduPourcentage, nonVenduPourcentage],
                        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.4)']
                    }]
                }
            });
        } else {
            console.error('Élément canvas non trouvé pour le graphique en camembert.');
        }
    }
}
