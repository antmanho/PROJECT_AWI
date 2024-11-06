import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importer le Router
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { // Injecter le Router
    this.registrationForm = this.fb.group({
      new_email: ['', [Validators.required, Validators.email]],
      new_name: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.errorMessage = null; // Réinitialisez le message d'erreur à chaque soumission
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      // Ajout de { withCredentials: true } dans la requête HTTP
      this.http.post('http://localhost:3000/api/inscription', {
        email: formData.new_email,
        name: formData.new_name,
        password: formData.new_password,
        confirmPassword: formData.confirm_password
      }, { withCredentials: true }) // Ajoutez cela pour gérer les cookies de session
      .subscribe(
        (response: any) => { // Typage pour permettre l'accès à la réponse
          console.log('Inscription réussie:', response);
          if (response.message === 'Un code de vérification a été envoyé à votre email.') {
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
