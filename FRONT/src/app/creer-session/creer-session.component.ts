import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceAdminService, CreerSessionRequest } from '../Services/service-admin.service';  // Import du service
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-creer-session',
  standalone: true,
  templateUrl: './creer-session.component.html',
  styleUrls: ['./creer-session.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CreerSessionComponent {
  showOptionalFields = false;
  notificationMessage: string | null = null; // Déclaration de notificationMessage

  session: CreerSessionRequest = {
    email_connecte: '',
    Nom_session: '',
    adresse_session: '',
    date_debut: '',
    date_fin: '',
    Frais_depot_fixe: 0,
    Frais_depot_percent: 0,
    Description: ''
  };

  constructor(private service: ServiceAdminService) {}

  toggleOptionalFields() {
    this.showOptionalFields = !this.showOptionalFields;
  }

  closeNotification() {
    this.notificationMessage = null; // Réinitialiser le message pour masquer la notification
  }

  onSubmit() {
    // Utilisation du service pour créer la session
    this.service.createSession(this.session).subscribe(
      response => {
        this.notificationMessage = 'Session ajoutée avec succès !'; // Afficher le message de succès
        // Masquer le message après quelques secondes
        setTimeout(() => {
          this.notificationMessage = null;
          location.reload(); // Recharger la page
        }, 9000); // Durée de 9 secondes pour que le message soit visible
      },
      (error) => {
        console.error('Erreur lors de la création de la session', error);
        this.notificationMessage = 'Erreur lors de la création de la session. Veuillez réessayer.'; // Afficher un message d'erreur
      }
    );
  }
}
