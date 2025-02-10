import { Component } from '@angular/core';
import { ServiceGestionnaireService, Achat } from '../Services/service-gestionnaire.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importation du CommonModule

@Component({
  selector: 'app-enregistrer-achat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './enregistrer-achat.component.html',
  styleUrls: ['./enregistrer-achat.component.css']
})
export class EnregistrerAchatComponent {
  id_stock: number = 0;       // Initialisation de l'id_stock
  quantite_vendu: number = 0; // Initialisation de la quantité vendue
  showNotification = false;

  constructor(private service: ServiceGestionnaireService) {}

  onSubmit(): void {
    const data: Achat = {
      id_stock: this.id_stock,
      quantite_vendu: this.quantite_vendu
    };

    this.service.enregistrerAchat(data).subscribe(
      response => {
        console.log('Achat enregistré avec succès', response);

        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.showNotification = true;
        setTimeout(() => this.showNotification = false, 5000);

        this.resetForm();
      },
      error => {
        console.error('Erreur lors de l’enregistrement de l’achat', error);
      }
    );
  }

  resetForm(): void {
    this.id_stock = 0;
    this.quantite_vendu = 0;
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}
