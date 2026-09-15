# Stratégie de test — STORY-001 (POC Autonomous Test Agent)

Date : 2026-09-15
Référence story : STORY-001

## Périmètre
In scope : parcours connexion + ajout panier sur saucedemo.com (3 scénarios : connexion valide, connexion invalide, ajout panier).
Out of scope : checkout complet, gestion multi-produits, tests de performance/sécurité.

## Approche (risk-based)

| Risque | Probabilité | Impact | Priorité test |
|---|---|---|---|
| Régression parcours de connexion (bloque tout accès) | Moyenne | Élevé | Haute |
| Régression ajout panier (impact conversion) | Moyenne | Moyen | Moyenne |

## Niveau de test
Tests fonctionnels end-to-end (UI), exécutés via Playwright (MCP).

## Critères d'entrée
Story STORY-001 disponible avec critères d'acceptation ; site saucedemo.com accessible.

## Critères de sortie
Les 3 scénarios exécutés ; résultats consignés dans le rapport d'exécution ; aucune anomalie bloquante non documentée.

## Outils
Playwright (exécution via MCP), Xray (traçabilité cas de test, format CSV).
