import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-email',
  templateUrl: './check-email.component.html',
  styleUrls: ['./check-email.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class CheckEmailComponent implements OnInit {
  email: string = '';
  code_recu: string = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupérer l'email à partir des paramètres de l'URL
    this.route.params.subscribe(params => {
      this.email = params['email']; // Assurez-vous que le paramètre dans l'URL est 'email'
    });
  }

  onSubmit() {
    const verificationData = {
      email: this.email,
      code_recu: this.code_recu
    };

    this.http.post('http://localhost:3000/verification-email', verificationData, { withCredentials: true })
      .subscribe(
        (response: any) => {
          console.log('Vérification réussie:', response);
          // Vérifier si nous sommes dans une iframe
          if (window.top !== null && window.top !== undefined && window.top !== window.self) {
            // Rediriger la fenêtre principale
            window.top.location.href = '/menu';
          } else {
            // Redirection normale dans l'application Angular
            this.router.navigate(['/menu']);
          }
        },
        (error) => {
          console.error('Erreur de vérification:', error);
          alert('Code de vérification invalide. Veuillez réessayer.');
        }
      );
  }
}
