import { Stock } from "./Stock";

export class Session {
    static createFrom(json: Session): any {
      throw new Error('Method not implemented.');
    }

    id: number;
    datedbt: Date;
    datefin: Date;
    fraisdedepot: number; 
    pourcentage : number;
    commission: number;
    stockSession: Stock[];
    description: string;
    actif: boolean;

    constructor(id: number,datedbt: Date,datefin: Date,fraisdedepot: number, pourcentage: number,commission: number,stockSession : Stock[],description: string,actif: boolean){
        this.id = id;
        this.datedbt = datedbt;
        this.datefin = datefin;
        this.fraisdedepot = fraisdedepot;
        this.pourcentage = pourcentage;
        this.commission = commission;
        this.description = description;
        this.actif = actif;
        this.stockSession = stockSession;
    }

    isActif(){
        return this.actif;
    }

    getId(){
        return this.id;
    }
    getDatedbt(){
        return this.datedbt;
    }
    getDatefin(){
        return this.datefin;
    }
    getFraisdedepot(){
        return this.fraisdedepot;
    }
    getCommission(){
        return this.commission;
    }
    getDescription(){
        return this.description;
    }

    checkActif(){
        const currDate = new Date();
        if(currDate >= this.datedbt && currDate <= this.datefin){
            return this.setActif(true);
        }
        return this.setActif(false);
    }

    setActif(actif : boolean){
        this.actif = actif;
    }

    setpourcentage(pourcentage : number){
        this.pourcentage = pourcentage;
    }

    getPourcentage(){
        return this.pourcentage;
    }

    getStockSession(){
        return this.stockSession;
    }

    addStockSession(stock : Stock){
        this.stockSession.push(stock);
    }

    removeStockSession(stock : Stock){
        this.stockSession.splice(this.stockSession.indexOf(stock), 1);
    }
}