import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importer FormsModule

@Component({
  selector: 'app-payer-vendeur',
  standalone: true,
  templateUrl: './payer-vendeur.component.html',
  styleUrls: ['./payer-vendeur.component.css'],
  imports: [FormsModule] // Ajouter FormsModule ici
})
export class PayerVendeurComponent {
  emailVendeur: string = ''; // Pour stocker l'email saisi

  constructor(private router: Router) {}

  onSubmit() {
    if (this.emailVendeur) {
      this.router.navigate([`/payer-vendeur-liste`, this.emailVendeur]);
    }
  }
}
