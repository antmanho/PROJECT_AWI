const express = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql');
const path = require('path');
const { v4: uuid } = require('uuid');
const cors = require('cors'); // Importez cors

const app = express();
const port = 3000;
const { sessionMiddleware, sessionInitMiddleware, sessionCheckMiddleware } = require('./INIT-MIDDLEW/MIDDLE_WARE');
const db = require('./INIT-MIDDLEW/DB');
const acceuilLoginRoutes = require('./ROUTES/ACCEUIL-LOGIN')(db);

// Middleware pour CORS pour permettre les requete POST d'un autre port
app.use(cors({
    origin: 'http://localhost:4200', // Remplacez par l'URL de votre frontend
    credentials: true //cookie session accept
}));// Middleware pour traiter les données JSON
app.use(express.json()); // Utilisez express.json() pour traiter le JSON

// Utilisez le middleware de session en premier
app.use(sessionMiddleware);
app.use(sessionInitMiddleware);
// Ensuite, utilisez votre middleware de vérification
app.use(sessionCheckMiddleware);

// Utilisez le routeur pour gérer les routes
app.use('/', acceuilLoginRoutes);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});


//-----------------------------------------------------------------------------------
//     _____ ___ _   _
//    |  ___|_ _| \ | |
//    | |_   | ||  \| |
//    |  _|  | || |\  |
//    |_|   |___|_| \_|
//
//-----------------------------------------------------------------------------------
//                                /T /I
//                               / |/ | .-~/
//                           T\ Y  I  |/  /  _
//          /T               | \I  |  I  Y.-~/
//         I l   /I       T\ |  |  l  |  T  /
//      T\ |  \ Y l  /T   | \I  l   \ `  l Y
//  __  | \l   \l  \I l __l  l   \   `  _. |
//  \ ~-l  `\   `\  \  \ ~\  \   `. .-~   |
//   \   ~-. "-.  `  \  ^._ ^. "-.  /  \   |
// .--~-._  ~-  `  _  ~-_.-"-." ._ /._ ." ./
//  >--.  ~-.   ._  ~>-"    "\   7   7   ]
// ^.___~"--._    ~-{  .-~ .  `\ Y . /    |
//  <__ ~"-.  ~       /_/   \   \I  Y   : |
//    ^-.__           ~(_/   \   >;._:   | l______
//        ^--.,___.-~"  /_/   !  `-.~"--l_ /     ~"-.
//               (_/ .  ~(   /'     "~"--,Y   -=b-. _)
//                (_/ .  \  :           / l      c"~o \
//                 \ /    `.    .     .^   \_.-~"~--.  )
//                  (_/ .   `  /     /       !       )/
//                   / / _.   '.   .':      /        '
//                   ~(_/ .   /    _  `  .-<_
//                     /_/ . ' .-~" `.  / \  \          ,z=.
//                     ~( /   '  :   | K   "-.~-.______//
//                       "-,.    l   I/ \_    __{--->;._(==.
//                        //(     \  <    ~"~"     //
//                       /' /\     \  \     ,v=.  ((
//                     .^. / /\     "  }__ //===-  `
//                    / / ' '  "-.,__ {---(==-
//                  .^ '       :  T  ~"   ll
//                 / .  .  . : | :!        \
//                (_/  /   | | j-"          ~^
//                  ~-<_(_.^-~"
//
//-----------------------------------------------------------------------------------
//     ___           _            _     _       _       _   _
//    | _ ) __ _ _ _| |__  ___ __| |___| |_    /_\  _ _| |_| |_  ___ _ _ _  _
//    | _ \/ _` | '_| '_ \/ -_) _` / -_)  _|  / _ \| ' \  _| ' \/ _ \ ' \ || |
//    |___/\__,_|_| |_.__/\___\__,_\___|\__| /_/ \_\_||_\__|_||_\___/_||_\_, |
//                                                                        |__/
//-----------------------------------------------------------------------------------
