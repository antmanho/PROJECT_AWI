import * as fs from 'fs';

export class bilanGeneral {
    static createFrom(json: bilanGeneral): any {
      throw new Error('Method not implemented.');
    }

  private idSession : number
  private Tresorerie : Float64Array
  private fraidepos_encaissés : Float64Array
  private commissions_prelevees : Float64Array
  private nonvendu : number
  private somme_dus : Float64Array
  private nbdepot : number

  constructor(idSession : number,Tresorerie : Float64Array,fraidepos_encaissés : Float64Array,commissions_prelevees : Float64Array,
    nonvendu : number,somme_dus : Float64Array,nbdepot : number){
    this.idSession=idSession;
    this.Tresorerie=Tresorerie;
    this.fraidepos_encaissés=fraidepos_encaissés;
    this.commissions_prelevees=commissions_prelevees;
    this.nonvendu=nonvendu;
    this.somme_dus = somme_dus;
    this.nbdepot = nbdepot;
  }

  getId(){
      return this.idSession;
  }
  getTresorerie(){
      return this.Tresorerie;
  }
  getFraidepos_encaissés(){
      return this.fraidepos_encaissés;
  }
  getCommissions_prelevees(){
      return this.commissions_prelevees;
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