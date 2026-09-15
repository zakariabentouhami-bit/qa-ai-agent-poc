# Design — POC "Autonomous Test Engineering" (JIRA + MCP + IA + Playwright)

Date : 2026-09-15
Auteur : Zakariae Bentouhami
Statut : en attente de revue

## Contexte et objectif

POC portfolio distinct du projet client LCL Contact, destiné à démontrer une chaîne
"IA agentique" complète : lecture de story → génération de cas de test → génération
et exécution de script Playwright → rapport. Objectif : différenciateur CV/LinkedIn
et support pour la candidature SG GSC Morocco (QARM pre-trade).

Ce n'est pas une intégration LCL Contact (Robot Framework reste l'outil de ce
projet). Le POC vit dans son propre repo git, indépendant.

## Architecture

```
stories/story-001.md  (story simulée : "connexion + ajout panier")
        │
        ▼
   Skill projet: autonomous-test-agent   ← Claude Code = l'agent IA
        │  1. lit la story + criteres d'acceptation
        │  2. genere strategie de test courte (docs/)
        │  3. genere cas de test format Xray (outputs/*.csv via skill jira-xray-csv)
        │  4. genere script Playwright (tests/*.spec.ts)
        │
        ▼
   MCP Playwright  → execution reelle sur saucedemo.com
        │
        ▼
   outputs/rapport-execution-YYYYMMDD.md  (pass/fail reel, analyse)
```

Claude Code est l'agent IA lui-même (pas de script d'orchestration externe ni
d'appel API séparé). Le MCP Playwright fournit l'exécution ; aucune connexion
JIRA réelle dans cette première itération (connecteur Atlassian non autorisé) —
la story est un fichier local documenté par l'utilisateur.

## Composants

| Fichier | Rôle |
|---|---|
| `stories/story-001.md` | Story : titre, contexte, critères d'acceptation (Gherkin), ID pseudo-JIRA `STORY-001` |
| `.claude/skills/autonomous-test-agent/SKILL.md` | Skill projet définissant le processus complet (lire → stratégie → cas de test → script → exécution → rapport) |
| `docs/strategie-test-YYYYMMDD.md` | Stratégie de test courte, vocabulaire ISTQB, approche risk-based |
| `outputs/cas-test-YYYYMMDD.csv` | Cas de test format Xray 33 colonnes (réutilise la skill globale `jira-xray-csv`), référence `STORY-001` |
| `tests/story-001.spec.ts` | Script Playwright généré ; credentials = ceux publiés officiellement sur saucedemo.com (traçables, non inventés) |
| `outputs/rapport-execution-YYYYMMDD.md` | Résultat pass/fail réel, diagnostic des échecs éventuels |

## Prérequis techniques

- MCP Playwright à installer avant la première exécution :
  `claude mcp add playwright npx @playwright/mcp@latest`
- Site cible : https://www.saucedemo.com (démo publique stable, standard reconnu QA)

## Gestion des erreurs

Si l'exécution Playwright échoue (site indisponible, sélecteur modifié) : l'agent
capture l'erreur, diagnostique la cause (esprit `systematic-debugging`), et
consigne le diagnostic dans le rapport. Pas de retry silencieux en boucle.

## Validation du POC

Un run end-to-end complet : chaque artefact (stratégie, cas de test CSV, script,
rapport) doit être généré, et le test Playwright doit s'exécuter réellement sur
saucedemo.com avec un résultat pass/fail effectif (pas simulé).

## Hors périmètre (cette itération)

- Connexion JIRA réelle via MCP Atlassian (bloquée : autorisation connecteur non faite)
- Génération multi-stories / suite de régression complète
- Intégration CI/CD
