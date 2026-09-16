# Rapport d'exécution — STORY-001

Date : 2026-09-15
Site : https://www.saucedemo.com
Exécution : MCP Playwright (session live, navigateur réel). Chaque scénario a été rejoué plusieurs fois (suite à revue) pour distinguer un défaut reproductible d'une instabilité d'exécution — voir Diagnostic.

## Environnement d'exécution

- Serveur MCP : `@playwright/mcp` version `0.0.81`
- Navigateur : Chromium (Chrome 153.0.0.0) — `navigator.userAgent` : `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36`
- OS : Windows 11 Pro (Windows NT 10.0, x64)
- Date d'exécution : 2026-09-15

## Résultats

| Scénario | Cas de test (CSV) | Résultat | Observation |
|---|---|---|---|
| 1 - Connexion réussie | POC-AGENT-1 / TC1 | **NON CONCLUANT (environnement d'exécution suspect)** | 1ère tentative : redirection confirmée vers `/inventory.html`. 2e tentative (même session, sans rechargement complet) : aucune redirection après clic sur Login, formulaire inchangé. 3e tentative (contexte navigateur fraîchement rouvert) : redirection à nouveau confirmée. Le comportement n'est pas reproductible de façon constante. |
| 2 - Connexion invalide | POC-AGENT-1 / TC2 | **NON CONCLUANT (environnement d'exécution suspect)** | Testé 2 fois : aucun message d'erreur `[data-test="error"]` n'apparaît dans le DOM (`document.querySelector('[data-test="error"]')` → `null` les deux fois), aucune exception JavaScript console associée. Résultat constant sur les 2 tentatives — mais ce symptôme (mise à jour d'état pilotée par clic qui ne se produit pas) est de la même classe que les Scénarios 1 et 3 ; voir Hypothèses. |
| 3 - Ajout au panier | POC-AGENT-1 / TC3 | **NON CONCLUANT (environnement d'exécution suspect)** | Aucun clic Playwright (`.click()`) observé n'a produit de mise à jour visible immédiate du badge/bouton, sur 3 tentatives (2 produits différents + 1 tentative sur contexte frais). Cependant, un item ("Sauce Labs Backpack") a fini par apparaître dans le panier persistant (badge "1", confirmé après rechargement complet de page) sans qu'aucun clic Playwright postérieur à cette apparition n'ait pu le reproduire ou l'incrémenter à "2". L'unique action distincte susceptible d'expliquer cet ajout est un `MouseEvent` natif dispatché via JavaScript (`browser_evaluate`) lors d'un test de diagnostic antérieur, avec un délai de prise en compte non déterminé. |

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
- Le bouton "Open Menu" (hamburger menu) présente le même symptôme : le clic n'ouvre pas le menu. Ce gestionnaire est fonctionnellement indépendant du login et du panier — un troisième gestionnaire de clic sans lien logique avec les deux premiers, également inerte.
- Aucune erreur console ni réseau n'accompagne ces échecs/instabilités.
- Ressources statiques toutes chargées avec succès (bundle JS, CSS, images — codes 200 sur toute la session).

**Hypothèses (aucune confirmée) :**
1. Défaut d'application réel, intermittent, sur la mise à jour de certains états UI pilotés par clic.
2. Artefact côté outillage : la manière dont Playwright/MCP synthétise les événements de clic n'est pas systématiquement reçue par les gestionnaires d'événements de cette version de l'application (hypothèse au moins aussi plausible que la 1, saucedemo.com étant historiquement l'un des sites de démonstration QA les plus stables du secteur). Cette hypothèse est renforcée par le fait que **trois gestionnaires de clic fonctionnellement indépendants** (login/Scénario 1, ajout panier/Scénario 3, et le menu "Open Menu" — sans rapport logique avec le login ni le panier) présentent tous le même symptôme d'inertie : trois défauts applicatifs indépendants et simultanés sont statistiquement bien moins probables qu'une cause unique côté environnement d'exécution.

Aucune de ces deux hypothèses n'a pu être confirmée sans accès au code source de l'application ; les deux sont reportées telles quelles plutôt que de trancher sans preuve. Compte tenu de ce doute non levé sur l'environnement d'exécution lui-même, aucun des 3 scénarios n'est classé PASS ou FAIL de façon définitive — voir Résultats et Conclusion.

## Conclusion

**NON CONCLUANT** sur les 3 scénarios (environnement d'exécution suspect), et non 1 FAIL confirmé + 2 instables : le Scénario 2 produit certes un résultat constant sur ses 2 tentatives, mais son symptôme (mise à jour d'état pilotée par clic absente) appartient à la même classe que les Scénarios 1 et 3, et la constance de l'échec ne suffit pas à écarter une cause côté outillage/environnement — surtout appliquée à saucedemo.com, un site de référence QA réputé pour sa stabilité. Trois gestionnaires de clic indépendants (login, panier, menu) inertes pointent vers l'environnement d'exécution plutôt que vers trois défauts applicatifs distincts. Conformément au vocabulaire ISTQB, un environnement de test suspect appelle un verdict **Bloqué / non concluant**, pas un verdict Échec (Failed) asserté contre le produit. Aucun résultat n'a été simulé, arrondi à un verdict unique par confort, ou présenté comme plus certain qu'il ne l'est — chaque ligne du tableau reflète l'ensemble des observations réelles collectées, instabilité comprise. Prochaine étape recommandée : isoler la cause (rejouer sur une version différente de `@playwright/mcp` et/ou un navigateur différent, cf. Environnement d'exécution) avant toute nouvelle tentative de qualification pass/fail.

