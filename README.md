# QA AI Agent POC — Autonomous Test Engineering

[![Playwright Tests](https://github.com/zakariabentouhami-bit/qa-ai-agent-poc/actions/workflows/playwright.yml/badge.svg)](https://github.com/zakariabentouhami-bit/qa-ai-agent-poc/actions/workflows/playwright.yml)

POC personnel démontrant le workflow JIRA + MCP + IA + Playwright : un agent
IA (Claude Code) lit une story (locale ou importée d'un document source),
génère la stratégie de test, les cas de test au format Xray, un script
Playwright, exécute les scénarios en direct via le MCP Playwright, produit
un rapport qualifié (PASS/FAIL/BLOCKED), et rédige un bug report si un
défaut produit est confirmé.

Projet indépendant du client LCL Contact — aucune donnée client.

## Structure

- `stories/` — stories locales (`STORY-001` sur saucedemo.com, `STORY-002` importée d'un document source public)
- `inputs/` — documents sources bruts (ex : spec collectée sur un dépôt public) avant conversion en story
- `docs/specs/` — spec de conception
- `docs/plans/` — plan d'implémentation
- `docs/strategie-test-*.md` — stratégie de test risk-based, une par story
- `outputs/` — cas de test Xray (CSV), rapports d'exécution, bug reports si anomalie confirmée
- `tests/` — scripts Playwright générés (`story-001.spec.ts`, `story-002.spec.ts`), exécutables via le test-runner ou en direct via MCP
- `.claude/skills/autonomous-test-agent/` — skill définissant le processus complet
- `.github/workflows/playwright.yml` — CI : exécute la suite à chaque push/PR

## Reproduire

1. `claude mcp add playwright --scope user -- npx @playwright/mcp@0.0.81 --isolated` (profil isolé — voir note ci-dessous)
2. `npm install`
3. `npx playwright test` (exécution via le test-runner classique)
4. Ou, pour l'exécution pilotée par l'agent : ouvrir une session Claude Code dans ce dossier et demander de traiter une story selon la skill `autonomous-test-agent`

**Important — profil navigateur isolé** : le MCP Playwright doit tourner avec `--isolated`, jamais sur le navigateur personnel de la machine (compte Google, mots de passe synchronisés). Un incident réel (documenté dans `outputs/rapport-execution-20260915.md`) a montré que la détection native des mots de passe compromis de Chrome interceptait silencieusement les clics lors des tests avec des identifiants de démo publics.

## Sites cibles
- https://www.saucedemo.com (STORY-001)
- https://the-internet.herokuapp.com (STORY-002, source : [saucelabs/the-internet](https://github.com/saucelabs/the-internet), Apache-2.0/MIT)

## Résultat des runs

- **STORY-001 (2026-09-15)** : premier run non concluant (`outputs/rapport-execution-20260915.md`) — l'exécution a révélé un défaut de l'environnement (profil Chrome personnel, pas l'application) plutôt qu'un verdict pass/fail tranché. Cause identifiée et corrigée le 2026-09-16 (voir addendum du même rapport) : après correctif, 3/3 scénarios PASS via le test-runner isolé.
- **STORY-002 (2026-09-16)** : premier run sur l'environnement corrigé — 2/2 scénarios PASS dès la première tentative, en exécution live pilotée par l'agent (`outputs/rapport-execution-20260916.md`).
- CI (GitHub Actions) : verte, exécute les 5 tests des deux stories à chaque push.
