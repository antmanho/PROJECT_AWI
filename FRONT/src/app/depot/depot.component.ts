import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Importer HttpClient

@Component({
  selector: 'app-depot',
  standalone: true,
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css'],
  imports: [FormsModule, CommonModule]
})
export class DepotComponent {
  emailConnecte = "<%= email_connecte %>";
  isInSale = false;
  numSession: number | null = null;
  emailVendeur: string = '';
  nomJeu: string = '';
  prixUnit: number | null = null;
  quantiteDeposee: number | null = null;
  editeur: string = '';
  description: string = '';
  showOptionalFields = false;
  showNotification = false;

  constructor(private http: HttpClient) {} // Injecter HttpClient

  toggleOptionalFields() {
    this.showOptionalFields = !this.showOptionalFields;
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    // Préparer les données à envoyer
    const formData = {
      email_vendeur: this.emailVendeur,
      nom_jeu: this.nomJeu,
      prix_unit: this.prixUnit,
      quantite_deposee: this.quantiteDeposee,
      est_en_vente: this.isInSale,
      editeur: this.editeur,
      description: this.description,
      num_session: this.numSession,
    };

    try {
      // Envoyer les données au backend
      const response = await this.http.post('/depot', formData).toPromise();
      console.log('Réponse du serveur:', response);

      // Affichez la notification
      this.showNotification = true;

      // Masquez la notification après 3 secondes
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
    }
  }

  closeNotification() {
    this.showNotification = false;
  }
}
