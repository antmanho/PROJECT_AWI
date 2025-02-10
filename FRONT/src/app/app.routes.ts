import { Routes } from '@angular/router';
import { Verification_G_A } from './auth/verification-g-a.guard';
import { Verification_A } from './auth/verification-a.guard';
import { Verification_V } from './auth/verification-v.guard';

export const routes: Routes = [
  {
    path: 'detail-article/:id',
    loadComponent: () => import('./detail-article/detail-article.component').then(m => m.DetailArticleComponent)
  },
  {
    path: 'vendeur',
    loadComponent: () => import('./vendeur/vendeur.component').then(m => m.VendeurComponent),
    canActivate: [Verification_V]
  },
  {
    path: 'pas-le-role',
    loadComponent: () => import('./pas-le-role/pas-le-role.component').then(m => m.PasLeRoleComponent)
  },
  {
    path: 'gestion-utilisateur',
    loadComponent: () => import('./gestion-utilisateur/gestion-utilisateur.component').then(m => m.GestionUtilisateurComponent),
    canActivate: [Verification_A]
  },
  {
    path: 'modification-session',
    loadComponent: () => import('./modification-session/modification-session.component').then(m => m.ModificationSessionComponent),
    canActivate: [Verification_A]
  },
  {
    path: 'creer-session',
    loadComponent: () => import('./creer-session/creer-session.component').then(m => m.CreerSessionComponent),
    canActivate: [Verification_A]
  },
  {
    path: 'connexion',
    loadComponent: () => import('./d-connexion/d-connexion.component').then(m => m.DconnexionComponent)
  },
  {
    path: 'payer-vendeur',
    loadComponent: () => import('./payer-vendeur/payer-vendeur.component').then(m => m.PayerVendeurComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'payer-vendeur-liste/:email',
    loadComponent: () => import('./payer-vendeur-liste/payer-vendeur-liste.component').then(m => m.PayerVendeurListeComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'enregistrer-achat',
    loadComponent: () => import('./enregistrer-achat/enregistrer-achat.component').then(m => m.EnregistrerAchatComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'retrait-liste/:email',
    loadComponent: () => import('./retrait-liste/retrait-liste.component').then(m => m.RetraitListeComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'retrait',
    loadComponent: () => import('./retrait/retrait.component').then(m => m.RetraitComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'bilan',
    loadComponent: () => import('./bilan/bilan.component').then(m => m.BilanComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'bilan-graphe',
    loadComponent: () => import('./bilan-graphe/bilan-graphe.component').then(m => m.BilanGrapheComponent),
    data: {
      bilanParticulier: '',
      sessionParticuliere: '',
      emailParticulier: '',
      numeroSession: '',
      totalQuantitéDéposée: '',
      totalQuantitéVendu: '',
      chargesFixes: ''
    }
  },
  {
    path: 'vendeur-bilan',
    loadComponent: () => import('./vendeur-bilan/vendeur-bilan.component').then(m => m.VendeurBilanComponent),
    data: {
      bilanParticulier: '',
      sessionParticuliere: '',
      emailParticulier: '',
      numeroSession: '',
      totalQuantitéDéposée: '',
      totalQuantitéVendu: '',
      chargesFixes: ''
    }
  },
  {
    path: 'depot',
    loadComponent: () => import('./depot/depot.component').then(m => m.DepotComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'catalogue',
    loadComponent: () => import('./catalogue/catalogue.component').then(m => m.CatalogueComponent)
  },
  {
    path: 'root',
    loadComponent: () => import('./root/root.component').then(m => m.Droot)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./d-inscription/d-inscription.component').then(m => m.DinscriptionComponent)
  },
  {
    path: 'mot-passe-oublie',
    loadComponent: () => import('./mot-passe-oublie/mot-passe-oublie.component').then(m => m.MotPasseOublieComponent)
  },
  {
    path: 'mise_en_vente',
    loadComponent: () => import('./mise-en-vente/mise-en-vente.component').then(m => m.MiseEnVenteComponent),
    canActivate: [Verification_G_A]
  },
  {
    path: 'changer-mdp/:email',
    loadComponent: () => import('./changer-mdp/changer-mdp.component').then(m => m.ChangerMdpComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'acceuil',
    loadComponent: () => import('./acceuil/acceuil.component').then(m => m.AcceuilComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'verification-mail/:email',
    loadComponent: () => import('./check-email/check-email.component').then(m => m.CheckEmailComponent)
  },
  {
    path: 'preinscription',
    loadComponent: () => import('./preinscription/preinscription.component').then(m => m.PreinscriptionComponent),
  canActivate: [Verification_A]
  },
  {
    path: '',
    redirectTo: '/root',
    pathMatch: 'full'
  }
];
