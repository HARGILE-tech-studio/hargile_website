# Tenken : tracker ton temps Claude Code

Tenken compte automatiquement le temps passé dans Claude Code, par projet et par branche.
Tu installes les hooks **une seule fois, globalement** : ensuite tous tes repos sont trackés,
sans rien à configurer projet par projet.

Compte environ 10 minutes.

---

## 0. D'abord : WSL ou Windows natif ?

Claude Code sous WSL et Claude Code sous Windows sont **deux installations séparées**, chacune
avec son propre `~/.claude/settings.json`. Les hooks posés d'un côté ne voient pas les sessions
de l'autre.

Dans le terminal où tu lances `claude` d'habitude, tape :

```bash
uname -s
```

- Réponse `Linux` : tu es dans **WSL**, suis la **voie A**.
- Commande inconnue (PowerShell ou cmd) : tu es en **Windows natif**, suis la **voie B**.

Si tu utilises les deux, fais la procédure des deux côtés : le token est personnel, pas lié à
une machine, c'est le même des deux côtés.

**Si tu as le choix, prends WSL.** git, python et le script s'y comportent comme sur nos autres
machines, et c'est la voie qu'on utilise tous.

---

## Voie A : WSL (recommandée)

### A1. Vérifier Python

Le script exige **Python 3.11 minimum** (il importe `datetime.UTC`, qui n'existe pas avant).
C'est le piège numéro un de cette installation :

```bash
python3 -V
lsb_release -d
```

- **3.11 ou plus** (Ubuntu 24.04 et suivantes sortent en 3.12) : rien à faire, continue.
- **En dessous** (Ubuntu 22.04 sort en 3.10) : installe un interpréteur récent à côté, sans
  toucher au `python3` du système, qui sert à la distribution :

  ```bash
  sudo add-apt-repository -y ppa:deadsnakes/ppa
  sudo apt update && sudo apt install -y python3.12
  python3.12 -V
  ```

  **Note bien `python3.12`** : à l'étape A3, tu remplaceras `python3` par `python3.12` dans les
  cinq commandes de hooks.

### A2. Cloner le repo et copier le script

```bash
git clone https://github.com/HARGILE-tech-studio/tenken.git
mkdir -p ~/.claude/tenken
cp tenken/hooks/tenken_hook.py ~/.claude/tenken/
```

Le repo est privé : si le clone te demande un mot de passe, authentifie-toi d'abord
(`gh auth login`, ou une clé SSH et `git clone git@github.com:HARGILE-tech-studio/tenken.git`).

Le clone ne sert qu'à récupérer ce fichier, tu peux le garder ou le jeter ensuite.

### A3. Configurer `~/.claude/settings.json`

Ouvre `~/.claude/settings.json` (crée-le avec `{}` dedans s'il n'existe pas) et **fusionne** les
deux blocs ci-dessous. Fusionne, n'écrase pas : si tu as déjà un bloc `env` ou `hooks`, ajoute
les clés dedans plutôt que de remplacer le tout.

```json
{
  "env": {
    "TENKEN_URL": "https://tenken.hargile.com",
    "TENKEN_TOKEN": "<TON_TOKEN_PERSONNEL>",
    "TENKEN_IDLE_THRESHOLD_S": "3600"
  },
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "python3 ~/.claude/tenken/tenken_hook.py start", "timeout": 10 } ] }
    ],
    "PostToolUse": [
      { "hooks": [ { "type": "command", "command": "python3 ~/.claude/tenken/tenken_hook.py beat", "timeout": 10 } ] }
    ],
    "Stop": [
      { "hooks": [ { "type": "command", "command": "python3 ~/.claude/tenken/tenken_hook.py stop", "timeout": 10 } ] }
    ],
    "StopFailure": [
      { "hooks": [ { "type": "command", "command": "python3 ~/.claude/tenken/tenken_hook.py fail", "timeout": 10 } ] }
    ],
    "SessionEnd": [
      { "hooks": [ { "type": "command", "command": "python3 ~/.claude/tenken/tenken_hook.py end", "timeout": 10 } ] }
    ]
  }
}
```

Si tu as dû installer un Python à part à l'étape A1, remplace `python3` par `python3.12` (ou la
version installée) dans les cinq commandes.

`TENKEN_TOKEN` est **ton token API personnel**, transmis par Dorian via Infisical. C'est lui, et
lui seul, qui identifie tes heures : aucun nom d'utilisateur à configurer. Ne le colle nulle part
ailleurs, et surtout pas dans un repo.

