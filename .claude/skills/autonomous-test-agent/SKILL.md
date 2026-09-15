---
name: autonomous-test-agent
description: Workflow autonome QA — lit une story locale, genere strategie + cas de test Xray + script Playwright, execute via MCP Playwright, produit un rapport. POC portfolio JIRA+MCP+IA+Playwright.
---

# Autonomous Test Agent (POC)

Reproduit le workflow "JIRA + MCP + IA + Playwright" pour une story donnee.

## Quand l'utiliser
Quand on demande de traiter une nouvelle story dans `stories/` de ce projet.

## Processus
1. Lire `stories/<story>.md` : extraire l'ID, le contexte, les criteres d'acceptation (Gherkin).
2. Rediger `docs/strategie-test-YYYYMMDD.md` : perimetre, approche risk-based, niveaux de test, criteres d'entree/sortie. Vocabulaire ISTQB.
3. Invoquer la skill `jira-xray-csv` pour produire `outputs/cas-test-YYYYMMDD.csv` a partir des criteres d'acceptation, un cas de test par scenario Gherkin. TestSet du POC : `POC-AGENT-1` (jamais un TestSet client reel).
4. Generer `tests/<story-id>.spec.ts` (Playwright Test, TypeScript) : un test par scenario, assertions explicites, selectors observables sur le site cible.
5. Executer chaque scenario via les outils du MCP Playwright (navigation, interactions, snapshot) sur le site cible declare dans la story. Constater le resultat reel (pass/fail), ne rien simuler.
6. Rediger `outputs/rapport-execution-YYYYMMDD.md` : resultat par scenario, diagnostic si echec, traçabilite vers l'ID de story et les cas de test.
7. Committer chaque artefact au fur et a mesure (un commit par etape).

## Regles
- Zero donnee inventee : toute donnee (identifiants, textes d'erreur, URLs) doit etre documentee dans la story ou observable sur le site cible.
- Pas de retry silencieux en boucle en cas d'echec d'execution : diagnostiquer et consigner.
- Ne jamais reutiliser un identifiant de TestSet ou de projet JIRA client reel dans ce POC.
