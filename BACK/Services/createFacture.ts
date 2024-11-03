import * as fs from 'fs';
import { Facture } from '../Models/facture'; // Assuming Jeux class is in this file


function createFacture(facture : Facture): void {
    const filename = 'Facture_N°_'+ facture.getId();
    

    const content = `${filename} :\n` +
        `Id Session: ${facture.getIdSession()}\n` +
        `Nom Acheteur: ${facture.getAcheteur}\n` +
        'Liste Achat : \n'+
        `${facture.getListJeux}`+
        `Total: ${facture.getTotal()} € \n\n`;
    fs.writeFile(filename, content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Facture created successfully!');
        }
    });
}