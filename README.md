Auteur du projet: 
- Virginie Jovien
Projet Final : Réseau social : Adopte un maître

Le réseau social est accessible à l'adresse suivante:

        https://adopte-un-maitre.herokuapp.com
       
1) Procédure d'installation pour récupérer le projet et le lancer à partir de localhost

Pour récupérer un clone du projet "adopteUnMaitre":
$ git clone https:/github.com/virginiejovien/adopteUnMaitre

Ci-dessous les installations globales à faire : 
   - "npm"
   - "nodejs" 
   - "expressjs"
   - "mongodb" (installer mongoDB depuis cette adresse: https://www.mongoDB.org/downloads)

Ci-dessous les installations locales à faire : 
   - $ cd ~/adopteUnMaitre"
   - $ npm init -y                   // Va créer le package.json du projet "adopteUnMaitre" et l'arborescence technique                                       et liste les node_modules, le fichier JSON des dépendances ...
   - $ npm install mongodb --save     // Cette commande installe le module d'interface avec MongoDB
   - $ npm install express --save     // Cette commande installe le module Express.JS
   - $ npm install socket.io --save   // Cette commande installe le module Client-Serveur "socket.io"
   - $ npm install pug --save         // Cette commande installe le moteur de template "Pug"

En dessous du répertoire ": ~/adopteUnMaitre"   on devrait avoir l'arborescence suivante :

  adopteUnMaitre 
   |-- node_modules    // modules de nodes.js nécéssaires pour le projet "adopteUnMaitre"
   |-- data           // Stockage de la base de données "jeu" (collection "joueur" et collection "question")
   |     |- jeu
   |         |- joueur       // collection "joueur"
   |         |- question     // collection  "question"
   |        
   |-- assets         // Ressources côté client
   |    |- css        // Stockage des fichiers ".css"
   |    |- images     // Stockage des images
   |    |- js         // Stockage des scripts Javascripts ".js"
   |       
   |-- views          // Stockage des templates "Pug"
   |-- .gitignore
   |-- db.js
   |-- DIW JS - Ateliar Final.pdf
   |-- index.html   
   |-- lancer-mongo.bat
   |-- package-lock.json
   |-- package.json 
   |-- Procfile
   |-- README.md
   |-- serverAdopteUnMaitre.js // serveur  du jeu 
   

2) Procédure de lancement du jeu en localhost
    - La base de données jeu est hébergée sur le site mLab
    - Possibilité de la créer en local à partir des fichiers question.json et joueur.json
      - lancer la BBD:
          1: lancer mongodb 
          2: puis se placer sur la base de données jeu : use jeu
          3: mongoimport --db chat --collection question --file ~/adopteUnMaitre/data/question.json
          (3' si pb dans l'importation du fichier JSON) copier le contenu du fichier : bdd_jeu_questions.js qui se trouve  dans le repertoire data :  ~/adopteUnMaitre/data/bdd_jeu_questions.js (tous les insert de la collection question)
          Dans la BDD jeu dans les lignes de commandes de mongodb apres use jeu :::> coller le db.question.insertMany([{.....}]);

          La base de données jeu a actuellemnt une collection "question", à la premiere exexution du jeu "adopteUnMaitre", lorsqu'un premier joueur s'inscrira correctement une deuxième collection "joueur" sera créée. 

          Rappel: Avant de lancer le serveur du jeu il est nécéssaire de se placer dur la BDD jeu, taper la commande suivante:
            - use jeu

  - lancer le serveur: quatreSynonymesUnMot.js
       - $ cd ~/AdopteUnMaitre"
       - $ nodemon serverAdopteUnMaitre.js

  - coté navigateur (Chrome, Firefox, Opera....)
    taper l'addresse suivante: 
   http://localhost:2000/


      

  A vous de JOUER!!!!!      
       





