# STORY-001 — Connexion et ajout au panier (saucedemo.com)

**En tant qu'** utilisateur du site saucedemo.com
**Je veux** me connecter avec des identifiants valides et ajouter un produit au panier
**Afin de** valider le parcours d'achat minimal (login + panier)

## Source
Site cible : https://www.saucedemo.com
Identifiants et messages d'erreur : documentés publiquement sur la page de connexion du site (liste des usernames valides, mot de passe unique `secret_sauce`).

## Critères d'acceptation

### Scénario 1 : Connexion réussie
```
Étant donné que je suis sur la page de connexion (https://www.saucedemo.com)
Quand je saisis l'identifiant "standard_user" et le mot de passe "secret_sauce"
Et que je clique sur "Login"
Alors je suis redirigé vers la page inventory (/inventory.html)
```

### Scénario 2 : Connexion échouée (identifiants invalides)
```
Étant donné que je suis sur la page de connexion
Quand je saisis l'identifiant "standard_user" et le mot de passe "wrong_password"
Et que je clique sur "Login"
Alors le message "Epic sadface: Username and password do not match any user in this service" est affiché
```

### Scénario 3 : Ajout au panier
```
Étant donné que je suis connecté et sur la page inventory
Quand j'ajoute le produit "Sauce Labs Backpack" au panier
Alors le badge du panier affiche "1"
```
