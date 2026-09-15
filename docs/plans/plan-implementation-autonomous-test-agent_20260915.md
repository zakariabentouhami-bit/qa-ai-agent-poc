# Autonomous Test Agent POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Démontrer, sur une story locale, la chaîne complète JIRA→MCP→IA→Playwright : Claude Code lit une story, génère stratégie + cas de test Xray + script Playwright, exécute réellement via MCP Playwright sur saucedemo.com, et produit un rapport.

**Architecture:** Claude Code est l'agent IA (pas d'orchestrateur externe). Une skill projet (`.claude/skills/autonomous-test-agent`) documente le processus. Le MCP Playwright fournit l'exécution réelle ; la skill globale `jira-xray-csv` fournit le format Xray.

**Tech Stack:** Claude Code, MCP Playwright (`@playwright/mcp`), Playwright Test (TypeScript, artefact versionné), skill `jira-xray-csv`, Git.

**Spec:** `C:\Users\Windows\PRO\qa-ai-agent-poc\docs\specs\design-qa-ai-agent-poc_20260915.md`

## Global Constraints

- Repo indépendant de LCL Contact — aucune donnée/identifiant client réel dans ce POC.
- Zéro donnée inventée : toute donnée (identifiants, messages d'erreur, sélecteurs) doit être traçable à la story ou observable sur le site cible.
- Site cible : `https://www.saucedemo.com`
- TestSet CSV du POC : `POC-AGENT-1` (jamais un TestSet client réel comme CCQASCC-54726).
- Nommage des livrables : `NOM_YYYYMMDD.ext`, rangés dans `docs/` (process) ou `outputs/` (artefacts de test).
- Intégration CI/CD hors périmètre de cette itération (déjà noté dans la spec).
- Pas de retry silencieux en boucle en cas d'échec d'exécution — diagnostiquer et consigner.

---

### Task 1: Story JIRA locale

**Files:**
- Create: `stories/story-001.md`

**Interfaces:**
- Produces: fichier story avec ID `STORY-001` et 3 scénarios Gherkin, consommé par Task 2 (skill), Task 4 (stratégie), Task 5 (cas de test), Task 6 (script).

- [ ] **Step 1: Écrire la story**

```markdown
# STORY-001 — Connexion et ajout au panier (saucedemo.com)

**En tant qu'** utilisateur du site saucedemo.com
**Je veux** me connecter avec des identifiants valides et ajouter un produit au panier
**Afin de** valider le parcours d'achat minimal (login + panier)

## Source
Site cible : https://www.saucedemo.com
Identifiants et messages d'erreur : documentés publiquement sur la page de connexion du site (liste des usernames valides, mot de passe unique `secret_sauce`).

## Critères d'acceptation

### Scénario 1 : Connexion réussie
```
Étant donné que je suis sur la page de connexion (https://www.saucedemo.com)
Quand je saisis l'identifiant "standard_user" et le mot de passe "secret_sauce"
Et que je clique sur "Login"
Alors je suis redirigé vers la page inventory (/inventory.html)
```

### Scénario 2 : Connexion échouée (identifiants invalides)
```
Étant donné que je suis sur la page de connexion
Quand je saisis l'identifiant "standard_user" et le mot de passe "wrong_password"
Et que je clique sur "Login"
Alors le message "Epic sadface: Username and password do not match any user in this service" est affiché
```

### Scénario 3 : Ajout au panier
```
Étant donné que je suis connecté et sur la page inventory
Quand j'ajoute le produit "Sauce Labs Backpack" au panier
Alors le badge du panier affiche "1"
```
```

- [ ] **Step 2: Vérifier le contenu**

Run: `grep -c "Scénario" stories/story-001.md`
Expected: `3`

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Windows\PRO\qa-ai-agent-poc"
git add stories/story-001.md
git commit -m "Add local story STORY-001 (login + panier saucedemo)"
```

---

### Task 2: Skill projet autonomous-test-agent

**Files:**
- Create: `.claude/skills/autonomous-test-agent/SKILL.md`

**Interfaces:**
- Consumes: story format défini en Task 1 (`STORY-001`, sections Gherkin).
- Produces: processus documenté, référencé manuellement pendant l'exécution des tasks 4-7 (note : les skills projet fraîchement créées ne sont indexées par le Skill tool qu'après redémarrage de session — pendant cette itération, suivre le fichier directement plutôt que d'attendre une invocation via l'outil Skill).

- [ ] **Step 1: Écrire la skill**

```markdown
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
```

- [ ] **Step 2: Vérifier le contenu**

Run: `grep -c "^##" ".claude/skills/autonomous-test-agent/SKILL.md"`
Expected: `3` (Quand l'utiliser, Processus, Regles)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/autonomous-test-agent/SKILL.md
git commit -m "Add autonomous-test-agent project skill (workflow definition)"
```

---

### Task 3: Installer le MCP Playwright

**Files:**
- Create (générée par la commande) : `.mcp.json` (racine du projet, scope `project`)

**Interfaces:**
- Produces: outils MCP Playwright disponibles pour Task 7 (noms exacts à découvrir via `ToolSearch "playwright"` après installation, non figés ici car dépendants de la version du package).

- [ ] **Step 1: Installer**

```bash
cd "C:\Users\Windows\PRO\qa-ai-agent-poc"
claude mcp add playwright --scope project -- npx @playwright/mcp@latest
```

- [ ] **Step 2: Vérifier l'enregistrement**

Run: `claude mcp list`
Expected: une entrée `playwright` avec la commande `npx @playwright/mcp@latest`

- [ ] **Step 3: Commit la config partagée**

```bash
git add .mcp.json
git commit -m "Register Playwright MCP server (project scope)"
```

---

### Task 4: Stratégie de test

**Files:**
- Create: `docs/strategie-test-20260915.md`

**Interfaces:**
- Consumes: `STORY-001` (Task 1).
- Produces: document de référence cité dans le rapport (Task 7).

- [ ] **Step 1: Écrire la stratégie**

```markdown
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
```

- [ ] **Step 2: Vérifier**

Run: `grep -c "^##" docs/strategie-test-20260915.md`
Expected: `6`

- [ ] **Step 3: Commit**

```bash
git add docs/strategie-test-20260915.md
git commit -m "Add risk-based test strategy for STORY-001"
```

---

### Task 5: Cas de test Xray (CSV)

**Files:**
- Create: `outputs/cas-test-20260915.csv`

**Interfaces:**
- Consumes: les 3 scénarios Gherkin de `STORY-001` (Task 1).
- Produces: fichier CSV référencé dans le rapport (Task 7), TestSet `POC-AGENT-1`.

- [ ] **Step 1: Invoquer la skill `jira-xray-csv`**

Fournir à la skill : les 3 scénarios de `stories/story-001.md`, TestSet `POC-AGENT-1`, fichier de sortie `outputs/cas-test-20260915.csv`. La skill applique le format (33 colonnes, séparateur `;`, QUOTE_ALL, TestSet entre triples guillemets) — ne pas le redéfinir manuellement ici, réutiliser la skill telle quelle.

- [ ] **Step 2: Vérifier**

Run: `wc -l outputs/cas-test-20260915.csv`
Expected: au moins 4 lignes (1 en-tête + 3 cas de test)

Run: `grep -c "POC-AGENT-1" outputs/cas-test-20260915.csv`
Expected: ≥ 1

- [ ] **Step 3: Commit**

```bash
git add outputs/cas-test-20260915.csv
git commit -m "Add Xray test cases CSV for STORY-001"
```

---

### Task 6: Script Playwright (artefact)

**Files:**
- Create: `tests/story-001.spec.ts`

**Interfaces:**
- Consumes: sélecteurs et données de `STORY-001` (Task 1).
- Produces: script versionnable, non exécuté via test-runner dans cette itération (hors périmètre CI/CD — voir spec). La validation réelle se fait en Task 7 via les outils live du MCP Playwright, pas en exécutant ce fichier.

- [ ] **Step 1: Écrire le script**

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('STORY-001 - Connexion et ajout au panier', () => {
  test('Scenario 1 - Connexion reussie redirige vers inventory', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('Scenario 2 - Connexion invalide affiche un message d\'erreur', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('wrong_password');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('Scenario 3 - Ajout au panier met a jour le badge', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
```

- [ ] **Step 2: Vérifier**

Run: `grep -c "test(" tests/story-001.spec.ts`
Expected: `3`

- [ ] **Step 3: Commit**

```bash
git add tests/story-001.spec.ts
git commit -m "Add generated Playwright script for STORY-001"
```

---

### Task 7: Exécution réelle via MCP Playwright + rapport

**Files:**
- Create: `outputs/rapport-execution-20260915.md`

**Interfaces:**
- Consumes: outils MCP Playwright (Task 3), scénarios `STORY-001` (Task 1), cas de test CSV (Task 5).
- Produces: rapport final, dernier artefact du POC.

- [ ] **Step 1: Découvrir les outils MCP Playwright disponibles**

Run (dans la session Claude Code): `ToolSearch "playwright"`

- [ ] **Step 2: Exécuter le Scénario 1 en direct**

Naviguer vers `https://www.saucedemo.com`, saisir `standard_user` / `secret_sauce`, cliquer sur Login, observer l'URL résultante via les outils MCP (navigate/fill/click/snapshot). Noter PASS/FAIL réel.

- [ ] **Step 3: Exécuter le Scénario 2 en direct**

Mêmes étapes avec mot de passe invalide, observer le message d'erreur affiché. Noter PASS/FAIL réel.

- [ ] **Step 4: Exécuter le Scénario 3 en direct**

Se connecter, ajouter le produit au panier, observer le badge. Noter PASS/FAIL réel.

- [ ] **Step 5: Rédiger le rapport**

```markdown
# Rapport d'exécution — STORY-001

Date : 2026-09-15
Site : https://www.saucedemo.com
Exécution : MCP Playwright (session live), 3/3 scénarios

## Résultats

| Scénario | Cas de test (CSV) | Résultat | Observation |
|---|---|---|---|
| 1 - Connexion réussie | POC-AGENT-1 / TC1 | [PASS/FAIL réel] | [URL observée] |
| 2 - Connexion invalide | POC-AGENT-1 / TC2 | [PASS/FAIL réel] | [message observé] |
| 3 - Ajout au panier | POC-AGENT-1 / TC3 | [PASS/FAIL réel] | [valeur badge observée] |

## Diagnostic (si échec)
[Renseigner uniquement si un scénario échoue : cause probable, sélecteur ou comportement en cause]

## Traçabilité
Story : STORY-001 · Stratégie : docs/strategie-test-20260915.md · Cas de test : outputs/cas-test-20260915.csv
```

Remplacer les `[...]` par les résultats réellement observés à l'exécution — jamais de valeur simulée.

- [ ] **Step 6: Commit**

```bash
git add outputs/rapport-execution-20260915.md
git commit -m "Add live execution report for STORY-001 (MCP Playwright)"
```

---

### Task 8: README et finalisation

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: tous les artefacts précédents (liens).

- [ ] **Step 1: Écrire le README**

```markdown
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
```

- [ ] **Step 2: Vérifier l'état du dépôt**

Run: `git log --oneline`
Expected: un commit par task (8 commits minimum en comptant la spec)

- [ ] **Step 3: Commit final**

```bash
git add README.md
git commit -m "Add README documenting the POC workflow"
```

## Self-Review

**Couverture spec :** Architecture (Task 2,3,6,7), Composants — story (T1), skill (T2), stratégie (T4), CSV (T5), script (T6), rapport (T7) — tous couverts. Prérequis techniques (T3). Gestion des erreurs (documentée dans T2 et appliquée en T7). Validation du POC (T7, run réel). Hors périmètre respecté (pas de tâche JIRA réelle, pas de CI/CD).

**Placeholders :** aucun — chaque step contient le contenu réel ; seul le rapport (T7) contient des `[...]` explicitement désignés comme "à remplacer par l'observation réelle", ce qui est le point de la tâche (constater, pas halluciner).

**Cohérence des noms :** `STORY-001` / `story-001.md` / `story-001.spec.ts` cohérents ; `POC-AGENT-1` cohérent entre T2, T5, T7 ; dates `20260915` cohérentes sur tous les fichiers datés.
