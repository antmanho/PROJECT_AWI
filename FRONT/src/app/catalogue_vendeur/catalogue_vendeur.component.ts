import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/GameService'; // Chemin vers votre service

@Component({
  selector: 'app-catalogue-vendeur',
  templateUrl: './catalogue_vendeur.component.html',
  styleUrls: ['./catalogue_vendeur.component.css'],
})
export class CatalogueVendeurComponent implements OnInit {
  games: any[] = []; // Tableau pour stocker les jeux récupérés

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    const userEmail = 'vendeur1@example.com'; // À remplacer par l'email réel de l'utilisateur
    this.gameService.getGames(userEmail).subscribe(
      (data) => {
        this.games = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des jeux:', error);
      }
    );
  }
}
