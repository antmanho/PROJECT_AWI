import { Routes } from '@angular/router';
import { DconnexionComponent } from './d-connexion/d-connexion.component';
import { DinscriptionComponent } from './d-inscription/d-inscription.component';
import { MotPasseOublieComponent } from './mot-passe-oublie/mot-passe-oublie.component';
import { ChangerMdpComponent } from './changer-mdp/changer-mdp.component';
import { MenuComponent } from './menu/menu.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { ContactComponent } from './contact/contact.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { Droot } from './root/root.component';
import { DepotComponent } from './depot/depot.component';
import { MiseEnVenteComponent } from './mise-en-vente/mise-en-vente.component';
import { BilanComponent } from './bilan/bilan.component';
import { BilanGrapheComponent } from './bilan-graphe/bilan-graphe.component';
import { RetraitComponent } from './retrait/retrait.component';
import { RetraitListeComponent } from './retrait-liste/retrait-liste.component';
import { EnregistrerAchatComponent } from './enregistrer-achat/enregistrer-achat.component';
import { PayerVendeurComponent } from './payer-vendeur/payer-vendeur.component';
import { PayerVendeurListeComponent } from './payer-vendeur-liste/payer-vendeur-liste.component';

export const routes: Routes = [
  { path: 'connexion', component: DconnexionComponent },
  { path: 'payer-vendeur', component: PayerVendeurComponent },
  { path: 'payer-vendeur-liste/:email', component: PayerVendeurListeComponent },
  { path: 'enregistrer-achat', component: EnregistrerAchatComponent },
  { path: 'retrait-liste/:email', component: RetraitListeComponent },
  { path: 'retrait', component: RetraitComponent },
  { path: 'bilan', component: BilanComponent },
  {
      path: 'bilan-graphe',
      component: BilanGrapheComponent,
      // Utilisation de queryParams pour récupérer les paramètres
      data: {
      bilanParticulier: '',
      sessionParticuliere: '',
      emailParticulier: '',
      numeroSession: '',
      totalQuantitéDéposée: '', // Ajoutez totalQuantitéDéposée de la réponse
      totalQuantitéVendu: '', // Ajoutez totalQuantitéVendu de la réponse
      chargesFixes: '' // Ajoutez chargesFixes
      }
    },
  { path: 'depot', component: DepotComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'root', component: Droot },
 { path: 'inscription', component: DinscriptionComponent },
  { path: 'mot-passe-oublie', component: MotPasseOublieComponent },
  { path: 'mise_en_vente', component: MiseEnVenteComponent },
  { path: 'changer-mdp/:email', component: ChangerMdpComponent },  // Modification ici
  { path: 'menu', component: MenuComponent },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'verification-mail/:email', component: CheckEmailComponent },
 { path: '', redirectTo: '/root', pathMatch: 'full' }, // Redirection par défaut vers la connexion
];

