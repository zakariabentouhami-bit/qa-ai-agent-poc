# Rapport d'exécution — STORY-001

Date : 2026-09-15
Site : https://www.saucedemo.com
Exécution : MCP Playwright (session live, navigateur réel), 3/3 scénarios exécutés

## Résultats

| Scénario | Cas de test (CSV) | Résultat | Observation |
|---|---|---|---|
| 1 - Connexion réussie | POC-AGENT-1 / TC1 | **PASS** | Après saisie `standard_user`/`secret_sauce` et clic sur Login, l'URL passe bien à `https://www.saucedemo.com/inventory.html` (redirection confirmée). |
| 2 - Connexion invalide | POC-AGENT-1 / TC2 | **FAIL** | Après saisie `standard_user`/`wrong_password` et clic sur Login, aucune redirection (attendu) — mais aucun message d'erreur `[data-test="error"]` n'apparaît dans le DOM (`document.querySelector('[data-test="error"]')` → `null`). Le texte "Epic sadface" n'est présent nulle part sur la page. |
| 3 - Ajout au panier | POC-AGENT-1 / TC3 | **FAIL** | Après connexion valide, le clic sur "Add to cart" (`[data-test="add-to-cart-sauce-labs-backpack"]`) ne modifie ni le libellé du bouton (reste "Add to cart", attendu : "Remove") ni le badge du panier (reste "Cart, empty", attendu : "1"). |

## Diagnostic

**Scénario 2 (message d'erreur absent) :**
- Le formulaire conserve les valeurs saisies après le clic (pas de reset), ce qui indique que le clic est bien reçu par la page.
- Aucune erreur réseau (401) autre que la télémétrie tierce `events.backtrace.io` (sans rapport avec la logique de connexion).
- Le message d'erreur attendu, géré côté client (pas de rechargement de page), ne s'affiche pas.

**Scénario 3 (ajout au panier sans effet) :**
- Vérifications effectuées avant de conclure (pas de simple "ça n'a pas marché, on retente en boucle") :
  1. Référence d'élément fraîche re-testée (pas un problème de ref périmée).
  2. Reproduit sur un 2e produit différent ("Sauce Labs Bike Light") — même résultat.
  3. Attente de 1,5s après le clic, sans changement (pas un problème de timing/rendu asynchrone).
  4. Vérification qu'aucun overlay invisible n'intercepte le clic (`document.elementFromPoint` au centre du bouton renvoie bien le bouton lui-même).
  5. Dispatch d'un `MouseEvent('click')` natif directement via JavaScript sur le bouton — aucun effet non plus.
  6. Le bouton "Open Menu" (hamburger menu) présente le même symptôme : le clic n'ouvre pas le menu.
- Ressources statiques toutes chargées avec succès (bundle JS, CSS, images — codes 200), donc pas un problème de chargement de script.

**Hypothèse de cause racine :** la navigation par routing (login → `/inventory.html`) fonctionne, mais toute mise à jour d'état pilotée par clic (badge panier, message d'erreur, ouverture de menu) ne se produit pas dans cet environnement d'exécution — suggérant un problème de synchronisation entre le store applicatif (state management) et l'interface, isolé aux interactions post-navigation plutôt qu'à un souci de sélecteur ou de script du test lui-même. Cause non confirmée au niveau du code source de l'application (hors périmètre : pas d'accès au code de saucedemo.com).

## Conclusion

1/3 scénarios en succès réel. Les 2 échecs sont documentés avec leur diagnostic ; aucun résultat n'a été simulé ou supposé — chaque verdict provient d'une observation directe du DOM/de l'URL après exécution réelle via MCP Playwright.

## Traçabilité

Story : STORY-001 · Stratégie : docs/strategie-test-20260915.md · Cas de test : outputs/cas-test-20260915.csv
