import {Jeux} from './jeux'
import {User} from './user'

export class Depot {
    static createFrom(json: Depot): any {
        throw new Error('Method not implemented.');
      }
    
    private id : number
    private jeux_vente : Jeux[]
    private vendeur : User
    private cout_depot : number
    EtatDemande : String

    constructor(id : number, jeux_vente : Jeux[], vendeur : User, cout_depot: number, Etat : String){
      this.id = id;
      this.jeux_vente = jeux_vente;
      this.vendeur = vendeur;
      this.cout_depot = cout_depot;
      this.EtatDemande = Etat;
    }
    
}