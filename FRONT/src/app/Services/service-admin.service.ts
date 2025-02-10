// src/app/Services/service-admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './BASE_URL'; // Importer la constante API_BASE_URL

// Définir les interfaces pour la réponse de l'API
export interface ApiResponse {
  message: string;
  status: string;
}

export interface User {
  id: string;
  nom: string;
  mdp: string;
  telephone: string;
  adresse: string;
  role: string;
  isModified: boolean;
  email: string;  // Ajoutez cette ligne
}

export interface Session {
  id: string;
  Nom_session: string;  // Changez 'nom' en 'Nom_session'
  date_debut: string;
  date_fin: string;
  adresse_session: string;
  Charge_totale: number;
  Frais_depot_fixe: number;
  Frais_depot_percent: number;
  Description: string;
  isModified: boolean;
}

export interface CreerSessionRequest {
  email_connecte: string;
  Nom_session: string;
  adresse_session: string;
  date_debut: string;
  date_fin: string;
  Frais_depot_fixe: number;
  Frais_depot_percent: number;
  Description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceAdminService {

  private baseUrl = API_BASE_URL;  // Utiliser l'URL de base importée
  private apiUrl = `${this.baseUrl}/api/sessions`;  // URL pour les sessions
  private creerSessionUrl = `${this.baseUrl}/creer-session`; // URL pour créer une session
  private apiUsersUrl = `${this.baseUrl}/api/users`; // URL pour les utilisateurs

  constructor(private http: HttpClient) {}

  // Récupérer les sessions depuis le backend
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl, { withCredentials: true });
  }

  // Sauvegarder les modifications des sessions
  saveSessions(modifiedSessions: Session[]): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.apiUrl, modifiedSessions, { withCredentials: true });
  }

  // Créer une nouvelle session
  createSession(session: CreerSessionRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.creerSessionUrl, session, { withCredentials: true });
  }

  // Récupérer les utilisateurs depuis le backend
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUsersUrl, { withCredentials: true });
  }
    preinscrireUser(email: string, role: string): Observable<ApiResponse> {
      const url = `${this.baseUrl}/preinscription`;
      return this.http.post<ApiResponse>(url, { email, role }, { withCredentials: true });
    }

  // Sauvegarder les modifications des utilisateurs
  saveUsers(modifiedUsers: User[]): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.apiUsersUrl, modifiedUsers, { withCredentials: true });
  }
}
