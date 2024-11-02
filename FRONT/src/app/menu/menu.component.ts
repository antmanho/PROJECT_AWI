import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule]
})
export class MenuComponent implements OnInit {
  emailConnecte: string | null = null;
  role: string | null = null; // Variable pour stocker le rôle de l'utilisateur

  constructor(private http: HttpClient) {}

  ngOnInit() {
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
