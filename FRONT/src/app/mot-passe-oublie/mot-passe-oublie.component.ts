import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceAllService } from '../Services/service-all.service';

@Component({
  selector: 'app-mot-passe-oublie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mot-passe-oublie.component.html',
  styleUrls: ['./mot-passe-oublie.component.css']
})
export class MotPasseOublieComponent {
  email: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(private service: ServiceAllService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.service.requestPasswordReset(this.email).subscribe(
        response => {
          console.log('E-mail de réinitialisation envoyé avec succès:', response);
          this.showAlert("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
        },
        error => {
          console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
          this.showAlert("Une erreur s'est produite. Veuillez réessayer.");
        }
      );
    } else {
      this.showAlert("Veuillez entrer une adresse e-mail valide.");
    }
  }

  showAlert(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 5000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}
