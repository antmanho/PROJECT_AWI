import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import de FormsModule pour ngModel
import { ServiceAdminService, Session, ApiResponse } from '../Services/service-admin.service'; // Importation du service
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modification-session',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importation de CommonModule et FormsModule
  templateUrl: './modification-session.component.html',
  styleUrls: ['./modification-session.component.css']
})
export class ModificationSessionComponent implements OnInit {

  sessions: Session[] = []; // Liste des sessions à afficher
  showNotification: boolean = false; // Contrôle l'affichage de la notification
  notificationMessage: string = ''; // Message à afficher dans la notification
  notificationType: string = ''; // "success" ou "error"

  constructor(private service: ServiceAdminService) {}

  ngOnInit(): void {
    this.getSessions(); // Charger les sessions au démarrage
  }

  getSessions(): void {
    this.service.getSessions().subscribe(
      (data: Session[]) => {  // Spécifiez ici que 'data' est un tableau de 'Session'
        // Conversion des dates au format attendu pour les inputs de type "date"
        this.sessions = data.map((session: Session) => ({  // Ajoutez le type pour 'session'
          ...session,
          date_debut: this.formatDate(session.date_debut),
          date_fin: this.formatDate(session.date_fin),
          isModified: false // Initialisation de la propriété isModified
        }));
      },
      (error: any) => {  // Déclarez le type 'error' comme 'any' ou 'HttpErrorResponse'
        console.error('Erreur lors de la récupération des sessions:', error);
      }
    );
  }

  formatDate(date: string): string {
    if (!date) return ''; // Si la date est vide ou invalide
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  markAsModified(session: Session): void {
    session.isModified = true; // Marquer la session comme modifiée
  }

  saveChanges(): void {
    const modifiedSessions = this.sessions.filter(session => session.isModified);

    if (modifiedSessions.length === 0) {
      this.showNotificationWithMessage('Aucune modification à enregistrer', 'error');
      return;
    }

    this.service.saveSessions(modifiedSessions).subscribe(
      (response: ApiResponse) => {
        console.log('Réponse reçue du serveur :', response); // Log de la réponse du serveur

        // Afficher la notification avec un délai
        this.showNotificationWithMessage(response.message, 'success');

        // Ajout d'un délai de 5 secondes avant de recharger les sessions
        setTimeout(() => {
          this.getSessions(); // Recharger les sessions après la sauvegarde
        }, 5000); // 5 secondes pour laisser le temps de voir la notification
      },
      (error: any) => {  // Déclarez ici également 'error' comme 'any' ou 'HttpErrorResponse'
        console.error('Erreur lors de la sauvegarde:', error);
        this.showNotificationWithMessage('Erreur lors de l\'enregistrement des modifications', 'error');
      }
    );
  }

  showNotificationWithMessage(message: string, type: string): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;  // Afficher la notification

    console.log("Notification affichée:", message);  // Vérification dans la console
    setTimeout(() => {
      this.closeNotification();  // Fermer la notification après 5 secondes
    }, 5000);
  }

  closeNotification(): void {
    console.log('Fermeture de la notification');
    this.showNotification = false;
  }
}
