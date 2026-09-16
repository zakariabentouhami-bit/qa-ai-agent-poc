# STORY-002 — Connexion sécurisée (the-internet)

**En tant qu'** utilisateur du site the-internet.herokuapp.com
**Je veux** me connecter avec des identifiants valides pour accéder à la zone sécurisée
**Afin de** valider le parcours d'authentification minimal

## Source
Document source : `inputs/the-internet-login-source.md`
Origine : dépôt open source [saucelabs/the-internet](https://github.com/saucelabs/the-internet) (Apache-2.0/MIT)
Site cible : https://the-internet.herokuapp.com/login
Date de collecte et de vérification live : 2026-09-16

## Critères d'acceptation

### Scénario 1 : Connexion réussie
```
Étant donné que je suis sur la page de connexion (https://the-internet.herokuapp.com/login)
Quand je saisis l'identifiant "tomsmith" et le mot de passe "SuperSecretPassword!"
Et que je soumets le formulaire
Alors je suis redirigé vers la page sécurisée (/secure)
Et le message "You logged into a secure area!" est affiché
```

### Scénario 2 : Connexion échouée (mot de passe invalide)
```
Étant donné que je suis sur la page de connexion
Quand je saisis l'identifiant "tomsmith" et un mot de passe invalide
Et que je soumets le formulaire
Alors je reste sur la page de connexion
Et le message "Your password is invalid!" est affiché
```

## Note d'exécution
Lors de la collecte, les actions `.click()` et l'appui sur `Entrée` n'ont pas déclenché la soumission du formulaire dans l'environnement d'exécution utilisé à ce moment (navigateur réel non isolé, voir `outputs/rapport-execution-20260915.md` addendum du 2026-09-16). Depuis, le MCP Playwright est reconfiguré en profil isolé — une exécution future de cette story doit utiliser une interaction standard (clic) sans ce contournement.
