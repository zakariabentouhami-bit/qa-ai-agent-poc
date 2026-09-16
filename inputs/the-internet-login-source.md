# Source — Form Authentication (the-internet)

**Origine** : dépôt open source [saucelabs/the-internet](https://github.com/saucelabs/the-internet) (licences Apache-2.0 / MIT), application de démonstration publique pour tests d'automatisation.
**Page testée** : https://the-internet.herokuapp.com/login
**Date de collecte** : 2026-09-16
**Méthode** : contenu de la page + comportement vérifiés en direct via MCP Playwright (pas de donnée supposée).

## Contenu de la page (tel qu'observé)

> "This is where you can log into the secure area. Enter *tomsmith* for the username and *SuperSecretPassword!* for the password. If the information is wrong you should see error messages."

Formulaire : champ `Username`, champ `Password`, bouton `Login`.

## Comportements vérifiés en direct (2026-09-16)

- **Connexion valide** (`tomsmith` / `SuperSecretPassword!`) → redirection vers `/secure`, message affiché : "You logged into a secure area!", lien "Logout" présent.
- **Connexion invalide** (`tomsmith` / mot de passe erroné) → reste sur `/login`, message affiché : "Your password is invalid!".

## Note d'exécution (pour traçabilité)

Lors de la vérification, les actions `.click()` et l'appui sur `Entrée` n'ont pas déclenché la soumission du formulaire (aucune requête réseau émise) — comportement identique à celui déjà observé sur saucedemo.com (voir `outputs/rapport-execution-20260915.md`), sur une application technologiquement différente (serveur classique, pas de SPA React). La confirmation des textes ci-dessus a nécessité une soumission directe du formulaire (`form.requestSubmit()`). Ceci renforce l'hypothèse "artefact d'outillage MCP" plutôt qu'un défaut spécifique à une application.
