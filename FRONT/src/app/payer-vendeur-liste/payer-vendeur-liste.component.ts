import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceGestionnaireService, Vente } from '../Services/service-gestionnaire.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payer-vendeur-liste',
  standalone: true,
  templateUrl: './payer-vendeur-liste.component.html',
  styleUrls: ['./payer-vendeur-liste.component.css'],
  imports: [FormsModule, CommonModule]
})
export class PayerVendeurListeComponent implements OnInit {
  emailVendeur: string = "";
  historiqueVentes: Vente[] = [];
  showNotification = false;

  constructor(
    private route: ActivatedRoute,
    private serviceGestionnaire: ServiceGestionnaireService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.emailVendeur = params['email'];
      this.fetchHistoriqueVentes();
      
    });
  }

  fetchHistoriqueVentes() {
    this.serviceGestionnaire.fetchHistoriqueVentes(this.emailVendeur).subscribe(
      data => {
        this.historiqueVentes = data;
          console.log(this.historiqueVentes);
      },
      error => {
        console.error('Erreur lors de la récupération des ventes:', error);
      }
    );
  }

  redirectToHistorique(email: string) {
    this.router.navigate([`/historique-vente`, email]);
  }

  onSubmit() {
    this.serviceGestionnaire.payerVendeur(this.emailVendeur).subscribe({
      next: (response) => {
          // Rafraîchir la page après l'envoi des données
          window.scrollTo({
            top: 0,
            behavior: 'smooth' // Ajoute une animation fluide
          });

          this.showNotification = true;
          setTimeout(() => this.showNotification = false, 5000);
        console.log(response.message);
          // Rafraîchit la page après 5 secondes
              setTimeout(() => {
                  window.location.reload();
              }, 5000);
        
          
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }
    closeNotification() {
      this.showNotification = false;
    }
}
