
export class bilanparticulier {
    static createFrom(json: bilanparticulier): any {
      throw new Error('Method not implemented.');
    }

  private id : number
  private nomparticulier : string
  private nbvente : number
  private resultat:number
  private nonvendu : number
  private somme_dus : Float64Array
  private nbdepot : number

  constructor(id : number, nomparticulier : string,  nbvente : number,  resultat:number,  nonvendu : number,  somme_dus : Float64Array,  nbdepot : number ){
      this.id = id;
      this.nomparticulier = nomparticulier;
      this.nbvente = nbvente;
      this.resultat = resultat;
      this.nonvendu = nonvendu;
      this.somme_dus = somme_dus;
      this.nbdepot = nbdepot;
    }
  getId(){
      return this.id;
  }

  getNom(){
      return this.nomparticulier;
  }

  getNbvente(){
      return this.nbvente;
  }

  getResultat(){
      return this.resultat;
  }
  getNonvendu(){
      return this.nonvendu;
  }
  getSomme_dus(){
      return this.somme_dus;
  }
  getNbdepot(){
      return this.nbdepot;
  }
}