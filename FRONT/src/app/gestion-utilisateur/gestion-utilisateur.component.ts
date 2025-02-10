import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceAdminService, User, ApiResponse } from '../Services/service-admin.service';  // Import du service

@Component({
  selector: 'app-modification-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-utilisateur.component.html',
  styleUrls: ['./gestion-utilisateur.component.css']
})
export class GestionUtilisateurComponent implements OnInit {

  users: User[] = [];
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: string = '';

  constructor(private service: ServiceAdminService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Récupérer les utilisateurs via le service
  getUsers(): void {
    this.service.getUsers().subscribe(data => {
      this.users = data.map(user => ({
        ...user,
        isModified: false
      }));
    });
  }

  // Marquer un utilisateur comme modifié
  markAsModified(user: User): void {
    user.isModified = true;
  }

  // Sauvegarder les modifications des utilisateurs
  saveChanges(): void {
    const modifiedUsers = this.users.filter(user => user.isModified);

    if (modifiedUsers.length === 0) {
      this.showNotificationWithMessage('Aucune modification à enregistrer', 'error');
      return;
    }

    this.service.saveUsers(modifiedUsers).subscribe({
      next: (response: ApiResponse) => {
        this.showNotificationWithMessage(response.message, 'success');
        setTimeout(() => this.getUsers(), 5000);
      },
      error: () => this.showNotificationWithMessage('Erreur lors de l\'enregistrement des modifications', 'error')
    });
  }

  // Afficher une notification avec le message
  showNotificationWithMessage(message: string, type: string): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => this.closeNotification(), 5000);
  }

  // Fermer la notification après un délai
  closeNotification(): void {
    this.showNotification = false;
  }
}
