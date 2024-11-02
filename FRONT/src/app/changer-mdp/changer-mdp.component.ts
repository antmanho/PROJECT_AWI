import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-changer-mdp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './changer-mdp.component.html',
  styleUrls: ['./changer-mdp.component.css']
})
export class ChangerMdpComponent implements OnInit {
  changerMdpForm: FormGroup;
  email: string = ''; // Initialisez avec une chaîne vide
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.changerMdpForm = this.fb.group({
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      email_mdp: ['', Validators.required] // Ajoutez le champ email_mdp ici
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') || '';
    console.log('Email récupéré :', this.email); // Log de l'email
    this.changerMdpForm.patchValue({ email_mdp: this.email });
    console.log('Formulaire initialisé avec :', this.changerMdpForm.value); // Log des valeurs du formulaire
  }

  onSubmit(): void {
    console.log('Formulaire soumis:', this.changerMdpForm.value);
    console.log('Formulaire soumis avec :', this.changerMdpForm.value); // Log des valeurs soumises
    if (this.changerMdpForm.valid) {
      const { new_password, confirm_password } = this.changerMdpForm.value;

      // Vérifier si les mots de passe correspondent
      if (new_password !== confirm_password) {
        this.error = 'Les mots de passe ne correspondent pas.';
        console.error('Erreur : Les mots de passe ne correspondent pas.'); // Log d'erreur
        return;
      }

      // Envoyer la demande de changement de mot de passe
      this.http.post(`/changer_mdp/${this.email}`, { new_password, confirm_password })
        .subscribe(
          response => {
            console.log('Changement de mot de passe réussi :', response); // Log de succès
            // Redirection après succès (modifiez l'URL selon vos besoins)
            this.router.navigate(['/menu']);
          },
          error => {
            console.error('Erreur lors du changement de mot de passe :', error);
            this.error = 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
          }
        );
    } else {
      console.error('Formulaire invalide :', this.changerMdpForm.errors); // Log si le formulaire n'est pas valide
      this.error = 'Veuillez remplir tous les champs obligatoires.';
    }
  }
}

