import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';  // Ajout pour les requêtes HTTP
import { appConfig } from './app/app.config';  // Configuration de l'application

// Bootstrap de l'application avec la configuration et les services nécessaires
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Fournir HttpClient si tu fais des requêtes HTTP dans ton app
    ...appConfig.providers  // Ajouter les autres providers à partir de appConfig
  ]
}).catch((err) => console.error(err));
