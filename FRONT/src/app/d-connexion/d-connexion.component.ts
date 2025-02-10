import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceAllService } from '../Services/service-all.service';

@Component({
  selector: 'app-d-connexion',
  templateUrl: './d-connexion.component.html',
  styleUrls: ['./d-connexion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DconnexionComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private serviceAll: ServiceAllService, private router: Router) {}

  onSubmit() {
    this.errorMessage = null;

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    console.log('Données envoyées:', { email: this.email, password: this.password });

    this.serviceAll.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          // Vérification si dans une iframe
          if (window !== window.parent) {
            window.parent.location.href = '/menu';
          } else {
            this.router.navigate([response.redirectUrl]);
          }
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
        console.error('Erreur lors de la connexion :', err);
      }
    });
  }
}
