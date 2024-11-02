import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  numeroSession?: string ;
  errorMessage?: string ;
  chargesFixes?: number ; // ou une valeur par défaut si nécessaire

  constructor(private http: HttpClient, private router: Router) {}

  creerListe() {
      const requestBody = {
          bilanParticulier: this.bilanParticulier,
          sessionParticuliere: this.sessionParticuliere,
          emailParticulier: this.bilanParticulier ,
          numeroSession: this.sessionParticuliere ,
          chargesFixes: this.chargesFixes // Ajout des charges fixes ici
      };

      this.http.post('http://localhost:3000/bilan', requestBody).subscribe(
          (response: any) => {
              if (response.message) {
                  console.log("erreur");
                  // Affiche le message d'erreur sous le formulaire
                  this.errorMessage = response.message;
              } else {
                  console.log("wewe");
                  // Redirection vers /bilan/graphe avec les données
                  this.router.navigate(['/bilan-graphe'], {
                      queryParams: {
                          bilanParticulier: this.bilanParticulier,
                          sessionParticuliere: this.sessionParticuliere,
                          emailParticulier: this.emailParticulier,
                          numeroSession: this.numeroSession,
                          totalQuantitéDéposée: response.totalQuantitéDéposée || 0, // Ajoutez totalQuantitéDéposée de la réponse
                          totalQuantitéVendu: response.totalQuantitéVendu || 0, // Ajoutez totalQuantitéVendu de la réponse
                          chargesFixes: this.chargesFixes // Ajoutez chargesFixes
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
