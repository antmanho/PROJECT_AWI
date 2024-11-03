export class Jeux {
    static createFrom(json: Jeux): any {
      throw new Error('Method not implemented.');
    }

    private id : number;
    private nom : string;
    private editeur : string;
    private prix_conseil : number;
    private description : string;
    private prix_min : number;
    

    constructor(nom : string,editeur : string,prix_conseil : number,description : string,prix_min : number,id : number){
        this.nom = nom;
        this.editeur = editeur
        this.prix_conseil = prix_conseil;
        this.description = description;
        this.prix_min = prix_min;
        this.id = id;
        }

    getId(){
        return this.id;
    }
    getNom(){
        return this.nom;
    }
    getEditeur(){
        return this.editeur;
    }
    getPrix_conseil(){
        return this.prix_conseil;
    }
    getDescription(){
        return this.description;
    }
    getPrix_min(){
        return this.prix_min;
    }
    
    getEtiquette(){
        return this.getNom() + " - " + this.getEditeur()
    }
    
}