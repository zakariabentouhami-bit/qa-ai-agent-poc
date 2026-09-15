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
