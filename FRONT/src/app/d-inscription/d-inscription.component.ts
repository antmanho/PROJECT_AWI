// src/app/d-inscription/d-inscription.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceAllService } from '../Services/service-all.service'; // Importer le service

@Component({
  selector: 'app-d-inscription',
  standalone: true,
  templateUrl: './d-inscription.component.html',
  styleUrls: ['./d-inscription.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class DinscriptionComponent {
  registrationForm: FormGroup;
  errorMessage: string | null = null; // Déclaration de la propriété errorMessage

  constructor(
    private fb: FormBuilder,
    private service: ServiceAllService, // Injecter le service
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      new_email: ['', [Validators.required, Validators.email]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.errorMessage = null; // Réinitialisez le message d'erreur à chaque soumission
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      // Appel au service pour l'inscription
      this.service.register(formData.new_email, formData.new_password, formData.confirm_password)
        .subscribe(
          (response: any) => { // Typage pour permettre l'accès à la réponse
            console.log('Inscription réussie:', response);
            if (response.message === 'Un code de verification a ete envoye à votre email.') {
              // Redirection vers la page de vérification sans rafraîchir la page
              this.router.navigate(['/verification-mail', formData.new_email]);
            } else {
              alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            }
          },
          error => {
            console.error('Erreur lors de l\'inscription:', error);
            this.errorMessage = error.error.message; // Affiche le message d'erreur renvoyé par le back-end
          }
        );
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
}