## Addendum — Cause confirmée (2026-09-16)

L'hypothèse 2 ci-dessus (artefact côté outillage/environnement) est **confirmée** le lendemain, lors d'une investigation similaire sur un second site (https://the-internet.herokuapp.com, projet indépendant, techniquement sans rapport avec saucedemo.com — appli serveur classique, pas de SPA React).

**Mécanisme identifié** : le MCP Playwright pilotait le navigateur Chrome réel de la machine (profil personnel, compte Google actif), pas un navigateur isolé. À la soumission d'un mot de passe figurant dans la base de fuites de données que Chrome vérifie nativement (fonctionnalité de détection des mots de passe compromis, active même sans compte synchronisé), une boîte de dialogue native **"Modifiez votre mot de passe"** s'affiche par-dessus la page et vole le focus. Cette boîte de dialogue est hors du DOM de la page — invisible pour les snapshots d'accessibilité de Playwright — ce qui explique des clics/soumissions de formulaire sans effet observable pendant qu'elle est active. Capture d'écran obtenue lors de l'investigation du 16/09 : dialogue Chrome affiché sur `the-internet.herokuapp.com/secure` juste après une connexion réussie avec `SuperSecretPassword!`.

`secret_sauce` (saucedemo.com) et `SuperSecretPassword!` (the-internet) sont tous deux des mots de passe de démonstration extrêmement publics, du type que ce mécanisme Chrome est précisément conçu pour détecter. Le symptôme observé sur saucedemo.com (Résultats ci-dessus) est de la même classe exacte (clic/soumission de formulaire sans effet, sans erreur console/réseau) que celui reproduit et expliqué sur the-internet.herokuapp.com. Cette explication n'a pas été re-vérifiée par une capture d'écran prise directement sur saucedemo.com — elle est donc rapportée comme **cause la plus probable, pas comme ré-observation directe sur ce site précis**.

**Correctif appliqué** : le serveur MCP Playwright est reconfiguré avec l'option `--isolated` (profil temporaire, jamais le navigateur/compte personnel) et le binaire "Chrome for Testing" de Playwright (build officiel pour l'automatisation, sans Gestionnaire de mots de passe ni Safe Browsing) est désormais installé et utilisé — voir `.mcp.json`. Une nouvelle exécution des 3 scénarios sur cet environnement corrigé permettrait de qualifier un verdict PASS/FAIL définitif ; non refaite dans ce rapport pour préserver la trace de l'investigation originale.

## Traçabilité

Story : STORY-001 · Stratégie : docs/strategie-test-20260915.md · Cas de test : outputs/cas-test-20260915.csv
