import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceAllService } from '../Services/service-all.service';

@Component({
  selector: 'app-changer-mdp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './changer-mdp.component.html',
  styleUrls: ['./changer-mdp.component.css']
})
export class ChangerMdpComponent implements OnInit {
  changerMdpForm: FormGroup;
  email: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';
  error: string | null = null; // Ajout de la gestion des erreurs

  constructor(
    private fb: FormBuilder,
    private serviceAll: ServiceAllService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.changerMdpForm = this.fb.group({
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      email_mdp: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') || '';
    if (!this.email) {
      this.error = 'Aucune adresse e-mail trouvée.';
      return;
    }
    this.changerMdpForm.patchValue({ email_mdp: this.email });
  }

  onSubmit(): void {
    if (this.changerMdpForm.invalid) {
      this.error = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const { new_password, confirm_password } = this.changerMdpForm.value;

    if (new_password !== confirm_password) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.serviceAll.changePassword(this.email, new_password, confirm_password).subscribe(
      response => {
        console.log('Mot de passe changé avec succès:', response);
        this.error = null;
        this.showAlert('Mot de passe modifié avec succès !');
        setTimeout(() => this.router.navigate(['/menu']), 3000);
      },
      error => {
        console.error('Erreur lors du changement de mot de passe:', error);
        this.error = error.error?.error || 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
      }
    );
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
