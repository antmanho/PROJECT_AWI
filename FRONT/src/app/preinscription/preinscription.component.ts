// src/app/preinscription/preinscription.component.ts
import { Component } from '@angular/core';
import { ServiceAdminService } from '../Services/service-admin.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importation du CommonModule

@Component({
  selector: 'app-preinscription',
standalone: true,
imports: [FormsModule, CommonModule],
  templateUrl: './preinscription.component.html',
  styleUrls: ['./preinscription.component.css']
})
export class PreinscriptionComponent {
  email: string = '';
  role: string = '';
  showNotification: boolean = false;

  constructor(private serviceAdmin: ServiceAdminService) {}

  onSubmit(form: NgForm) {
    if (!this.email || !this.role) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.serviceAdmin.preinscrireUser(this.email, this.role).subscribe(
      response => {
        if (response.status === 'success') {
          this.showNotification = true;
          form.reset();
        } else {
          alert('Erreur lors de la préinscription.');
        }
      },
      error => {
        alert('Une erreur est survenue, veuillez réessayer.');
      }
    );
  }

  closeNotification() {
    this.showNotification = false;
  }
}
