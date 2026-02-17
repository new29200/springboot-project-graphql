# Spring Boot GraphQL – Infrastructure

## Description

Ce projet constitue l’infrastructure backend d’une application GraphQL développée avec :

* Spring Boot
* Spring for GraphQL
* Hibernate (via Spring Data JPA)
* Docker
* Docker Compose
* Dev Container (VS Code)

L’objectif de cette étape est de fournir une base technique stable permettant à l’équipe de développer les fonctionnalités GraphQL.

---

## Stack technique

* Java 17
* Spring Boot 4
* GraphQL
* Hibernate / JPA
* Maven
* Docker
* Docker Compose
* VS Code Dev Container

---

## Structure du projet

```
springboot-project-graphql
│
├── src/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── .devcontainer/
    └── devcontainer.json
```

---

## Lancer le projet (Méthode recommandée – Dev Container)

### Prérequis

* Docker Desktop
* VS Code
* Extension "Dev Containers"

### Étapes

1. Ouvrir le projet dans VS Code

2. Ouvrir la palette de commande :

```
CTRL + SHIFT + P
```

3. Sélectionner :

```
Dev Containers: Reopen in Container
```

Le projet va :

* construire le conteneur Docker
* installer l’environnement Java
* démarrer automatiquement Spring Boot

---

## Accès à l’application

Une fois lancé :

```
http://localhost:8080
```

Endpoint GraphQL :

```
http://localhost:8080/graphql
```

---

## Lancer le projet avec Docker Compose (alternative)

Dans un terminal :

```
docker compose up --build
```

---

## Configuration Docker

Le projet utilise :

### Dockerfile

Contient :

* Maven
* JDK 17
* Build du projet
* Lancement automatique de Spring Boot

### docker-compose.yml

Permet :

* lancer le conteneur
* exposer le port 8080

---

## Dev Container

Le Dev Container permet :

* un environnement identique pour toute l’équipe
* éviter les problèmes de configuration Java
* lancer automatiquement l’application

Configuration :

```
.devcontainer/devcontainer.json
```

---

## Base de données

Actuellement :

* H2 Database (temporaire)

Prévu :

* SQLite (configuration ultérieure)

---

## Branches Git

Organisation :

* main : production
* dev : intégration
* feature/* : développement individuel

---

## Auteur

Infrastructure réalisée par : Johan

---

## Statut

Infrastructure prête pour le développement des fonctionnalités GraphQL
