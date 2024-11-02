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
}

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule], // Ajout de CommonModule ici
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
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
}
