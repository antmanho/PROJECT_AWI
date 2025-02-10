// src/app/Services/service-vendeur.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './BASE_URL'; // Importez la constante API_BASE_URL

export interface Game {
  id_stock: number;
  nom_jeu: string;
  Prix_unit: number;
  photo_path: string;
  Frais_depot_fixe: number;
  Frais_depot_percent: number;
  prix_final: number;
  est_en_vente: boolean;
  est_en_vente_label: string;
}

export interface SoldGame {
  nom_jeu: string;
  Prix_unit: number;
  photo_path: string;
  Quantite_vendu: number;
}

export interface BilanResponse {
  message?: string;
  listeX?: number[];
  listeYSomme?: number[];
  listeY2Somme?: number[];
  listeY3Somme?: number[];
  totalQuantiteDeposee?: number;
  totalQuantiteVendu?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceVendeur {
  private catalogueUrl = `${API_BASE_URL}/api/catalogue-vendeur`;
  private soldGamesUrl = `${API_BASE_URL}/api/vendus`;
  private bilanUrl = `${API_BASE_URL}/bilan-graphe`;

  constructor(private http: HttpClient) {}

  /** Récupère le catalogue des jeux */
  fetchCatalogue(): Observable<{ results: Game[]; email_connecte: string }> {
    return this.http.get<{ results: Game[]; email_connecte: string }>(this.catalogueUrl, { withCredentials: true });
  }

  /** Récupère les jeux vendus */
  fetchSoldGames(): Observable<SoldGame[]> {
    return this.http.get<SoldGame[]>(this.soldGamesUrl, { withCredentials: true });
  }

  /**
   * Récupère les données du bilan vendeur
   * @param bilanParticulier Spécifie si le bilan est particulier
   * @param sessionParticuliere Spécifie si la session est particulière
   * @param emailParticulier Email spécifique pour le bilan
   * @param numeroSession Numéro de la session
   * @param chargesFixes Charges fixes appliquées
   */
  fetchBilanData(
    bilanParticulier: boolean,
    sessionParticuliere: boolean,
    emailParticulier: string,
    numeroSession: string,
    chargesFixes: number
  ): Observable<BilanResponse> {
    const url = `${this.bilanUrl}?bilanParticulier=${bilanParticulier}&sessionParticuliere=${sessionParticuliere}&emailParticulier=${emailParticulier}&numeroSession=${numeroSession}&chargesFixes=${chargesFixes}`;
    console.log('URL de la requête bilan:', url);

    return this.http.get<BilanResponse>(url, { withCredentials: true });
  }
}

