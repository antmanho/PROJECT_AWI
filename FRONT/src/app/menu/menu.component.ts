import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ServiceAllService } from '../Services/service-all.service';  // Importer le service

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
imports: [CommonModule]
})
export class MenuComponent implements OnInit {
  emailConnecte: string | null = null;
  role: string | null = null;

  constructor(private service: ServiceAllService) {}  // Injecter le service

  ngOnInit() {
    // Appeler la méthode du service pour récupérer les informations utilisateur
    this.service.getUserInfo().subscribe({
      next: (response) => {
        this.emailConnecte = response.email;
        this.role = response.role;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des informations utilisateur:', err);
      }
    });
  }

  deconnexion() {
    // Appeler la méthode du service pour la déconnexion
    this.service.logout().subscribe({
      next: (response) => {
        console.log(response.message);
        this.emailConnecte = 'invite@example.com'; // Réinitialiser l'email localement
        window.location.reload(); // Rafraîchir la page
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion:', err);
      }
    });
  }
}
