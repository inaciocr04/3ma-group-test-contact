# 📬 Formulaire de Contact - Next.js

Je n’ai pas réussi à créer le Dockerfile, car Docker n’est pas installé sur la machine actuelle. Avec le temps limité dont je disposais, il m’a été difficile de le mettre en place. Je vous ai donc simplement préparé le fichier.

## ✨ Fonctionnalités

- Formulaire de contact avec validation des champs requis (nom, email, message)
- Persistance des données dans une base de données SQLite avec Prisma
- Envoi d’un email de confirmation via SMTP (OVH ou autre)
- Message de retour affiché (succès ou erreur)

### 1. Cloner le projet

git clone https://github.com/inaciocr04/3ma-group-test-contact.git
cd 3ma-group-test-contact

### 2. Installer les dépendances

npm install ou pnpm install

### 3. Configurer les variables d’environnement

cp .env.example .env

### 4. Générer le client Prisma et lancer les migrations

npx prisma generate
npx prisma migrate dev --name init

### 5. Lancer le serveur

npm run dev ou pnpm dev

L'application sera disponible sur http://localhost:3000

📦 Structure du projet

/app
    /api
        /contact → Routes API GET & POST
    /form → Page avec le formulaire
/prisma
    schema.prisma → Modèle de base de données
/src
    /components
    /ui
        button.tsx → Composant importer grâce a ui.shadcn
        ...
    /lib
        prisma.ts → Initialisation du client Prisma

### 6. Test de l'application

Lance le serveur via pnpm dev ou npm run dev

Accède à la page d'accueil : http://localhost:3000

Clique sur le bouton "Contact" pour accéder au formulaire

Remplis tous les champs obligatoires (nom, email, message)

Clique sur "Envoyer"

Résultats possibles :

- Si tout se passe bien : Message envoyé avec succès.

- En cas d’erreur serveur : Une erreur est survenue. (erreur d'installation)

- Si un champ est mal rempli ou vide : message d’erreur de validation affiché sous le champ concerné