Vérifie que ton JSON est valide avant de continuer :

```bash
python3 -m json.tool ~/.claude/settings.json > /dev/null && echo "JSON valide"
```

### A4. Vérifier le chargement

Claude Code relit `settings.json` tout seul, après un court délai, sans redémarrage. Dans le
doute, une relance complète ne coûte rien et lève l'ambiguïté.

Dans Claude Code :

```
/hooks
```

Tu dois voir tes 5 entrées (UserPromptSubmit, PostToolUse, Stop, StopFailure, SessionEnd).
Si elles n'apparaissent pas, `/doctor` signale les erreurs de `settings.json` (un JSON invalide
est la cause la plus fréquente).

### A5. Vérifier que ça remonte vraiment

D'abord un test à blanc, hors Claude Code : la commande doit se terminer **sans rien afficher**.

```bash
echo '{}' | python3 ~/.claude/tenken/tenken_hook.py start
```

Une `ImportError` sur `UTC` veut dire que ton Python est trop vieux (retour à A1), un fichier
introuvable que le chemin est faux.

Ensuite, travaille une ou deux minutes normalement dans un repo (au moins un prompt et une réponse
complète), puis :

```bash
cat ~/.tenken/tenken.log      # doit être vide ou sans erreur
cat ~/.tenken/spool.jsonl     # fichier absent ou vide = tout est parti au serveur
```

Le hook ne bloque et n'alerte **jamais** : en cas de problème il écrit dans ce log et met les
entrées en file d'attente pour les rejouer plus tard. Ce log est donc le seul juge.

Ensuite, ouvre le dashboard (voir plus bas) : tes heures doivent apparaître.

---

## Voie B : Windows natif

Avertissement honnête : personne chez nous ne fait tourner tenken en Windows natif pour l'instant,
et la doc de Claude Code ne précise pas quel shell exécute les commandes de hooks sur Windows.
La procédure ci-dessous contourne les points sensibles (chemins absolus, lanceur `py`), mais si
tu bloques plus de dix minutes, bascule sur la voie A dans WSL : c'est du terrain connu.

### B1. Vérifier Python

