import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
  imports: [CommonModule]
})
export class Droot implements OnInit {
  emailConnecte: string | null = null;
  role: string | null = null; // Variable pour stocker le rôle de l'utilisateur

  constructor(private http: HttpClient) {}

  ngOnInit() {
      // Initialiser la session à l'aide d'une requête GET
      this.http.get<{ situation: string, email_connecte: string }>('http://localhost:3000/root', { withCredentials: true })
        .subscribe({
          next: (response) => {
            console.log('Session initialisée:', response);
            // Vous pouvez définir l'email connecté ici si nécessaire
            this.emailConnecte = response.email_connecte; // Exemple d'assignation si la réponse contient l'email
          },
          error: (err) => {
            console.error('Erreur lors de l\'initialisation de la session:', err);
          }
        });
    this.http.get<{ email: string; role: string }>('http://localhost:3000/api/user-info', { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.emailConnecte = response.email; // Stocker l'email dans une variable
          this.role = response.role; // Stocker le rôle dans une variable
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
        }
      });
  }
}

 

 
