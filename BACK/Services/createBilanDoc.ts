import * as fs from 'fs';
import { bilanGeneral } from '../Models/bilanGeneral'; // Assuming bilanGeneral class is in this file
import { bilanparticulier } from '../Models/bilanparticulier'; // Assuming bilanparticulier class is in this file


function createBilanGeneralDocument(bilanGeneral: bilanGeneral, filename: string): void {
    const content = `Bilan Général:\n` +
        `Id Session: ${bilanGeneral.getId()}\n` +
        `Trésorerie: ${bilanGeneral.getTresorerie()}\n` +
        `Frais de pos encaissés: ${bilanGeneral.getFraidepos_encaissés()}\n` +
        `Commissions prélevées: ${bilanGeneral.getCommissions_prelevees()}\n` +
        `Non vendu: ${bilanGeneral.getNonvendu()}\n` +
        `Somme dus: ${bilanGeneral.getSomme_dus()}\n` +
        `Nb depot: ${bilanGeneral.getNbdepot()}\n\n`;

    fs.writeFile(filename, content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Bilan document created successfully!');
        }
    });
}

function createBilanParticulierDocument(bilanparticulier: bilanparticulier, filename: string): void {
    const content = `Bilan Particulier:\n` +
        `Id: ${bilanparticulier.getId()}\n` +
        `Nom particulier: ${bilanparticulier.getNom()}\n` +
        `Nb vente: ${bilanparticulier.getNbvente()}\n` +
        `Resultat: ${bilanparticulier.getResultat()}\n` +
        `Non vendu: ${bilanparticulier.getNonvendu()}\n` +
        `Somme dus: ${bilanparticulier.getSomme_dus()}\n` +
        `Nb depot: ${bilanparticulier.getNbdepot()}\n`;

    fs.writeFile(filename, content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Bilan document created successfully!');
        }
    });
}

