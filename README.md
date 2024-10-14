##  <img src="https://github.com/Raindrop95/Kontrolix_HACCP/blob/main/Frontend/src/assets/logo/Badge.png" alt="App Logo" width="25"/> Kontrolix
![alt text](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D) 
![alt text](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white) 
![alt text](https://img.shields.io/badge/material%20design-757575?style=for-the-badge&logo=material%20design&logoColor=white) 
![alt text](https://img.shields.io/badge/-Sequelize-52B0E7?style=flat-square&logo=sequelize&labelColor=52B0E7&logoColor=FFF) 



### 1. Einstieg

Das Projekt kann einfach in einem beliebigen Pfad geöffnet werden. Man kann entweder das Frontend kompilieren und es im Backend im Ordner "Views" ablegen, oder es separat starten. 

Vor dem Kompilieren müssen die Zugangsdaten für den PostgreSQL Server hinterlegt werden. Die Daten müssen in folgenden Pfaden hinterlegt werden: 
#### Datenbank:
```
../Backend/app/models/index.js
```
Die Datenbank wird automatisch beim ersten Start initialisiert. 

#### FTP-Server:
```
../Backend/app/controllers/Functions/ftpImageHandler.js
```

Im Frontend (Root-Verzeichnis): 
```
  npm init
  npm run dev
```
oder um ein Build zu erstellen
```
  npm run build
```

Im Backend (Root-Verzeichnis): 
```
  npm init
  node server.js
```

### 2. Temperatur-/Feuchtigkeitssensoren

Es besteht die Möglichkeit, Temperatur-/Feuchtigkeitssensoren an die Anwendung anzubinden. Dazu kann die REST API verwendet werden. Eine detaillierte Dokumentation der Anbindung folgt im nächsten Update. 
