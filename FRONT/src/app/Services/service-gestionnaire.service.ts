import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './BASE_URL'; // Importez la constante depuis BASE_URL.ts

// Interface pour structurer les données des jeux en vente
export interface Game {
  id_stock: number;
  nom_jeu: string;
  Prix_unit: number;
  photo_path: string;
  Frais_depot_fixe: number;
  Frais_depot_percent: number;
  prix_final: number; // Prix ajusté incluant les frais
  est_en_vente: boolean; // Attribut manquant ajouté
}

// Interface pour structurer les données des jeux à retirer
export interface Jeu {
  id_stock: string;
  Quantite_actuelle: number;
  nom_jeu: string;
  Prix_unit: number;
  selectionne?: boolean;
  quantiteARetirer?: number;
}

// Interface pour l'historique des ventes
export interface Vente {
  id_vente: string;
  date: string;
  montant: number;
  Somme_total_du: number;
  email_vendeur: string;        // Ajout de l'email du vendeur
  nom_jeu: string;             // Nom du jeu
  Quantite_vendu: number;      // Quantité vendue
  Prix_unit: number;           // Prix unitaire du jeu
  vendeur_paye: boolean;       // Indication si le vendeur est payé
}

// Interface pour structurer les données d'un achat enregistré
export interface Achat {
  id_stock: number;
  quantite_vendu: number;
}
export interface Session {
  id: string;
  name: string;
  // Ajoutez d'autres propriétés pertinentes ici
}
// Interface pour les données du bilan graphique
export interface BilanData {
  listeX: number[];
  listeYSomme: number[];
  listeY2Somme: number[];
  listeY3Somme: number[];
  totalQuantiteDeposee: number;
  totalQuantiteVendu: number;
}
@Injectable({
  providedIn: 'root'
})
export class ServiceGestionnaireService {

  private apiUrl = API_BASE_URL; // URL de votre back-end (à configurer dans l'environnement si nécessaire)

  constructor(private http: HttpClient) { }

  // Récupérer le catalogue des jeux en vente
  fetchCatalogue(): Observable<{ results: Game[] }> {
    return this.http.get<{ results: Game[] }>(`${this.apiUrl}/api/catalogue`, { withCredentials: true });
  }

  // Mettre à jour le statut de mise en vente d'un jeu
  toggleEnVente(game: Game): Observable<any> {
    const newStatus = !game.est_en_vente;
    return this.http.put(`${this.apiUrl}/api/stock/${game.id_stock}/toggle-vente`, { est_en_vente: newStatus }, { withCredentials: true });
  }

  // Récupérer la liste des jeux à retirer pour un utilisateur par email
  fetchJeux(email: string): Observable<Jeu[]> {
    return this.http.get<Jeu[]>(`${this.apiUrl}/retrait-liste/${email}`, { withCredentials: true });
  }

  // Effectuer la requête pour retirer les jeux sélectionnés
  retirerJeux(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/retrait`, data, { withCredentials: true });
  }

  // Récupérer l'historique des ventes d'un vendeur par email
  fetchHistoriqueVentes(emailVendeur: string): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}/historique-vente/${emailVendeur}`, { withCredentials: true });
  }

  // Payer un vendeur
  payerVendeur(emailVendeur: string): Observable<{ message: string, refresh: boolean }> {
    const payload = { email: emailVendeur };
    return this.http.post<{ message: string, refresh: boolean }>(`${this.apiUrl}/payer-vendeur-liste`, payload, { withCredentials: true });
  }

  // Enregistrer un achat
  enregistrerAchat(data: Achat): Observable<any> {
    return this.http.post(`${this.apiUrl}/enregistrer-achat`, data, { withCredentials: true });
  }
    
    
    // Créer un bilan particulier
    creerBilanParticulier(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/bilan`, data, { withCredentials: true });
    }
    // Méthode pour récupérer les données du bilan
      fetchBilanData(
        bilanParticulier: boolean,
        sessionParticuliere: boolean,
        emailParticulier: string,
        numeroSession: string,
        chargesFixes: number
      ): Observable<BilanData> {
        const url = `${this.apiUrl}/bilan-graphe?bilanParticulier=${bilanParticulier}&sessionParticuliere=${sessionParticuliere}&emailParticulier=${emailParticulier}&numeroSession=${numeroSession}&chargesFixes=${chargesFixes}`;
        return this.http.get<BilanData>(url, { withCredentials: true });
      }
    // 🟢 Récupérer toutes les sessions disponibles
      fetchAllSessions(): Observable<Session[]> {
        return this.http.get<Session[]>(`${this.apiUrl}/get_all_sessions`, { withCredentials: true });
      }

      // 🟢 Récupérer les informations d'une session spécifique
      fetchSessionInfo(numSession: string): Observable<Session> {
        return this.http.get<Session>(`${this.apiUrl}/get_info_sess/${numSession}`, { withCredentials: true });
      }

      // 🟢 Soumettre le formulaire de dépôt
      submitDepot(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/depot`, formData, { withCredentials: true });
      }
}
