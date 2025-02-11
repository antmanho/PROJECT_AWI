import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceAllService, Game } from '../Services/service-all.service';  // Importation correcte

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  games: Game[] = [];

  constructor(private serviceAll: ServiceAllService) {}

  ngOnInit() {
    this.fetchCatalogue();
  }

  fetchCatalogue() {
    this.serviceAll.fetchCatalogue().subscribe(
      data => {
        this.games = data.results;
      },
      error => console.error('Erreur lors du chargement du catalogue:', error)
    );
  }

}