
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceGestionnaireService, Jeu } from '../Services/service-gestionnaire.service'; // Importation du service et des interfaces

@Component({
  standalone: true,
  selector: 'app-retrait-liste',
  templateUrl: './retrait-liste.component.html',
  styleUrls: ['./retrait-liste.component.css'],
  imports: [CommonModule],
})
export class RetraitListeComponent implements OnInit {
  jeux: Jeu[] = [];
  email: string = '';

  constructor(
    private serviceGestionnaire: ServiceGestionnaireService, // Injection du service
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email'];
      this.fetchJeux();
    });
  }

  fetchJeux(): void {
    this.serviceGestionnaire.fetchJeux(this.email).subscribe(
      (data) => {
        this.jeux = data.map(jeu => ({ ...jeu, selectionne: false, quantiteARetirer: 0 })); // Ajouter des champs pour la sélection
      },
      (error) => {
        console.error('Erreur lors de la récupération des jeux :', error);
      }
    );
  }

  updateSelection(jeu: Jeu): void {
    jeu.selectionne = !jeu.selectionne;
    if (!jeu.selectionne) {
      jeu.quantiteARetirer = 0; // Réinitialiser la quantité si non sélectionné
    }
  }

  retirerJeux(): void {
    const jeuxSelectionnes = this.jeux.filter(jeu => jeu.selectionne);

    if (jeuxSelectionnes.length === 0) {
      alert('Veuillez sélectionner au moins un jeu à retirer.');
      return;
    }

    const requests = jeuxSelectionnes.map(jeu => {
      const idStock = jeu.id_stock;
      const nombreCheckboxSelectionneCetId = this.jeux.filter(j => j.id_stock === idStock && j.selectionne).length;
      const quantiteActuelle = jeu.Quantite_actuelle;

      const data = {
        id_stock: idStock,
        nombre_checkbox_selectionne_cet_id: nombreCheckboxSelectionneCetId,
      };

      return this.serviceGestionnaire.retirerJeux(data).toPromise().then(() => {
        if (nombreCheckboxSelectionneCetId === quantiteActuelle) {
          this.jeux = this.jeux.filter(j => j.id_stock !== idStock);
        } else if (nombreCheckboxSelectionneCetId < quantiteActuelle) {
          jeu.Quantite_actuelle -= nombreCheckboxSelectionneCetId;
        }
      });
    });

    Promise.all(requests).then(() => {
      window.location.reload(); // Rafraîchir la page une fois toutes les requêtes terminées
    }).catch(error => {
      console.error('Erreur lors de la suppression ou mise à jour :', error);
    });
  }
}
