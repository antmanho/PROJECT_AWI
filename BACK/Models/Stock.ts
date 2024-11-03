import { Jeux } from "./jeux";
import { User } from "./user";

export class Stock {
    static createFrom(json: Stock): any {
      throw new Error('Method not implemented.');
    }

    idJeux : Jeux;
    vendeur : User;
    prix : number;
    quantite : number;
    idsession : number;

    constructor(idJeux : Jeux,vendeur : User,prix : number,quantite : number, idsession : number){
        this.idJeux = idJeux;
        this.vendeur = vendeur;
        this.prix = prix;
        this.quantite = quantite;
        this.idsession = idsession;
    }

    getPrix(){
        return this.prix;
    }

    getSession(){
        return this.idsession
    }

    getQuantite(){
        return this.quantite;
    }

    getIdJeux(){
        return this.idJeux;
    }

    getVendeur(){
        return this.vendeur;
    }

    getEtiquequetteVente(){
        return (this.idJeux.getEtiquette()+" - "+ (this.getVendeur()).getName());
    }
    

    addQuantite(quantite : number){
        this.quantite += quantite;
    }

    removeQuantite(quantite : number){
        this.quantite -= quantite;
    }

    changePrix(prix : number){
        this.prix = prix;
    }

    getChangeSession(newid:number){
        this.idsession = newid;
    }

}