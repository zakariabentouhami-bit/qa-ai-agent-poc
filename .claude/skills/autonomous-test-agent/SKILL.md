---
name: autonomous-test-agent
description: Workflow autonome QA — lit une story locale, genere strategie + cas de test Xray + script Playwright, execute via MCP Playwright, produit un rapport. POC portfolio JIRA+MCP+IA+Playwright.
---

# Autonomous Test Agent (POC)

Reproduit le workflow "JIRA + MCP + IA + Playwright" pour une story donnee.

## Quand l'utiliser
Quand on demande de traiter une nouvelle story dans `stories/` de ce projet.

## Processus
1. Obtenir la story :
   - Si un fichier markdown existe deja dans `stories/`, le lire directement : extraire l'ID, le contexte, les criteres d'acceptation (Gherkin).
   - Sinon, si un document source brut existe dans `inputs/` (PDF, export Confluence, cahier de recette, page web collectee), le convertir en story normalisee dans `stories/` (memes sections : ID, contexte, criteres d'acceptation Gherkin), en citant la source (URL/fichier) et la date de collecte. Ne jamais inventer un critere d'acceptation absent de la source : si un comportement n'est pas documente, le verifier en direct sur le site cible avant de l'ecrire (meme discipline que la regle "zero donnee inventee").
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
- Qualifier chaque verdict en PASS / FAIL / BLOCKED (non concluant) — jamais un simple pass/fail binaire. Un verdict BLOCKED s'applique quand une mise a jour d'etat pilotee par un clic/interaction echoue sans qu'aucune erreur console ou reseau ne l'explique, et que l'echec n'est pas reproductible face a un controle connu-bon (known-good control). Avant d'enregistrer un FAIL contre le produit, valider que l'environnement d'execution n'en est pas la cause : verifier si des gestionnaires d'evenements non lies fonctionnellement presentent le meme symptome, verifier console/reseau, retester sur un contexte navigateur fraichement ouvert.
- Le MCP Playwright doit tourner en profil isole (`--isolated`), jamais sur le navigateur/compte personnel de la machine. Lecon tiree d'un incident reel (2026-09-16, voir addendum de `outputs/rapport-execution-20260915.md`) : sur un navigateur Chrome reel connecte a un compte, la detection native des mots de passe compromis affiche une boite de dialogue hors DOM qui vole le focus et bloque silencieusement les clics/soumissions suivants — symptome facilement confondu avec un defaut applicatif. Utiliser un mot de passe de demo public (ex: `secret_sauce`, `SuperSecretPassword!`) declenche systematiquement ce mecanisme sur un profil Chrome reel.
