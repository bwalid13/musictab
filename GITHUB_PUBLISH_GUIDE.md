# 📤 Guide de Publication sur GitHub

Ce guide vous aide à publier MusicTab sur GitHub proprement.

---

## ✅ Fichiers Créés

- `.gitignore` - Exclut les fichiers inutiles
- `README_GITHUB.md` - README pour GitHub (en anglais)
- `LICENSE` - Licence MIT
- Ce guide

---

## 📋 Étapes de Publication

### 1️⃣ Initialiser Git (si pas déjà fait)

```powershell
# Dans le dossier musictab
cd C:\Users\bwali\Desktop\dev\musictab

# Initialiser git
git init

# Configurer votre identité (si pas déjà fait)
git config user.name "bwalid13"
git config user.email "bwalid13@gmail.com"
```

---

### 2️⃣ Renommer README pour GitHub

```powershell
# Sauvegarder l'ancien README (doc interne LUMEN)
Move-Item README.md README_OLD_LUMEN.md

# Utiliser le nouveau README pour GitHub
Move-Item README_GITHUB.md README.md
```

---

### 3️⃣ Ajouter les Fichiers

```powershell
# Ajouter tous les fichiers (le .gitignore va filtrer)
git add .

# Vérifier ce qui sera commité
git status
```

**Fichiers qui SERONT publiés :**
- ✅ manifest.json
- ✅ background.js
- ✅ player.html
- ✅ player.js
- ✅ jsmediatags.min.js
- ✅ icon16.png, icon48.png, icon128.png
- ✅ package.ps1
- ✅ PRIVACY_POLICY.md
- ✅ CHROME_STORE_JUSTIFICATIONS.md
- ✅ PUBLICATION_CHECKLIST.md
- ✅ CHANGELOG.md
- ✅ QUICK_START.md
- ✅ README.md (version GitHub)
- ✅ LICENSE
- ✅ .gitignore

**Fichiers qui NE SERONT PAS publiés :**
- ❌ MusicTab-v1.0.zip
- ❌ modules/ (dossier)
- ❌ content.js
- ❌ build.ps1, bundle.py, minify_safe.py, verify.*
- ❌ CUSTOM_THEME_ARCHITECTURE.md
- ❌ DEBUG_CUSTOM_THEME.md
- ❌ THEMES_*.md
- ❌ YOUTUNE_ANALYSIS.md
- ❌ TEST_GUIDE.md
- ❌ README_MUSICTAB.md

---

### 4️⃣ Faire le Premier Commit

```powershell
git commit -m "Initial commit - MusicTab v1.0"
```

---

### 5️⃣ Créer le Repository sur GitHub

1. Aller sur https://github.com
2. Cliquer sur **"New"** (nouveau repository)
3. Nom du repository : **`musictab`**
4. Description : **"Local MP3 player Chrome extension with iTunes metadata integration"**
5. Choisir **Public**
6. **NE PAS** cocher "Add README" (on a déjà le nôtre)
7. **NE PAS** cocher "Add .gitignore" (on a déjà le nôtre)
8. Cliquer **"Create repository"**

---

### 6️⃣ Connecter et Pousser

GitHub vous donnera des commandes. Utilisez celles-ci :

```powershell
# Ajouter l'origine remote
git remote add origin https://github.com/bwalid13/musictab.git

# Renommer la branche en main (si nécessaire)
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

---

### 7️⃣ Vérifier sur GitHub

1. Aller sur https://github.com/bwalid13/musictab
2. Vérifier que tous les fichiers sont là
3. Vérifier que le README s'affiche correctement
4. Vérifier que PRIVACY_POLICY.md est accessible

---

### 8️⃣ URL pour Chrome Web Store

Maintenant vous pouvez utiliser cette URL pour la Privacy Policy :

```
https://github.com/bwalid13/musictab/blob/main/PRIVACY_POLICY.md
```

---

## 🔄 Modifications Futures

Quand vous modifiez des fichiers :

```powershell
# Vérifier les changements
git status

# Ajouter les fichiers modifiés
git add .

# Commiter
git commit -m "Description de vos changements"

# Pousser vers GitHub
git push
```

---

## 📦 Créer une Release

Quand vous êtes prêt à publier une version :

1. Sur GitHub, aller dans **Releases** → **Create a new release**
2. Tag version : `v1.0`
3. Release title : `MusicTab v1.0`
4. Description : Copier depuis CHANGELOG.md
5. Attacher le fichier `MusicTab-v1.0.zip`
6. Cliquer **Publish release**

---

## ✅ Checklist Finale

Avant de pousser sur GitHub :

- [ ] `.gitignore` créé
- [ ] README.md renommé (ancien → README_OLD_LUMEN.md)
- [ ] README_GITHUB.md renommé → README.md
- [ ] LICENSE créé
- [ ] PRIVACY_POLICY.md avec votre email
- [ ] Pas de fichiers sensibles ou inutiles
- [ ] Git initialisé
- [ ] Premier commit fait
- [ ] Repository créé sur GitHub
- [ ] Code poussé sur GitHub
- [ ] README s'affiche bien sur GitHub
- [ ] Privacy Policy accessible

---

## 🎉 Après Publication

1. **Vérifier l'URL de la Privacy Policy**
   ```
   https://github.com/bwalid13/musictab/blob/main/PRIVACY_POLICY.md
   ```

2. **Utiliser cette URL dans Chrome Web Store**

3. **Partager votre projet !**

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :

```powershell
# Vérifier l'état
git status

# Vérifier la remote
git remote -v

# Voir l'historique
git log --oneline
```

---

**Repository:** https://github.com/bwalid13/musictab  
**Privacy Policy:** https://github.com/bwalid13/musictab/blob/main/PRIVACY_POLICY.md

Bonne chance ! 🚀
