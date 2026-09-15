# QA AI Agent POC — Autonomous Test Engineering

POC personnel démontrant le workflow JIRA + MCP + IA + Playwright : un agent
IA (Claude Code) lit une story, génère la stratégie de test, les cas de test
au format Xray, un script Playwright, exécute les scénarios en direct via le
MCP Playwright, puis produit un rapport.

Projet indépendant du client LCL Contact — aucune donnée client.

## Structure

- `stories/` — story locale simulant une story JIRA (STORY-001)
- `docs/specs/` — spec de conception
- `docs/plans/` — plan d'implémentation
- `docs/strategie-test-*.md` — stratégie de test risk-based
- `outputs/` — cas de test Xray (CSV) et rapport d'exécution
- `tests/` — script Playwright généré
- `.claude/skills/autonomous-test-agent/` — skill définissant le processus

## Reproduire

1. `claude mcp add playwright --scope project -- npx @playwright/mcp@latest`
2. Ouvrir une session Claude Code dans ce dossier
3. Demander de traiter `stories/story-001.md` selon la skill `autonomous-test-agent`

## Site cible
https://www.saucedemo.com (démo publique)

## Résultat du run

Le run réel documenté dans `outputs/rapport-execution-20260915.md` n'est **pas** un run vert classique : l'exécution a mis en évidence un doute sur la fiabilité de l'environnement d'exécution (MCP Playwright/Chromium) plutôt qu'un verdict pass/fail tranché sur l'application — voir ce rapport pour le diagnostic complet et l'empreinte de l'environnement utilisé.

`tests/story-001.spec.ts` est, pour cette itération, un artefact versionné uniquement (Task 6 du plan) : il n'est pas exécuté via un test-runner (aucun `package.json`/`playwright.config.ts` fourni dans ce repo, donc `npx playwright test` ne fonctionnera pas en l'état). L'exécution réelle de cette itération est passée par les outils navigateur MCP Playwright en direct. L'intégration CI/CD est explicitement hors périmètre (voir `docs/specs/design-qa-ai-agent-poc_20260915.md`, section "Hors périmètre").
