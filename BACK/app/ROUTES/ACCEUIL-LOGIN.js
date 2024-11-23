//-----------------------------------------------------------------------------------
//
//                        _ _   ___           _
//    __ _ __ __ ___ _  _(_) | / / |___  __ _(_)_ _
//   / _` / _/ _/ -_) || | | |/ /| / _ \/ _` | | ' \ _ _ _
//   \__,_\__\__\___|\_,_|_|_/_/ |_\___/\__, |_|_||_(_|_|_)
//                                       |___/
//-----------------------------------------------------------------------------------



//deeb etant ma base de donne
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuid } = require('uuid');

module.exports = (db) => {
    const router = express.Router();
    //----------------------------------------------------------------------
    //----------------------------------- /INSCRIPTION --------------------
    //----------------------------------------------------------------------
    
    // Promisify the db.query method
    const util = require('util');
    const query = util.promisify(db.query).bind(db);

    
    router.get('/root', (req, res) => {
            console.log("-----------/root-----------------");
            // Initialiser les valeurs de session si elles ne sont pas dejà definies
            req.session.situation = 'demarrage';
            req.session.email_connecte = 'invite@example.com';
            
            // Envoyer une reponse au frontend avec l'ID de session
            res.json({
                message: 'Session initialized',
                situation: req.session.situation,
                email_connecte: req.session.email_connecte,
                sessionID: req.session.sessionID // Renvoie l'UUID de session ici
            });
        });

    // Route pour obtenir les informations de l'utilisateur connecte
    router.get('/api/user-info', (req, res) => {
        if (req.session.email_connecte) {
            // Recuperation de l'email de la session
            const email = req.session.email_connecte;

            // Requête à la base de donnees pour verifier si l'utilisateur existe dans la table Users
            db.query('SELECT role FROM Users WHERE email = ?', [email], (err, results) => {
                if (err) {
                    console.error('Erreur lors de la recuperation du rôle:', err);
                    return res.status(500).json({ message: 'Erreur interne du serveur' });
                }

                if (results.length === 0) {
                    // Si l'utilisateur n'existe pas dans la table Users, verifier dans la table role_preinscription
                    db.query('SELECT Role FROM role_preinscription WHERE Email = ?', [email], (err, resultsPreinscription) => {
                        if (err) {
                            console.error('Erreur lors de la recuperation du rôle de preinscription:', err);
                            return res.status(500).json({ message: 'Erreur interne du serveur' });
                        }

                        if (resultsPreinscription.length === 0) {
                            // Aucun rôle trouve dans les deux tables
                            return res.status(200).json({ email: email, role: null });
                        }

                        // Rôle trouve dans la table role_preinscription
                        const rolePreinscription = resultsPreinscription[0].Role;
                        return res.status(200).json({ email: email, role: rolePreinscription });
                    });
                } else {
                    // Si l'utilisateur est trouve dans la table Users, renvoyer le rôle associe
                    const role = results[0].role;
                    return res.status(200).json({ email: email, role: role });
                }
            });
        } else {
            // L'utilisateur n'est pas connecte
            res.status(200).json({ email: null, role: null });
        }
    });


    router.put('/api/stock/:id/toggle-vente', (req, res) => {
        const { id } = req.params;
        const { est_en_vente } = req.body;

        const query = 'UPDATE Stock SET est_en_vente = ? WHERE id_stock = ?';
        db.query(query, [est_en_vente, id], (err, result) => {
            if (err) {
                console.error('Erreur lors de la mise à jour de est_en_vente:', err);
                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }

            res.status(200).json({ message: 'Statut de vente mis à jour avec succès' });
        });
    });

    router.post('/api/inscription', async (req, res) => {
        console.log("*** /inscription ***");

        // Extraction des donnees du corps de la requête
        const { email,name, password, confirmPassword } = req.body;

        try {
            // Verification si les mots de passe correspondent
            if (password !== confirmPassword) {
                console.log('Les mots de passe ne correspondent pas.');
                return res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
            }

            console.log('Verification si l\'email existe dejà...');
            // Utilisation de requêtes preparees pour eviter les injections SQL
            const existingUser = await query('SELECT * FROM Users WHERE email = ?', [email]);

            // Verification si l'utilisateur existe dejà
            if (existingUser.length > 0) {
                console.log('Cet email est dejà utilise.');
                return res.status(400).json({ message: 'Cet email est dejà utilise.' });
            }

            console.log('Insertion dans la table verification_mail...');

            // Generation du code à 6 chiffres
            const verificationCode = Math.floor(100000 + Math.random() * 900000);

            // Insertion de l'email, du code et du mot de passe dans la table verification_mail
            await query('INSERT INTO Verification_mail (Email, Name, Code, Password) VALUES (?, ?, ?, ?)', [email,name, verificationCode, password]);

            console.log("*** Envoi du code de verification par email ***");

            // Configuration du transporteur nodemailer pour envoyer un email
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true pour port 465, false pour les autres ports
                auth: {
                    user: 'barbedetanthony@gmail.com',
                    pass: 'dmunpyeuzmkuebqc' // Remplacez par votre mot de passe ou cle d'application
                }
            });

            // Definition des options de l'email
            let mailOptions = {
                from: '"Anthony" <barbedetanthony@gmail.com>',
                to: email,
                subject: 'Verification de votre inscription',
                html: `
                    <p>Bonjour,</p>
                    <p>Merci de vous être inscrit. Voici votre code de verification :</p>
                    <h2>${verificationCode}</h2>
                    <p>Veuillez entrer ce code sur notre site pour completer votre inscription.</p>
                    <p>Cordialement,</p>
                    <p>L'equipe de 'TOURNAMENT'</p>
                `
            };

            // Envoi de l'email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi de l\'email :', error);
                    return res.status(500).send('Erreur lors de l\'envoi de l\'email.');
                } else {
                    console.log('Email envoye :', info.response);
                    res.status(200).json({ message: 'Un code de verification a ete envoye à votre email.' });
                }
            });

        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
        }
    });

    // Route pour verifier le code et ajouter l'utilisateur
    // Route pour verifier le code et ajouter l'utilisateur
    router.post('/verification-email', async (req, res) => {
        console.log("*** /verification-email ***");

        const { email, code_recu } = req.body;
        console.log("email:", email);
        console.log("code:", code_recu);
        let role = 'd';  // Valeur par defaut du rôle

        try {
            // 1. Verification si l'utilisateur existe dejà dans la table Users
            const existingUser = await query('SELECT * FROM Users WHERE email = ?', [email]);

            if (existingUser.length > 0) {
                console.log('Email dejà verifie.');
                return res.status(400).json({ message: 'Email dejà verifie.' });
            }

            // 2. Verification dans la table role_preinscription
            console.log('Verification du rôle...');
            const rolePreinscription = await query('SELECT role FROM role_preinscription WHERE email = ?', [email]);

            if (rolePreinscription.length > 0) {
                role = rolePreinscription[0].role;
                console.log('Rôle trouve dans role_preinscription:', role);
            } else {
                console.log('Aucun rôle trouve dans role_preinscription, rôle par defaut:', role);
            }

            // 3. Verification du code dans la table Verification_mail
            console.log('Verification du code et recuperation du mot de passe...');
            const verificationMail = await query('SELECT * FROM Verification_mail WHERE Email = ? AND Code = ?', [email, code_recu]);

            if (verificationMail.length === 0) {
                console.log('Code de verification invalide.');
                return res.status(400).json({ message: 'Code de verification invalide.' });
            }

            const password = verificationMail[0].Password;

            // 4. Ajout de l'utilisateur dans la table Users
            console.log('Ajout de l\'utilisateur dans la table Users...');
            await query('INSERT INTO Users (email, mdp, nom, telephone, adresse, role) VALUES (?, ?, ?, ?, ?, ?)',
                [email, password, "d", "d", "d", role]);

            console.log('Utilisateur ajoute avec succès.');

            // Enregistrer l'email dans la session
            req.session.email_connecte = email;
            console.log('Email enregistre dans la session:', req.session.email_connecte);

            res.status(200).json({ message: 'Votre email a ete verifie et votre compte a ete cree avec succès.' });

        } catch (error) {
            console.error('Erreur lors de la verification du mail:', error);
            res.status(500).json({ message: 'Erreur lors de la verification du mail.' });
        }
    });


    // Route de connexion
    router.post('/api/connexion', (req, res) => {
        console.log("Tentative de connexion");

        const { email, password } = req.body;
        console.log('Email:', email);
        console.log('Mot de passe:', password);

        // Verification si les champs sont vides
        if (!email || !password) {
            return res.status(400).json({ message: 'Veuillez remplir tous les champs correctement.', success: false });
        }

        // Requête pour verifier si l'utilisateur existe avec l'email et mot de passe fournis
        db.query('SELECT * FROM Users WHERE email = ? AND mdp = ?', [email, password], (err, results) => {
            if (err) {
                console.error('Erreur lors de la verification de l\'utilisateur :', err);
                return res.status(500).json({ message: 'Erreur interne du serveur.', success: false });
            }

            // Si aucun compte trouve, on renvoie un succès avec message, mais pas d'erreur
            if (results.length === 0) {
                console.log("Compte non trouve pour l'email:", email);
                return res.status(200).json({ message: 'Compte non trouve. Verifiez vos identifiants.', success: false });
            }

            // Authentification reussie
            req.session.email_connecte = email;

            // Redirection vers /menu si l'utilisateur existe
            res.status(200).json({ redirectUrl: '/menu', success: true });
        });
    });


    router.post('/mdp_oublie', (req, res) => {
        console.log("post");
        const { email } = req.body;
        console.log(email);
        db.query('SELECT * FROM UTILISATEUR WHERE email=?', [email], (err, results) => {
            if (err) {
                console.error('Erreur lors de la verification de l\'utilisateur :', err);
                res.status(500).send('Erreur lors de la verification de l\'utilisateur.');
                return;
            }

            if (results.length > 0) {
                req.session.email_connecte = email;

                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'barbedetanthony@gmail.com',
                        pass: 'dmunpyeuzmkuebqc'
                    }
                });

                let mailOptions = {
                    from: '"Anthony" <barbedetanthony@gmail.com>',
                    to: email,
                    subject: 'Reinitialisation de votre mot de passe',
                    html: `
                        <p>Bonjour,</p>
                        <p>Vous avez demande à reinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour reinitialiser votre mot de passe :</p>
                        <a href="http://localhost:3000/page_change_mdp/${encodeURIComponent(email)}">Reinitialiser le mot de passe</a>
                        <p>Si vous n'avez pas demande cette reinitialisation, veuillez ignorer cet email.</p>
                        <p>Cordialement,</p>
                        <p>L'equipe de 'TOURNAMENT'</p>
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Erreur lors de l\'envoi de l\'email :', error);
                        res.status(500).send('Erreur lors de l\'envoi de l\'email.');
                    } else {
                        console.log('Email envoye :', info.response);
                        res.render('mot_passe_oublie', {  error: false , situation: req.session.situation , message : "Un lien de renitialisation mot de passe a ete envoye ."});
                    }
                });
                
            } else {
                console.log("pas de compte");
                res.render('mot_passe_oublie', { error: "aucun compte associe à ce mail ", situation: req.session.situation, message : false });
            }
        });
    });

    // Route pour changer le mot de passe
    router.post('/changer_mdp/:email', (req, res) => {
        const email_mdp = req.params.email; // Recuperer l'email depuis les paramètres de la route
        const { new_password, confirm_password } = req.body;

        // Verifier si les mots de passe correspondent
        if (new_password !== confirm_password) {
            res.render('page_change_mdp', { email_qui_veut_changer_mdp: email_mdp, error: 'Les mots de passe ne correspondent pas.', situation: req.session.situation });
            return;
        }

        // Mettre à jour le mot de passe dans la base de donnees
        db.query('UPDATE UTILISATEUR SET mot_de_passe = ? WHERE email = ?', [new_password, email_mdp], (err, result) => {
            if (err) {
                console.error('Erreur lors de la mise à jour du mot de passe :', err);
                res.status(500).send('Erreur lors de la mise à jour du mot de passe.');
                return;
            }
            console.log("Mot de passe change avec succès.");

            // Envoi de l'email de confirmation
            const mailOptions = {
                from: 'votre_email@gmail.com', // Remplacez par votre email
                to: email_mdp,
                subject: 'Changement de mot de passe',
                text: 'Votre mot de passe a ete change avec succès.'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi de l\'email :', error);
                    res.status(500).send('Erreur lors de l\'envoi de l\'email.');
                    return;
                }
                console.log('Email envoye : ' + info.response);
                // Rediriger après l'envoi
                if (req.session.situation === "menu") {
                    res.redirect('/chargement.html');
                } else {
                    res.redirect('/menu');
                }
            });
        });
    });
    
    // Route pour le catalogue de jeux
    router.get('/api/catalogue', (req, res) => {
        console.log("*** /catalogue ***");

        const query = `
            SELECT
                Stock.id_stock,
                Stock.nom_jeu,
                Stock.Prix_unit,
                Stock.photo_path,
                Session.Frais_depot_fixe,
                Session.Frais_depot_percent,
                (Stock.Prix_unit + (Stock.Prix_unit * Session.Frais_depot_percent / 100) + Session.Frais_depot_fixe) AS prix_final,
                Stock.est_en_vente
            FROM Stock
            JOIN Session ON Stock.numero_session_actuelle = Session.id_session
        `;
     
        

        db.query(query, (err, results) => {
            if (err) {
                console.error('Erreur lors de la recuperation du catalogue:', err);
                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }
            res.status(200).json(results);
        });
    });
    router.post('/depot', async (req, res) => {
            console.log("*** /depot ***");

            const { email_vendeur, nom_jeu, prix_unit, quantite_deposee, est_en_vente, editeur, description, num_session } = req.body;

            // Verifier que l'email de la session existe et recuperer le rôle
            const emailConnecte = req.session.email_connecte;

            if (!emailConnecte) {
                return res.redirect('/pas_le_bon_role'); // Redirection si l'email n'est pas dans la session
            }

            try {
                const userQuery = 'SELECT role FROM Users WHERE email = ?';
                const [user] = await query(userQuery, [emailConnecte]);

                // Verifier si l'utilisateur a un rôle admin ou administrateur
                if (!user || (user.role !== 'admin' && user.role !== 'administrateur')) {
                    return res.redirect('/pas_le_bon_role'); // Redirection si le rôle ne correspond pas
                }

                // Inserer dans la base de donnees
                const sql = 'INSERT INTO Stock (email_vendeur, nom_jeu, Prix_unit, numero_session_actuelle, Quantite_actuelle, est_en_vente) VALUES (?, ?, ?, ?, ?, ?)';
                const values = [email_vendeur, nom_jeu, prix_unit, num_session, quantite_deposee, est_en_vente];

                await query(sql, values);
                res.status(200).send({ message: 'Jeu ajoute avec succès' });
            } catch (error) {
                console.error('Erreur lors de l\'ajout du jeu:', error);
                res.status(500).send({ message: 'Erreur lors de l\'ajout du jeu' });
            }
        });
    // Route pour gerer les requêtes GET pour le bilan
    router.post('/bilan', (req, res) => {
        const { bilanParticulier, sessionParticuliere, emailParticulier, numeroSession, chargesFixes } = req.body;
        console.log('Requête reçue avec paramètres:', { bilanParticulier, sessionParticuliere, emailParticulier, numeroSession, chargesFixes });

        let venteQuery, depotQuery;
        const venteQueryParams = [];
        const depotQueryParams = [];

        // Definition des requêtes en fonction des cas
        if (bilanParticulier && sessionParticuliere) {
            console.log('Cas 1 : Bilan particulier, Session particulière');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit
                FROM Historique_Vente
                WHERE numero_session_vente = ? AND email_vendeur = ?
                ORDER BY id_vente ASC
            `;
            venteQueryParams.push(numeroSession, emailParticulier);
            
            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
                WHERE numero_session_depot = ? AND email_vendeur = ?
            `;
            depotQueryParams.push(numeroSession, emailParticulier);
        } else if (bilanParticulier && !sessionParticuliere) {
            console.log('Cas 2 : Bilan particulier, Toutes les sessions');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit
                FROM Historique_Vente
                WHERE email_vendeur = ?
                ORDER BY id_vente ASC
            `;
            venteQueryParams.push(emailParticulier);
            
            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
                WHERE email_vendeur = ?
            `;
            depotQueryParams.push(emailParticulier);
        } else if (!bilanParticulier && sessionParticuliere) {
            console.log('Cas 3 : Bilan general, Session particulière');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit, Frais_depot_percent, Frais_depot_fixe
                FROM Historique_Vente
                JOIN Session ON numero_session_vente = id_session
                WHERE numero_session_vente = ?
                ORDER BY id_vente ASC
            `;
            venteQueryParams.push(numeroSession);

            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
                WHERE numero_session_depot = ?
            `;
            depotQueryParams.push(numeroSession);
        } else {
            console.log('Cas 4 : Bilan general, Toutes les sessions');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit, Frais_depot_percent, Frais_depot_fixe
                FROM Historique_Vente
                JOIN Session ON numero_session_vente = id_session
                ORDER BY id_vente ASC
            `;

            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
            `;
        }

        console.log('Requête SQL pour les ventes:', venteQuery);
        console.log('Requête SQL pour les depôts:', depotQuery);

        db.query(venteQuery, venteQueryParams, (err, venteResults) => {
            if (err) {
                console.error('Erreur lors de la recuperation des donnees de vente:', err);
                return res.status(500).json({ message: 'Erreur lors de la recuperation des donnees de vente' });
            }

            console.log('Resultats de vente:', venteResults);
            if (venteResults.length === 0) {
                console.log('Aucun resultat de vente trouve.');
                return res.json({ message: 'Aucun graphe ne peut être effectue, aucune vente realisee pour cette situation' });
            }

            // Si des resultats de vente sont trouves, continuez avec la requête de depôt
            db.query(depotQuery, depotQueryParams, (err, depotResults) => {
                if (err) {
                    console.error('Erreur lors de la recuperation des donnees de depôt:', err);
                    return res.status(500).json({ message: 'Erreur lors de la recuperation des donnees de depôt' });
                }

                console.log('Resultats de depôt:', depotResults);

                // Renvoyer les resultats au client
                res.json({
                    bilanParticulier,
                    sessionParticuliere,
                    emailParticulier,
                    numeroSession,
                    chargesFixes
                });
            });
        });
    });


    router.get('/bilan-graphe', (req, res) => {
        const { bilanParticulier, sessionParticuliere, emailParticulier, numeroSession, chargesFixes } = req.query;

        // Transformer les paramètres en booleens
        const isBilanParticulier = bilanParticulier === 'true';
        const isSessionParticuliere = sessionParticuliere === 'true';

        console.log('Requête reçue avec paramètres:', { isBilanParticulier, isSessionParticuliere, emailParticulier, numeroSession, chargesFixes });

        let venteQuery, depotQuery;
        const venteQueryParams = [];
        const depotQueryParams = [];

        // Configuration des requêtes SQL selon les paramètres
        if (isBilanParticulier && isSessionParticuliere) {
            console.log('Cas 1 : Bilan particulier, Session particulière');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit
                FROM Historique_Vente
                WHERE numero_session_vente = ? AND email_vendeur = ?
                ORDER BY id_vente ASC
            `;
            venteQueryParams.push(numeroSession, emailParticulier);

            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
                WHERE numero_session_depot = ? AND email_vendeur = ?
            `;
            depotQueryParams.push(numeroSession, emailParticulier);
        } else if (isBilanParticulier) {
            console.log('Cas 2 : Bilan particulier, Toutes les sessions');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit
                FROM Historique_Vente
                WHERE email_vendeur = ?
                ORDER BY id_vente ASC
            `;
            venteQueryParams.push(emailParticulier);

            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
                WHERE email_vendeur = ?
            `;
            depotQueryParams.push(emailParticulier);
        } else if (isSessionParticuliere) {
            console.log('Cas 3 : Bilan general, Session particulière');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit, Frais_depot_percent, Frais_depot_fixe
                FROM Historique_Vente
                JOIN Session ON numero_session_vente = id_session
                WHERE numero_session_vente = ?
                ORDER BY id_vente ASC
            `;
            venteQueryParams.push(numeroSession);

            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
                WHERE numero_session_depot = ?
            `;
            depotQueryParams.push(numeroSession);
        } else {
            console.log('Cas 4 : Bilan general, Toutes les sessions');
            venteQuery = `
                SELECT id_vente, Quantite_vendu, Prix_unit, Frais_depot_percent, Frais_depot_fixe
                FROM Historique_Vente
                JOIN Session ON numero_session_vente = id_session
                ORDER BY id_vente ASC
            `;

            depotQuery = `
                SELECT SUM(Quantite_depose) AS totalQuantiteDeposee
                FROM Historique_Depot
            `;
        }

        console.log('Requête SQL pour les ventes:', venteQuery);
        console.log('Requête SQL pour les depôts:', depotQuery);

        db.query(venteQuery, venteQueryParams, (err, venteResults) => {
            if (err) {
                console.error('Erreur lors de la recuperation des donnees de vente:', err);
                return res.status(500).json({ message: 'Erreur lors de la recuperation des donnees de vente' });
            }

            console.log('Resultats de vente:', venteResults);
            if (venteResults.length === 0) {
                console.log('Aucun resultat trouve.');
                return res.json({ message: 'Aucun graphe ne peut être effectue, aucune vente realisee pour cette situation' });
            }

            db.query(depotQuery, depotQueryParams, (err, depotResults) => {
                if (err) {
                    console.error('Erreur lors de la recuperation des donnees de depôt:', err);
                    return res.status(500).json({ message: 'Erreur lors de la recuperation des donnees de depôt' });
                }

                const totalQuantiteDeposee = depotResults[0]?.totalQuantiteDeposee || 0;
                console.log('Quantite deposee totale:', totalQuantiteDeposee);

                const listeX = [];
                let a = 1;

                // Liste Y : Prix unitaires selon la quantite vendue
                const listeY = venteResults.flatMap(row => {
                    const prixUnitaire = row.Prix_unit+row.Prix_unit * (row.Frais_depot_percent / 100) + row.Frais_depot_fixe;
                    const yElements = Array(row.Quantite_vendu).fill(prixUnitaire);
                    yElements.forEach(() => {
                        listeX.push(a);
                        a += 1;
                    });
                    return yElements;
                });

                // Liste Y2 : Prix unitaires avec frais
                const listeY2 = venteResults.flatMap(row => {
                    const prixAvecFrais = row.Prix_unit * (row.Frais_depot_percent / 100) + row.Frais_depot_fixe;
                    const y2Elements = Array(row.Quantite_vendu).fill(prixAvecFrais);
                    return y2Elements;
                });

                // Liste Y3 : Prix unitaires
                const listeY3 = venteResults.flatMap(row => {
                    const prix = row.Prix_unit;
                    const y3Elements = Array(row.Quantite_vendu).fill(prix);
                    return y3Elements;
                });
       
                // Fonction pour calculer la somme successive
                function sommeSuccessive(liste) {
                    const sommeListe = [];
                    let somme = 0;
                    liste.forEach(valeur => {
                        somme += valeur;
                        sommeListe.push(somme);
                    });
                    return sommeListe;
                }

                const listeYSomme = sommeSuccessive(listeY);
                const listeY2Somme = sommeSuccessive(listeY2);
                const listeY3Somme = sommeSuccessive(listeY3);
                const totalQuantiteVendu = listeY.length;
                console.log('Liste y creee :', listeYSomme);
                console.log('Liste y2 creee :', listeY2Somme);
                console.log('Liste y3 creee :', listeY3Somme); // Afficher la liste Y3
                console.log('Liste x creee :', listeX);
                console.log('Quantite totale vendue :', totalQuantiteVendu);
                res.json({ listeYSomme, listeY2Somme, listeY3Somme, listeX, totalQuantiteDeposee, totalQuantiteVendu, chargesFixes });
            });
        });
    });
    router.get('/retrait-liste/:email', async (req, res) => {
        console.log('Route /retrait-liste atteinte');
        const email_vendeur = req.params.email;
        console.log('Email vendeur reçu :', email_vendeur);

        try {
            // Verification du rôle de l'utilisateur
            const emailConnecte = req.session.email_connecte;
            console.log('Email connecte (session) :', emailConnecte);

            // Verifie le rôle recupere
            const userQuery = 'SELECT role FROM Users WHERE email = ?';
            const [user] = await query(userQuery, [emailConnecte]);
            console.log('Utilisateur trouve dans Users :', user);

            // Requête pour recuperer les jeux du vendeur avec l'ID et la quantite
            const sql = 'SELECT id_stock, nom_jeu, Prix_unit, Quantite_actuelle FROM Stock WHERE email_vendeur = ?';
            console.log('Requête SQL pour les jeux :', sql);

            let games = await query(sql, [email_vendeur]);
            console.log('Jeux recuperes :', games);

            // Duplication des jeux en fonction de Quantite_actuelle
            games = games.flatMap(game => {
                return Array.from({ length: game.Quantite_actuelle }, (_, index) => ({
                    ...game,
                    Quantite_actuelle: 1 // Fixer la quantite à 1 pour chaque copie
                }));
            });

            console.log('Jeux après duplication :', games);
            res.status(200).send(games);
        } catch (error) {
            console.error('Erreur lors de la recuperation des jeux:', error);
            res.status(500).send({ message: 'Erreur lors de la recuperation des jeux' });
        }
    });


    // Route pour traiter la requête de retrait
    router.post('/retrait', (req, res) => {
        const { id_stock, nombre_checkbox_selectionne_cet_id } = req.body;
        console.log("nbr check box selectionne:", nombre_checkbox_selectionne_cet_id);

        const selectQuery = 'SELECT Quantite_actuelle FROM Stock WHERE id_stock = ?';
        db.query(selectQuery, [id_stock], (err, results) => {
            if (err) {
                console.error('Erreur lors de la recuperation de la quantite actuelle :', err);
                return res.status(500).json({ message: 'Erreur de serveur' }); // Retourner une reponse JSON
            }

            const quantiteActuelle = results[0].Quantite_actuelle;

            if (nombre_checkbox_selectionne_cet_id === quantiteActuelle) {
                const deleteQuery = 'DELETE FROM Stock WHERE id_stock = ?';
                db.query(deleteQuery, [id_stock], (err) => {
                    if (err) {
                        console.error('Erreur lors de la suppression du jeu :', err);
                        return res.status(500).json({ message: 'Erreur de serveur' });
                    } else {
                        return res.status(200).json({ message: 'Jeu supprime avec succès' }); // Reponse JSON
                    }
                });
            } else if (nombre_checkbox_selectionne_cet_id < quantiteActuelle) {
                const updateQuery =
                    'UPDATE Stock SET Quantite_actuelle = Quantite_actuelle - ? WHERE id_stock = ?';
                db.query(updateQuery, [nombre_checkbox_selectionne_cet_id, id_stock], (err) => {
                    if (err) {
                        console.error('Erreur lors de la mise à jour de la quantite :', err);
                        return res.status(500).json({ message: 'Erreur de serveur' });
                    } else {
                        return res.status(200).json({ message: 'Quantite mise à jour avec succès' }); // Reponse JSON
                    }
                });
            } else {
                return res.status(400).json({ message: 'Quantite invalide' }); // Reponse JSON
            }
        });
    });

    router.post('/enregistrer-achat', (req, res) => {
      console.log("------------------E-achat----------------------------");
      const { id_stock, quantite_vendu } = req.body;
      console.log(id_stock, quantite_vendu);

      // Rechercher le jeu dans la table Stock
      const selectQuery = 'SELECT email_vendeur, nom_jeu, Prix_unit, photo_path, numero_session_actuelle, Quantite_actuelle FROM Stock WHERE id_stock = ?';
      db.query(selectQuery, [id_stock], (err, results) => {
        if (err) {
          return res.status(500).send('Erreur lors de la récupération du jeu');
        }

        if (results.length === 0) {
          return res.status(404).send('Jeu non trouvé');
        }

        const { email_vendeur, nom_jeu, Prix_unit, photo_path, numero_session_actuelle, Quantite_actuelle } = results[0];
        console.log(email_vendeur, nom_jeu, Prix_unit, photo_path, numero_session_actuelle);

        // Ajouter une ligne dans Historique_Vente
        const insertQuery = 'INSERT INTO Historique_Vente (email_vendeur, nom_jeu, Prix_unit, photo_path, numero_session_vente, Quantite_vendu, vendeur_paye) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const vendeurPaye = false; // Changez cela selon votre logique
        db.query(insertQuery, [email_vendeur, nom_jeu, Prix_unit, photo_path, numero_session_actuelle, quantite_vendu, vendeurPaye], (err) => {
          if (err) {
            return res.status(500).send('Erreur lors de l’enregistrement de la vente');
          }
          console.log("achat enregistré");

          // Mise à jour ou suppression de la ligne dans Stock
          if (Quantite_actuelle === quantite_vendu) {
            // Supprimer la ligne si les quantités sont égales
            const deleteQuery = 'DELETE FROM Stock WHERE id_stock = ?';
            db.query(deleteQuery, [id_stock], (err) => {
              if (err) {
                return res.status(500).send('Erreur lors de la suppression du jeu');
              }
              console.log("Ligne supprimée de Stock");
              res.json({ message: 'Achat enregistré avec succès et jeu retiré du stock' });
            });
          } else {
            // Mettre à jour la quantité actuelle
            const nouvelleQuantite = Quantite_actuelle - quantite_vendu;
            const updateQuery = 'UPDATE Stock SET Quantite_actuelle = ? WHERE id_stock = ?';
            db.query(updateQuery, [nouvelleQuantite, id_stock], (err) => {
              if (err) {
                return res.status(500).send('Erreur lors de la mise à jour de la quantité');
              }
              console.log("Quantité mise à jour dans Stock");
              res.json({ message: 'Achat enregistré avec succès et quantité mise à jour' });
            });
          }
        });
      });
    });

    router.get('/historique-vente/:email', (req, res) => {
        const emailVendeur = req.params.email;
        const query = `
            SELECT nom_jeu, Quantite_vendu, Prix_unit, vendeur_paye,
                   SUM(CASE WHEN vendeur_paye = false THEN Prix_unit * Quantite_vendu ELSE 0 END) AS Somme_total_du
            FROM Historique_Vente
            WHERE email_vendeur = ?
            GROUP BY nom_jeu, Quantite_vendu, Prix_unit, vendeur_paye`;


        db.query(query, [emailVendeur], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    });



    router.post('/payer-vendeur-liste', (req, res) => {
        const emailVendeur = req.body.email; // Assurez-vous d'envoyer l'email dans le corps de la requête
        const updateQuery = 'UPDATE Historique_Vente SET vendeur_paye = TRUE WHERE email_vendeur = ?';

        db.query(updateQuery, [emailVendeur], (err) => {
            if (err) {
                return res.status(500).send('Erreur lors de la mise à jour du vendeur');
            }
            // Envoyez une réponse de succès
            res.send({ message: 'Vendeur payé mis à jour avec succès', refresh: true });
        });
    });

    
    router.get('/cataloguevendeur', async (req, res) => {
        const email = req.query.email; // Supposons que l'email soit passé comme paramètre de requête
        if (!email) {
            return res.status(400).send('Email est requis');
        }
    
        try {
            const [rows] = await db.execute(`
                SELECT id_stock, nom_jeu, Prix_unit AS prix_final, photo_path 
                FROM Stock 
                WHERE email_vendeur = ? AND est_en_vente = 1
            `, [email]);
    
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des jeux.');
        }
    }); 


    return router;
};
//    //----------------------------------------------------------------------
//    //----------------------------------- connexion ---------------------------
//    //----------------------------------------------------------------------
//   
//    router.post('/connexion', (req, res) => {
//        console.log("post");
//        const { email, password } = req.body;
//
//        db.query('SELECT * FROM UTILISATEUR WHERE email=? AND mot_de_passe=?', [email, password], (err, results) => {
//            if (err) {
//                console.error('Erreur lors de la verification de l\'utilisateur :', err);
//                res.status(500).send('Erreur lors de la verification de l\'utilisateur.');
//                return;
//            }
//
//            if (results.length > 0) {
//                req.session.email_connecte = email;
//                if (req.session.situation === "menu") {
//                    res.redirect('/chargement.html');
//                } else {
//                    res.redirect('/menu');
//                }
//            } else {
//                console.log("pas de compte");
//                res.status(400).json({ message: 'pas de compte' });
//            }
//        });
//    });
//    
//   
//
//    //----------------------------------------------------------------------
//    //----------------------------------- /page_change_mdp --------------------
//    //----------------------------------------------------------------------
//
//    router.post('/changer_mdp', (req, res) => {
//        console.log("*** /changer_mdp ***");
//        console.log("$_SESSION['email_connecte'] : ", req.session.email_connecte);
//        console.log("$_SESSION['situation'] : ", req.session.situation);
//
//        const { email_mdp, new_password, confirm_password } = req.body;
//        console.log("email_mdp : ", email_mdp);
//        console.log("new_password: ", confirm_password);
//        console.log("new_password: ", confirm_password);
//        // Verifier si les mots de passe correspondent
//        if (new_password !== confirm_password) {
//            res.render('page_change_mdp', { email_qui_veut_changer_mdp: email_mdp, error: 'Les mots de passe ne correspondent pas.', situation: req.session.situation });
//            return;
//        }
//
//        // Mettre à jour le mot de passe dans la base de donnees
//        db.query('UPDATE UTILISATEUR SET mot_de_passe = ? WHERE email = ?', [new_password, email_mdp], (err, result) => {
//            if (err) {
//                console.error('Erreur lors de la mise à jour du mot de passe :', err);
//                res.status(500).send('Erreur lors de la mise à jour du mot de passe.');
//                return;
//            }
//            console.log("Mot de passe change avec succès.");
//            //mail de validite
//            let transporter = nodemailer.createTransport({
//                host: 'smtp.gmail.com',
//                port: 587,
//                secure: false,
//                auth: {
//                    user: 'barbedetanthony@gmail.com',
//                    pass: 'dmunpyeuzmkuebqc'
//                }
//            });
//
//            let mailOptions = {
//                from: '"Anthony" <barbedetanthony@gmail.com>',
//                to: email_mdp,
//                subject: 'Reinitialisation de votre mot de passe',
//                html: `
//                    <p>Bonjour,</p>
//                    <p>Nous vous confirmons que votre mot de passe a bien ete modifie <p>
//                    <p>Cordialement,</p>
//                    <p>L'equipe de 'TOURNAMENT'</p>
//                `
//            };
//
//            transporter.sendMail(mailOptions, (error, info) => {
//                if (error) {
//                    console.error('Erreur lors de l\'envoi de l\'email :', error);
//                    res.status(500).send('Erreur lors de l\'envoi de l\'email.');
//                } else {
//                    console.log('Email envoye :', info.response);
//                    res.render('mot_passe_oublie', {  error: false , situation: req.session.situation , message : "Un lien de renitialisation mot de passe a ete envoye ."});
//                }
//            });
//            if (req.session.situation === "menu") {
//                res.redirect('/chargement.html');
//            } else {
//                res.redirect('/menu');
//            }
//        });
//    });
   
