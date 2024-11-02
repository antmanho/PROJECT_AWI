import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importer FormsModule

@Component({
  selector: 'app-retrait',
  standalone: true,
  imports: [FormsModule], // Ajouter FormsModule ici
  templateUrl: './retrait.component.html',
  styleUrls: ['./retrait.component.css']
})
export class RetraitComponent {
  emailParticulier: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.emailParticulier) {
      this.router.navigate([`/retrait-liste`, this.emailParticulier]);
    } else {
      alert('Veuillez entrer un email.');
    }
  }
}
