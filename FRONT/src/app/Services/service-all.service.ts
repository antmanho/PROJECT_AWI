// src/app/Services/service-all.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './BASE_URL'; // Importer la constante API_BASE_URL

export interface Game {
  id_stock: number;
  nom_jeu: string;
  Prix_unit: number;
  photo_path: string;
  Frais_depot_fixe: number;
  Frais_depot_percent: number;
  prix_final: number;
}

export interface UserInfo {
  email: string;
  role: string;
}

export interface Product {
  id_stock: number;
  nom_jeu: string;
  Prix_unit: number;
  photo_path: string;
  Frais_depot_fixe: number;
  Frais_depot_percent: number;
  prix_final: number;
  est_en_vente: boolean;
  editeur?: string | null;
  description?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceAllService {

  private baseUrl = API_BASE_URL; // Utiliser l'URL de base importée

  constructor(private http: HttpClient) {}

  fetchCatalogue(): Observable<any> {
    return this.http.get<{ results: any[] }>(`${this.baseUrl}/api/catalogue`, { withCredentials: true });
  }

  // Fetch User Info
  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/api/user-info`, { withCredentials: true });
  }

  // User Logout
  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/deconnexion`, {}, { withCredentials: true });
  }

  changePassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/changer_mdp/${email}`, { new_password: newPassword, confirm_password: confirmPassword });
  }

  verifyEmail(email: string, code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verification-email`, { email, code_recu: code }, { withCredentials: true });
  }

  login(email: string, password: string): Observable<{ redirectUrl: string, success: boolean, message: string }> {
    return this.http.post<{ redirectUrl: string, success: boolean, message: string }>(
      `${this.baseUrl}/api/connexion`,
      { email, password },
      { withCredentials: true }
    );
  }

  fetchProductDetails(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/api/detail/${id}`, { withCredentials: true });
  }

  // Méthode pour la demande de réinitialisation du mot de passe
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/mdp_oublie`, { email }, { withCredentials: true });
  }

  // Méthode pour l'inscription d'un nouvel utilisateur
  register(email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/inscription`, {
      email,
      password,
      confirmPassword
    }, { withCredentials: true });
  }
}
