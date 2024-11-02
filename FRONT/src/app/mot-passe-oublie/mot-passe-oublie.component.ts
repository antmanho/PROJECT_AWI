import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms'; // Importez NgForm
import { FormsModule } from '@angular/forms'; // Importez FormsModule

@Component({
  selector: 'app-mot-passe-oublie',
  standalone: true,
  imports: [FormsModule], // Ajoutez FormsModule ici
  templateUrl: './mot-passe-oublie.component.html',
  styleUrls: ['./mot-passe-oublie.component.css']
})
export class MotPasseOublieComponent {
  email: string = '';

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.http.post('http://localhost:3000/mdp_oublie', { email: this.email })
        .subscribe(
          response => {
            console.log('E-mail envoyé avec succès:', response);
            alert("Un lien de réinitialisation a été envoyé à votre e-mail.");
          },
          error => {
            console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
          }
        );
    }
  }
}
