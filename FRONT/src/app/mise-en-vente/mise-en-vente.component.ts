import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Game {
  id_stock: number;
  nom_jeu: string;
  Prix_unit: number;
  photo_path: string;
  Frais_depot_fixe: number;
  Frais_depot_percent: number;
  prix_final: number; // Prix ajusté incluant les frais
  est_en_vente: boolean; // Attribut manquant ajouté
}


@Component({
  selector: 'app-mise-en-vente',
  standalone: true,
  imports: [CommonModule], // Ajout de CommonModule ici
  templateUrl: './mise-en-vente.component.html',
  styleUrls: ['./mise-en-vente.component.css']
})
export class MiseEnVenteComponent implements OnInit {
  games: Game[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCatalogue();
  }

  fetchCatalogue() {
    this.http.get<Game[]>('http://localhost:3000/api/catalogue').subscribe(
      data => this.games = data,
      error => console.error('Erreur lors du chargement du catalogue:', error)
    );
  }
    toggleEnVente(game: Game) {
        const newStatus = !game.est_en_vente;
        this.http.put(`http://localhost:3000/api/stock/${game.id_stock}/toggle-vente`, { est_en_vente: newStatus })
            .subscribe(
                () => {
                    // Mettre à jour le statut localement
                    game.est_en_vente = newStatus;
                    console.log(`Statut de vente mis à jour pour le jeu ${game.nom_jeu}`);
                },
                error => {
                    console.error('Erreur lors de la mise à jour du statut de vente:', error);
                }
            );
    }

}
