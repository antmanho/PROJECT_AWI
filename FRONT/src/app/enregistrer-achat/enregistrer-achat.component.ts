import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importation du CommonModule

@Component({
  selector: 'app-enregistrer-achat',
  standalone: true,
  imports: [FormsModule, CommonModule], // Ajoutez CommonModule ici
  templateUrl: './enregistrer-achat.component.html',
  styleUrls: ['./enregistrer-achat.component.css']
})
export class EnregistrerAchatComponent {
  id_stock: number = 0;       // Initialisation de l'id_stock
  quantite_vendu: number = 0;  // Initialisation de la quantité vendue

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    // Prépare les données à envoyer
    const data = {
      id_stock: this.id_stock,
      quantite_vendu: this.quantite_vendu
    };

    // Appel à l'API pour enregistrer l'achat
    this.http.post('http://localhost:3000/enregistrer-achat', data)
      .subscribe(
        response => {
          console.log('Achat enregistré avec succès', response);
          // Réinitialisez le formulaire ou redirigez si nécessaire
          this.resetForm();
        },
        error => {
          console.error('Erreur lors de l’enregistrement de l’achat', error);
        }
      );
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.id_stock = 0;
    this.quantite_vendu = 0;
  }
}
