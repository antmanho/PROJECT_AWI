import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceAllService } from '../Services/service-all.service';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './check-email.component.html',
  styleUrls: ['./check-email.component.css']
})
export class CheckEmailComponent implements OnInit {
  email: string = '';
  code_recu: string = '';

  constructor(
    private serviceAll: ServiceAllService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.email = params['email'];
    });
  }

  onSubmit() {
    this.serviceAll.verifyEmail(this.email, this.code_recu).subscribe(
      (response: any) => {
        console.log('Vérification réussie:', response);
        if (window.top !== null && window.top !== undefined && window.top !== window.self) {
          window.top.location.href = '/menu';
        } else {
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
