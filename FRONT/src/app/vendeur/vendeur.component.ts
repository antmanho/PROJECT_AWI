import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceVendeur, Game, SoldGame } from '../Services/service-vendeur.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vendeur',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vendeur.component.html',
  styleUrls: ['./vendeur.component.css']
})
export class VendeurComponent implements OnInit {
  games: Game[] = [];
  soldGames: SoldGame[] = [];
  errorMessage: string | null = null;

  isSwitchOn: boolean = false;
  numeroSession: number = 0;
  chargesFixes: number | null = null;
  sessionParticuliere: boolean = false;
  emailConnecte: string | null = null;

  constructor(private serviceVendeur: ServiceVendeur) {}

  ngOnInit() {
    this.fetchCatalogue();
    this.fetchSoldGames();
  }

  /** Récupère le catalogue via le service */
  fetchCatalogue() {
    this.serviceVendeur.fetchCatalogue().subscribe(
      (data: { results: Game[]; email_connecte: string }) => {
        this.games = data.results.map(game => ({
          ...game,
          est_en_vente_label: game.est_en_vente ? 'OUI' : 'NON'
        }));
        this.emailConnecte = data.email_connecte;
        this.errorMessage = null;
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement du catalogue:', error);
        this.errorMessage = 'Impossible de charger le catalogue des jeux. Veuillez réessayer plus tard.';
      }
    );
  }

  /** Récupère les jeux vendus via le service */
  fetchSoldGames() {
    this.serviceVendeur.fetchSoldGames().subscribe(
      (data: SoldGame[]) => {
        this.soldGames = data;
        this.errorMessage = null;
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des jeux vendus:', error);
        this.errorMessage = 'Impossible de charger les jeux vendus. Veuillez réessayer plus tard.';
      }
    );
  }

  /** Gère l'état du switch */
  toggleSwitch() {
    this.isSwitchOn = !this.isSwitchOn;
  }

  /** Redirige vers la page du bilan */
  viewBilan() {
    console.log('Bilan demandé :');
    console.log('Numéro de session:', this.numeroSession);
    console.log('Charges fixes:', this.chargesFixes);

    const bilanParticulier = this.numeroSession !== 0 ? 'true' : 'false';
    const emailParticulier = this.emailConnecte || '';

    const bilanUrl = `http://localhost:4200/vendeur-bilan?bilanParticulier=${bilanParticulier}&sessionParticuliere=${this.sessionParticuliere}&emailParticulier=${emailParticulier}&numeroSession=${this.numeroSession}&chargesFixes=${this.chargesFixes}`;

    window.location.href = bilanUrl;
  }
}
