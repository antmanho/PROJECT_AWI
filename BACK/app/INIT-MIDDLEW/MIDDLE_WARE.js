//-----------------------------------------------------------------------------------
//     ___ _  _ ___ _____ ____  __ ___ ___  ___  _    _____      ___   ___ ___
//    |_ _| \| |_ _|_   _/ /  \/  |_ _|   \|   \| |  | __\ \    / /_\ | _ \ __|
//     | || .` || |  | |/ /| |\/| || || |) | |) | |__| _| \ \/\/ / _ \|   / _|
//    |___|_|\_|___| |_/_/ |_|  |_|___|___/|___/|____|___| \_/\_/_/ \_\_|_\___|
//
//-----------------------------------------------------------------------------------
const session = require('express-session');

// Middleware de session
const sessionMiddleware = session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7200000,
        httpOnly: true,
        secure: false, // Mettez à true en production si vous utilisez HTTPS
        sameSite: 'None', // Cela permet aux cookies d'être envoyés dans des contextes inter-domaines
    }
});


// Middleware pour initialiser les valeurs de session si elles n'existent pas
const sessionInitMiddleware = (req, res, next) => {
    if (!req.session.email_connecte) {
        req.session.email_connecte = 'invite@example.com'; // Email par défaut pour les invités
    }
    next();
};

// Middleware pour vérifier et surveiller les changements de session
const sessionCheckMiddleware = (req, res, next) => {

    const originalEmailConnecte = req.session.email_connecte;

    res.on('finish', () => {
        console.log('Session après la requête:');
        console.log('SessionID:', req.sessionID); // Afficher le sessionID
        console.log('Email connecté:', req.session.email_connecte);

        if ( req.session.email_connecte !== originalEmailConnecte) {
            console.log("Modification de la session détectée");
        }
    });

    next();
};

module.exports = { sessionMiddleware, sessionInitMiddleware, sessionCheckMiddleware };
