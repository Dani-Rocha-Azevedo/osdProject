# prototype OSD
Le prototype OSD, est une application web permettant la visualisation de certains flux, avec menu à l’écran en superposition.
## Prérequis
Ce dont vous avez besoin pour lancer l'application : 
### Installer nodeJS 8v ou plus
#### sous Linux
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```
```
sudo apt-get install -y nodejs
```
Vérifiez la version de node
```
node -v
```
### Installer google chrome pour les tests
## Installation
```
npm i
```
## Démarrer l'application
```
npm start
```
Allez à cette addresse: http://localhost:8080/

## Lancez les tests
#### Tests unitaire
```
npm test
```
#### Tests end-to-end
```
npm run ci
```