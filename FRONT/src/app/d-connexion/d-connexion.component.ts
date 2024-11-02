import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

  constructor(private http: HttpClient, private router: Router) {}

    onSubmit() {
        this.errorMessage = null;

        if (!this.email || !this.password) {
            this.errorMessage = 'Veuillez remplir tous les champs correctement.';
            return;
        }

        const body = { email: this.email, password: this.password };
        console.log('Données envoyées:', body);

        // Ajout de withCredentials: true
        this.http.post<{ redirectUrl: string, success: boolean, message: string }>('http://localhost:3000/api/connexion', body, { withCredentials: true })
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        // Vérification si dans une iframe
                        if (window !== window.parent) {
                            // Si l'application est dans une iframe, rediriger vers /menu
                            window.parent.location.href = '/menu';
                        } else {
                            // Redirection normale si ce n'est pas dans une iframe
                            this.router.navigate([response.redirectUrl]);
                        }
                    } else {
                        // Si le compte n'est pas trouvé ou autre erreur
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

