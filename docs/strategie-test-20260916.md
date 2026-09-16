# Stratégie de test — STORY-002 (POC Autonomous Test Agent)

Date : 2026-09-16
Référence story : STORY-002

## Périmètre
In scope : parcours de connexion sur the-internet.herokuapp.com (2 scénarios : connexion valide, connexion invalide).
Out of scope : les 50+ autres pages de démonstration du site (drag&drop, upload, alertes, etc.), non couvertes par STORY-002.

## Approche (risk-based)

| Risque | Probabilité | Impact | Priorité test |
|---|---|---|---|
| Régression parcours de connexion (bloque l'accès à la zone sécurisée) | Faible | Élevé | Haute |

## Niveau de test
Tests fonctionnels end-to-end (UI), exécutés via Playwright (MCP, profil isolé).

## Critères d'entrée
Story STORY-002 disponible avec critères d'acceptation ; site the-internet.herokuapp.com accessible ; environnement d'exécution isolé (voir Règles de la skill `autonomous-test-agent`, leçon du 2026-09-16).

## Critères de sortie
Les 2 scénarios exécutés ; résultats consignés dans le rapport d'exécution avec un verdict qualifié (PASS/FAIL/BLOCKED) ; aucune anomalie bloquante non documentée.

## Outils
Playwright (exécution via MCP, profil isolé), Xray (traçabilité cas de test, format CSV).
