import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importer CommonModule

@Component({
  selector: 'app-payer-vendeur-liste',
  standalone: true,
  templateUrl: './payer-vendeur-liste.component.html',
  styleUrls: ['./payer-vendeur-liste.component.css'],
  imports: [FormsModule, CommonModule] // Ajouter CommonModule ici
})
export class PayerVendeurListeComponent implements OnInit {
  emailVendeur: string = "";
  historiqueVentes: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.emailVendeur = params['email'];
      this.fetchHistoriqueVentes();
    });
  }

    fetchHistoriqueVentes() {
      this.http.get<any[]>(`http://localhost:3000/historique-vente/${this.emailVendeur}`).subscribe(data => {
        // Supposons que 'data' est un tableau d'objets avec la somme
        this.historiqueVentes = data;

        // Vous pouvez récupérer la somme totale ici si nécessaire, ou simplement l'afficher directement
      }, error => {
        console.error('Erreur lors de la récupération des ventes:', error);
      });
    }

  redirectToHistorique(email: string) {
    this.router.navigate([`/historique-vente`, email]);
  }

    onSubmit() {
        const payload = { email: this.emailVendeur };

        this.http.post<{ message: string, refresh: boolean }>('http://localhost:3000/payer-vendeur-liste', payload)
            .subscribe({
                next: (response) => {
                    console.log(response.message); // Affichez le message de succès
                    if (response.refresh) {
                        window.location.reload(); // Rafraîchissez la page si "refresh" est vrai
                    }
                },
                error: (error) => {
                    console.error('Erreur lors de la mise à jour:', error);
                }
            });
    }

}
