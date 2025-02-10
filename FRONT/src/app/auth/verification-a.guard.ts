import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Importation de "of" pour créer un observable
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class Verification_A implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(route: any): Observable<boolean> | Promise<boolean> | boolean {
      return this.http.get<{ valid: boolean }>('http://localhost:3000/verification_A', { withCredentials: true }).pipe(
      map((response) => {
        if (response.valid) {
          return true; // Autoriser l'accès à la route
        } else {
          this.router.navigate(['/pas-le-role']); // Redirection en cas de rôle incorrect
          return false;
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la vérification:', error);
        this.router.navigate(['/pas-le-role']); // Redirection en cas d'erreur
        return of(false); // Retourner un Observable avec "false" pour indiquer que l'accès est refusé
      })
    );
  }
}
