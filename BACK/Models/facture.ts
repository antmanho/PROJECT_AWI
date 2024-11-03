import {Stock} from './Stock'
import {User} from './user'

export class Facture {
    static createFrom(json: Facture): any {
        throw new Error('Method not implemented.');
      }

      private id : number
      private id_session : number
      private jeux_vente : Stock[]
      private acheteur : User
      private charge : number

      constructor(id : number, id_session:number, jeux_vente : Stock[], acheteur : User, charge : number){
          this.id = id;
          this.id_session = id_session;
          this.jeux_vente = jeux_vente;
          this.acheteur = acheteur;
          this.charge = charge;
      }

      getId(){
          return this.id;
      }

      getIdSession(){
        return this.id_session;
      }
      getJeux_vente(){
          return this.jeux_vente;
      }
      getAcheteur(){
          return this.acheteur;
      }
      getCharge(){
          return this.charge;
      }

      getListJeux(){
        var listgamebuy : string = "";
        for(var i = 0; i < this.getJeux_vente().length; i++){
            listgamebuy = listgamebuy + this.getJeux_vente()[i].getEtiquequetteVente()+ "   "+ this.getJeux_vente()[i].getPrix()  + "\n"; 
        }
      }
      getTotal(){
        var total = 0 ;
        for(var i = 0; i < this.getJeux_vente().length; i++){
            total = total + this.getJeux_vente()[i].getPrix(); 
        }
        return total+this.getCharge();
      }
}