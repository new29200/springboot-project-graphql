# On part d'une image officielle qui contient déjà :
# - Maven (outil pour build le projet Java)
# - JDK 17 (le compilateur Java)
# Donc on n'a rien à installer nous-mêmes
FROM maven:3.9.9-eclipse-temurin-17


# Définit le dossier de travail dans le conteneur
# Toutes les commandes suivantes seront exécutées dans /app
# C'est comme faire "cd /app"
WORKDIR /app


# Copie uniquement le fichier pom.xml dans le conteneur
# pom.xml contient la liste des dépendances Maven
COPY pom.xml .


# Télécharge toutes les dépendances Maven
# -q = mode silencieux
# -DskipTests = ne lance pas les tests
# dependency:go-offline = télécharge toutes les librairies
#
# Pourquoi faire ça maintenant ?
# Docker met cette étape en cache → rebuild plus rapide
RUN mvn -q -DskipTests dependency:go-offline


# Copie le code source Java dans le conteneur
# ./src sur ton PC → /app/src dans le conteneur
COPY src ./src


# Indique que l'application utilisera le port 8080
# C'est le port de Spring Boot
# (ce n'est pas obligatoire mais c'est une bonne pratique)
EXPOSE 8080


# Commande lancée automatiquement quand le conteneur démarre
# Lance ton application Spring Boot avec Maven
CMD ["mvn", "spring-boot:run"]
