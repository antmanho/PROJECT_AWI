import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceGestionnaireService } from '../Services/service-gestionnaire.service'; // Assurez-vous d'importer le service

@Component({
  selector: 'app-bilan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bilan.component.html',
  styleUrls: ['./bilan.component.css']
})
export class BilanComponent {
  bilanParticulier: boolean = false;
  sessionParticuliere: boolean = false;
  emailParticulier?: string;
  numeroSession?: string;
  errorMessage?: string;
  chargesFixes?: number;

  constructor(
    private service: ServiceGestionnaireService, // Injection du service
    private router: Router
  ) {}

  creerListe() {
    const requestBody = {
      bilanParticulier: this.bilanParticulier,
      sessionParticuliere: this.sessionParticuliere,
      emailParticulier: this.emailParticulier,
      numeroSession: this.numeroSession,
      chargesFixes: this.chargesFixes
    };

    this.service.creerBilanParticulier(requestBody).subscribe(
      (response: any) => {
        if (response.message) {
          console.log('Erreur');
          // Affiche le message d'erreur sous le formulaire
          this.errorMessage = response.message;
        } else {
          console.log('Bilan créé');
          // Redirection vers /bilan/graphe avec les données
          this.router.navigate(['/bilan-graphe'], {
            queryParams: {
              bilanParticulier: this.bilanParticulier,
              sessionParticuliere: this.sessionParticuliere,
              emailParticulier: this.emailParticulier,
              numeroSession: this.numeroSession,
              totalQuantitéDéposée: response.totalQuantitéDéposée || 0,
              totalQuantitéVendu: response.totalQuantitéVendu || 0,
              chargesFixes: this.chargesFixes
            }
          });
        }
      },
      (error: any) => {
        console.error('Erreur lors de la création de la liste:', error);
      }
    );
  }
}
