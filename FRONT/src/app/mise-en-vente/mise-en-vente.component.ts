import { Component, OnInit } from '@angular/core';
import { ServiceGestionnaireService, Game } from '../Services/service-gestionnaire.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-mise-en-vente',
standalone: true,
  templateUrl: './mise-en-vente.component.html',
  styleUrls: ['./mise-en-vente.component.css'],
imports: [CommonModule, FormsModule] 
})
export class MiseEnVenteComponent implements OnInit {
  games: Game[] = [];

  constructor(private service: ServiceGestionnaireService) {}

  ngOnInit() {
    this.fetchCatalogue();
  }

  fetchCatalogue() {
    this.service.fetchCatalogue().subscribe(
      data => this.games = data.results,
      error => console.error('Erreur lors du chargement du catalogue:', error)
    );
  }

  toggleEnVente(game: Game) {
    this.service.toggleEnVente(game).subscribe(
      () => {
        // Mettre à jour le statut localement
        game.est_en_vente = !game.est_en_vente;
        console.log(`Statut de vente mis à jour pour le jeu ${game.nom_jeu}`);
      },
      error => {
        console.error('Erreur lors de la mise à jour du statut de vente:', error);
      }
    );
  }
}
