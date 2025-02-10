
import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { ServiceAllService } from '../Services/service-all.service'; // Make sure the path is correct

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './root.component.html', // Update the template as needed
  styleUrls: ['./root.component.css'],
imports: [CommonModule]
})
export class Droot implements OnInit {
  emailConnecte: string | null = null;
  role: string | null = null;

  constructor(private service: ServiceAllService) {}

  ngOnInit(): void {
    // Fetch user info on initialization
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

  // Handle user logout
  deconnexion(): void {
    this.service.logout().subscribe({
      next: (response) => {
        console.log(response.message);
        this.emailConnecte = 'invite@example.com'; // Reset local email
        window.location.reload(); // Refresh the page
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion:', err);
      }
    });
  }
}
