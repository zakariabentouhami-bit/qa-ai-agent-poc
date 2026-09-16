# Rapport d'exécution — STORY-002

Date : 2026-09-16
Site : https://the-internet.herokuapp.com
Exécution : MCP Playwright, session live (agent pilotant le navigateur en direct — navigation, saisie, clic, lecture du DOM), profil isolé (`--isolated`, Chrome for Testing).

## Environnement d'exécution

- Serveur MCP : `@playwright/mcp` version `0.0.81`, option `--isolated`
- Navigateur : Chrome for Testing (build officiel d'automatisation Playwright, sans Gestionnaire de mots de passe ni Safe Browsing)
- OS : Windows 11 Pro (Windows NT 10.0, x64)
- Date d'exécution : 2026-09-16

## Résultats

| Scénario | Cas de test (CSV) | Résultat | Observation |
|---|---|---|---|
| 1 - Connexion réussie | POC-AGENT-1 / TC1 | **PASS** | Après saisie `tomsmith`/`SuperSecretPassword!` et clic sur Login, redirection confirmée vers `/secure`, message "You logged into a secure area!" affiché. Réussi au premier essai, aucune interruption. |
| 2 - Connexion invalide | POC-AGENT-1 / TC2 | **PASS** | Après saisie `tomsmith`/mot de passe invalide et clic sur Login, aucune redirection (reste sur `/login`), message "Your password is invalid!" affiché. Réussi au premier essai, aucune interruption. |

## Diagnostic

Aucun — les 2 scénarios ont réussi du premier coup, sans retry, sans erreur console, sans blocage. Ceci confirme que le correctif d'isolation du profil navigateur (voir addendum de `outputs/rapport-execution-20260915.md`, 2026-09-16) résout bien la cause des instabilités précédentes : avec un profil isolé, les clics et soumissions de formulaire fonctionnent de manière fiable et déterministe.

## Conclusion

**PASS (2/2)**. Premier run de ce projet exécuté sur l'environnement corrigé, sans aucun contournement (pas de `form.requestSubmit()`, pas de dispatch d'événement natif) — l'agent a piloté le navigateur normalement (clic, saisie) du début à la fin. Confirme la fiabilité du correctif au-delà du cas STORY-001 (site différent, stack technique différente).

## Traçabilité

Story : STORY-002 · Stratégie : docs/strategie-test-20260916.md · Cas de test : outputs/cas-test-20260916.csv · Script : tests/story-002.spec.ts
