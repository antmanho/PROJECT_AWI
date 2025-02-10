// src/app/detail-article/detail-article.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceAllService, Product } from '../Services/service-all.service'; // Import de Product
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-detail-article',
  standalone: true,
  imports: [CommonModule, RouterModule], // Modules nécessaires pour le composant standalone
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.css']
})
export class DetailArticleComponent implements OnInit {
  product: Product | null = null; // Utilisation de Product comme type
  id: number | null = null;

  constructor(private route: ActivatedRoute, private serviceAll: ServiceAllService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // Récupération de l'ID
    if (this.id) {
      this.fetchProductDetails(this.id); // Chargement des détails du produit
    }
  }

  fetchProductDetails(id: number): void {
    this.serviceAll.fetchProductDetails(id).subscribe(
      (data: Product) => { // Type explicite pour 'data'
        this.product = data;
      },
      (error: any) => { // Type explicite pour 'error'
        console.error('Erreur lors du chargement des détails du produit:', error);
      }
    );
  }
}
