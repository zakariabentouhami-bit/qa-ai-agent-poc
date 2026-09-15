# Rapport d'exécution — STORY-001

Date : 2026-09-15
Site : https://www.saucedemo.com
Exécution : MCP Playwright (session live, navigateur réel). Chaque scénario a été rejoué plusieurs fois (suite à revue) pour distinguer un défaut reproductible d'une instabilité d'exécution — voir Diagnostic.

## Résultats

| Scénario | Cas de test (CSV) | Résultat | Observation |
|---|---|---|---|
| 1 - Connexion réussie | POC-AGENT-1 / TC1 | **INSTABLE** | 1ère tentative : redirection confirmée vers `/inventory.html`. 2e tentative (même session, sans rechargement complet) : aucune redirection après clic sur Login, formulaire inchangé. 3e tentative (contexte navigateur fraîchement rouvert) : redirection à nouveau confirmée. Le comportement n'est pas reproductible de façon constante. |
| 2 - Connexion invalide | POC-AGENT-1 / TC2 | **FAIL (reproductible)** | Testé 2 fois : aucun message d'erreur `[data-test="error"]` n'apparaît dans le DOM (`document.querySelector('[data-test="error"]')` → `null` les deux fois), aucune exception JavaScript console associée. Résultat constant sur les 2 tentatives. |
| 3 - Ajout au panier | POC-AGENT-1 / TC3 | **INSTABLE** | Aucun clic Playwright (`.click()`) observé n'a produit de mise à jour visible immédiate du badge/bouton, sur 3 tentatives (2 produits différents + 1 tentative sur contexte frais). Cependant, un item ("Sauce Labs Backpack") a fini par apparaître dans le panier persistant (badge "1", confirmé après rechargement complet de page) sans qu'aucun clic Playwright postérieur à cette apparition n'ait pu le reproduire ou l'incrémenter à "2". L'unique action distincte susceptible d'expliquer cet ajout est un `MouseEvent` natif dispatché via JavaScript (`browser_evaluate`) lors d'un test de diagnostic antérieur, avec un délai de prise en compte non déterminé. |

## Diagnostic

**Méthode :** chaque conclusion ci-dessous s'appuie sur des vérifications bornées et documentées (pas de retry silencieux en boucle) : référence d'élément fraîche, reproduction sur un 2e produit, attente de 1,5s, test de hit-testing (`document.elementFromPoint`), dispatch d'événement natif, vérification des messages console (`browser_console_messages`, y compris niveau debug) et des requêtes réseau à chaque étape, et — suite à la revue de cette tâche — une repasse complète sur un contexte navigateur fraîchement fermé/rouvert (`browser_close` puis nouvelle navigation) pour écarter une dégradation d'état accumulée dans l'onglet.

**Scénario 2 (message d'erreur absent) — reproductible :**
- Le formulaire conserve les valeurs saisies après le clic (le clic est bien reçu par la page).
- Aucune exception JavaScript dans la console (`browser_console_messages`, niveau debug, y compris messages historiques) lors des 2 tentatives.
- Aucune requête réseau associée au clic (l'authentification saucedemo est 100% côté client, sans appel API) — donc pas un problème de blocage réseau.
- Résultat identique sur 2 tentatives distinctes, dont une sur contexte fraîchement rouvert : ce résultat est traité comme fiable.

**Scénarios 1 et 3 — instables, non concluants en l'état :**
- Le login (Scénario 1) a réussi 2 fois sur 3 avec la *même* action (`.click()` sur le bouton Login), sans changement de code ni de données entre les tentatives.
- L'ajout au panier (Scénario 3) n'a jamais montré de mise à jour *visible immédiate* suite à un clic Playwright, mais l'état persistant (localStorage/store, confirmé par rechargement de page) montre bien 1 article ajouté à un moment donné — preuve que l'ajout peut réussir côté application sans que l'automatisation l'observe de façon fiable en temps réel.
- Aucune erreur console ni réseau n'accompagne ces échecs/instabilités.
- Ressources statiques toutes chargées avec succès (bundle JS, CSS, images — codes 200 sur toute la session).

**Hypothèses (aucune confirmée) :**
1. Défaut d'application réel, intermittent, sur la mise à jour de certains états UI pilotés par clic.
2. Artefact côté outillage : la manière dont Playwright/MCP synthétise les événements de clic n'est pas systématiquement reçue par les gestionnaires d'événements de cette version de l'application (hypothèse au moins aussi plausible que la 1, saucedemo.com étant historiquement l'un des sites de démonstration QA les plus stables du secteur).

Aucune de ces deux hypothèses n'a pu être confirmée sans accès au code source de l'application ; les deux sont reportées telles quelles plutôt que de trancher sans preuve.

## Conclusion

1 résultat reproductible (Scénario 2 : FAIL constant) et 2 résultats instables (Scénarios 1 et 3 : succès et échec observés selon la tentative, sans changement de script). Aucun résultat n'a été simulé, arrondi à un verdict unique par confort, ou présenté comme plus certain qu'il ne l'est — chaque ligne du tableau reflète l'ensemble des observations réelles collectées, instabilité comprise.

## Traçabilité

Story : STORY-001 · Stratégie : docs/strategie-test-20260915.md · Cas de test : outputs/cas-test-20260915.csv
