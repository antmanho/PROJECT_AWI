const WebSocket = require('ws');
const mysql = require('mysql');

const pollInterval = 5000; // Déclaration de pollInterval

let previousData = {}; // Stocker les données précédentes

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'SITE_TOURNAMENT',
    socketPath: '../../../../../Applications/MAMP/tmp/mysql/mysql.sock'
});
// Fonction pour envoyer les données à un client WebSocket
function sendUpdatesToClient(client, data, tableName) {
    console.log('Envoi des mises à jour au client WebSocket :', { tableName, data });
    client.send(JSON.stringify({ tableName, data }));
}

// Fonction pour surveiller les modifications de la table MySQL
function watchTableChanges(tableName) {
    connection.query(`SELECT * FROM ${tableName}`, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des données de la table :', error);
            return;
        }
        // Comparer les données avec les données précédentes
        if (JSON.stringify(results) !== JSON.stringify(previousData[tableName])) {
            // S'il y a eu un changement, envoyer les mises à jour à tous les clients WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    sendUpdatesToClient(client, results, tableName);
                }
            });
            // Mettre à jour les données précédentes
            previousData[tableName] = results;
        }
    });
}

// Création du serveur WebSocket
const wss = new WebSocket.Server({ port: 8080 });

// Gérer les connexions WebSocket
wss.on('connection', ws => {
    console.log('Nouvelle connexion WebSocket.');
    
    // Envoyer les données actuelles de la table PIXEL_WARS au client WebSocket
    sendUpdatesToClient(ws, previousData['PIXEL_WARS'] || [], 'PIXEL_WARS');
    
    // Envoyer les données actuelles de la table UTILISATEUR au client WebSocket
    sendUpdatesToClient(ws, previousData['UTILISATEUR'] || [], 'UTILISATEUR');

    // Envoyer les données actuelles de la table UTILISATEUR au client WebSocket
    sendUpdatesToClient(ws, previousData['MESSAGE'] || [], 'MESSAGE');
    
    // Gérer la déconnexion du client WebSocket
    ws.on('close', () => {
        console.log('Connexion WebSocket fermée.');
    });
});

// Établir la connexion à la base de données
connection.connect(error => {
    if (error) {
        console.error('Erreur lors de la connexion à la base de données :', error);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
    
    // Surveiller les modifications dans la table PIXEL_WARS
    setInterval(() => {
        watchTableChanges('PIXEL_WARS');
    }, pollInterval);
    
    // Surveiller les modifications dans la table UTILISATEUR
    setInterval(() => {
        watchTableChanges('UTILISATEUR');
    }, pollInterval);
    
    // Surveiller les modifications dans la table UTILISATEUR
    setInterval(() => {
        watchTableChanges('MESSAGE');
    }, pollInterval);
});