Le script exige **Python 3.11 minimum** (il importe `datetime.UTC`, qui n'existe pas avant).
Dans PowerShell :

```powershell
py -3 -V
```

- Pas de réponse, ou une fenêtre du Microsoft Store qui s'ouvre : installe Python depuis
  <https://www.python.org/downloads/> en cochant **« Add python.exe to PATH »**, puis rouvre le
  terminal. N'utilise pas la version du Microsoft Store.
- Version inférieure à 3.11 : installe une version récente depuis le même lien.

On utilise le lanceur `py` plutôt que `python3`, qui n'existe généralement pas sur Windows.

Vérifie aussi que git est disponible, le hook s'en sert pour identifier le projet et la branche :

```powershell
git --version
```

Sans git dans le PATH, tes heures tomberont sous le nom du dossier courant et sans branche.

### B2. Cloner le repo et copier le script

```powershell
git clone https://github.com/HARGILE-tech-studio/tenken.git
mkdir "$env:USERPROFILE\.claude\tenken" -Force
copy tenken\hooks\tenken_hook.py "$env:USERPROFILE\.claude\tenken"
```

Le repo est privé : si le clone demande un mot de passe, authentifie-toi d'abord (`gh auth login`).

### B3. Configurer `settings.json`

Le fichier est `C:\Users\<ton-nom>\.claude\settings.json`. **Fusionne** les blocs ci-dessous
(n'écrase pas ce qui existe déjà).

Deux différences importantes avec la voie A :

- **pas de `~`** dans les commandes, son expansion n'est pas garantie sur Windows : chemin absolu ;
- **les antislashs se doublent** dans du JSON (`C:\\Users\\...`).

Remplace `<ton-nom>` par ton nom d'utilisateur Windows (`echo $env:USERNAME` pour le connaître) :

```json
{
  "env": {
    "TENKEN_URL": "https://tenken.hargile.com",
    "TENKEN_TOKEN": "<TON_TOKEN_PERSONNEL>",
    "TENKEN_IDLE_THRESHOLD_S": "3600"
  },
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "py -3 C:\\Users\\<ton-nom>\\.claude\\tenken\\tenken_hook.py start", "timeout": 10 } ] }
    ],
    "PostToolUse": [
      { "hooks": [ { "type": "command", "command": "py -3 C:\\Users\\<ton-nom>\\.claude\\tenken\\tenken_hook.py beat", "timeout": 10 } ] }
    ],
    "Stop": [
      { "hooks": [ { "type": "command", "command": "py -3 C:\\Users\\<ton-nom>\\.claude\\tenken\\tenken_hook.py stop", "timeout": 10 } ] }
    ],
    "StopFailure": [
      { "hooks": [ { "type": "command", "command": "py -3 C:\\Users\\<ton-nom>\\.claude\\tenken\\tenken_hook.py fail", "timeout": 10 } ] }
    ],
    "SessionEnd": [
      { "hooks": [ { "type": "command", "command": "py -3 C:\\Users\\<ton-nom>\\.claude\\tenken\\tenken_hook.py end", "timeout": 10 } ] }
    ]
  }
}
```

`TENKEN_TOKEN` est **ton token API personnel**, transmis par Dorian via Infisical. C'est lui, et
lui seul, qui identifie tes heures. Ne le colle nulle part ailleurs, surtout pas dans un repo.

### B4. Test à blanc, avant même Claude Code

Colle ta commande telle quelle dans PowerShell, avec une entrée vide :

```powershell
echo "{}" | py -3 C:\Users\<ton-nom>\.claude\tenken\tenken_hook.py start
```

Tu dois retomber sur le prompt **sans aucun message**. Une `ImportError` sur `UTC` veut dire que
ton Python est trop vieux (retour à B1) ; un fichier introuvable veut dire que le chemin est faux.

### B5. Vérifier dans Claude Code

Relance Claude Code, puis `/hooks` : tes 5 entrées doivent apparaître. Ensuite travaille une ou
deux minutes et regarde :

```powershell
type "$env:USERPROFILE\.tenken\tenken.log"     # vide ou sans erreur
type "$env:USERPROFILE\.tenken\spool.jsonl"    # absent ou vide = tout est parti
```

---

## Le dashboard

<https://tenken.hargile.com>

**Connexion par ton compte GitHub, il n'y a pas de mot de passe à saisir.** Le site est derrière
notre SSO (oauth2-proxy + org GitHub HARGILE-tech-studio) : tu arrives sur GitHub, tu valides, et
tu es connecté. Ton compte tenken `mihai` est déjà rattaché à ton login GitHub `MeHigh22`.

Tu y vois **tes** heures uniquement : jour par jour, par projet, par branche, par catégorie, avec
la saisie manuelle pour le travail fait hors Claude Code.

---

## Bonus utile : nommer un projet de façon stable

Tenken déduit le nom du projet du dossier racine git. Si on veut que le même repo tombe sous le
même nom pour tout le monde malgré des chemins différents entre machines, on pose à la racine du
repo un fichier `.tenken-project` contenant le nom voulu :

```bash
echo "tenken" > .tenken-project
```

Il prime sur le nom du dossier. Rien à faire si le dossier est déjà nommé pareil chez tout le monde.

---

## Dépannage

| Symptôme | Cause probable | Correctif |
|---|---|---|
| Rien n'apparaît dans le dashboard | hooks non chargés | `/hooks` puis `/doctor` dans Claude Code, JSON invalide le plus souvent |
| `/hooks` les affiche mais rien ne remonte | le hook se lance et échoue | `/debug` dans Claude Code, puis lire `~/.claude/debug/<session-id>.txt` : il journalise chaque hook et son code de sortie |
| `~/.tenken/tenken.log` parle de `401` | mauvais token | revérifier `TENKEN_TOKEN`, demander un `reset-token` à Dorian |
| `spool.jsonl` grossit | serveur injoignable | normal si tu es hors ligne, les entrées sont rejouées automatiquement au prochain envoi réussi |
| `ImportError: cannot import name 'UTC'` | Python trop vieux | Python 3.11 minimum, voir étape 1 |
| Aucun log, aucun fichier dans `~/.tenken/` | le hook ne se lance pas du tout | vérifier le chemin du script et que `python3` existe dans le PATH |
| Heures sur le mauvais projet | dossier racine git inattendu | poser un `.tenken-project` (voir plus haut) |

Dans ce tableau, `~/.tenken/` se lit `C:\Users\<ton-nom>\.tenken\` si tu es en Windows natif.

Un doute, un truc qui ne colle pas : ping Dorian plutôt que de bricoler, le comptage des heures
n'a d'intérêt que s'il est juste.
