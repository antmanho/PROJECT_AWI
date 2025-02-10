// depot.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceGestionnaireService } from '../Services/service-gestionnaire.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depot',
  standalone: true,
  templateUrl: './depot.component.html',
  styleUrls: ['./depot.component.css'],
  imports: [FormsModule, CommonModule]
})
export class DepotComponent implements OnInit {
    emailConnecte = "<%= email_connecte %>";
isPaye: boolean = false;
    isInSale = false;
numSession: string = '';
emailVendeur: string = '';
nomJeu: string = '';
prixUnit: number | null = null;
quantiteDeposee: number | null = null;
editeur: string = '';
description: string = '';
imageFile: File | null = null;
    
    showOptionalFields = false;
    showNotification = false;
    showFieldError = false;
    showErrorMessage = false;
    
sessions: any[] = [];
selectedSession: any = null;
    
    constructor(
                private gestionnaireService: ServiceGestionnaireService,
                private router: Router
                ) {}
    
    ngOnInit() {
        this.loadSessions();
    }
    
    // 🟢 Charger les sessions disponibles
    loadSessions() {
        this.gestionnaireService.fetchAllSessions().subscribe({
        next: (response) => {
            this.sessions = response;
        },
        error: (error: HttpErrorResponse) => {
            console.error('Erreur lors du chargement des sessions:', error.message);
        }
        });
    }
    
    // 🟢 Gérer le changement de session
    onSessionChange() {
        if (this.numSession) {
            this.gestionnaireService.fetchSessionInfo(this.numSession).subscribe({
            next: (response) => {
                this.selectedSession = response;
            },
            error: (error: HttpErrorResponse) => {
                console.error('Erreur lors de la récupération des infos session:', error.message);
            }
            });
        }
    }
    
    // 🟢 Sélectionner un fichier image
    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.imageFile = file;
        }
    }
    
    // 🟢 Soumettre le formulaire
    onSubmit(event: Event) {
        event.preventDefault();
        this.showFieldError = false;
        this.showErrorMessage = false;
        this.showNotification = false;
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.emailVendeur)) {
            this.showFieldError = true;
            return;
        }
        
        if (
            !this.emailVendeur.trim() ||
            !this.nomJeu.trim() ||
            this.quantiteDeposee === null || this.quantiteDeposee <= 0 ||
            this.prixUnit === null || this.prixUnit <= 0 ||
            !this.numSession.trim()
            ) {
                this.showFieldError = true;
                return;
            }
        
        if (!this.isPaye) {
            this.showErrorMessage = true;
            return;
        }
        
        const formData: FormData = new FormData();
        formData.append('email_vendeur', this.emailVendeur);
        formData.append('nom_jeu', this.nomJeu);
        formData.append('prix_unit', String(this.prixUnit));
        formData.append('quantite_deposee', String(this.quantiteDeposee));
        formData.append('est_en_vente', String(this.isInSale));
        formData.append('editeur', this.editeur);
        formData.append('description', this.description);
        formData.append('num_session', this.numSession);
        
        if (this.imageFile) {
            formData.append('image', this.imageFile, this.imageFile.name);
        }
        
        this.gestionnaireService.submitDepot(formData).subscribe({
        next: (response) => {
            console.log('Réponse du serveur:', response);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.showNotification = true;
            setTimeout(() => (this.showNotification = false), 5000);
            this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
            console.error('Erreur lors de l\'envoi des données:', error.message);
            this.showErrorMessage = true;
            setTimeout(() => (this.showErrorMessage = false), 3000);
        }
        });
    }
    
    // 🟢 Réinitialiser le formulaire
    resetForm() {
        this.emailVendeur = '';
        this.nomJeu = '';
        this.prixUnit = null;
        this.quantiteDeposee = null;
        this.editeur = '';
        this.description = '';
        this.imageFile = null;
        this.numSession = '';
        this.isInSale = false;
        this.isPaye = false;
        this.showOptionalFields = false;
    }
    
    // 🟢 Fermer la notification
    closeNotification() {
        this.showNotification = false;
    }
    
    
    // Basculer l'affichage des champs optionnels
    toggleOptionalFields() {
        this.showOptionalFields = !this.showOptionalFields;
    }
}
