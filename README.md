*This project has been created as part of the 42 curriculum by zsailine, mitandri, grasoani, and aranaivo.*

# 🏓 FT_TRANSCENDANCE: BEYOND THE PONG


## 📝 Description

**Ft_transcendance** is part of the final Milestone of the Common Core at 42. The goal is to create a Web Application where every students can showcase their creativity by choosing the content of the Project.

**BEYOND THE PONG** is our project. **BEYOND THE PONG** is a multiplayer game inspired by the famous **Pong Game**.

### Key Features
* **Remote game:** Play with another user in tow different PCs
* **Multiplayer game:** Play with more than two players
* **DM:** Direct messages functionnality where ypu can talk with friends
* **VS AI Game:** Play with a Challenging BOT
* **Local Tournament:** Compete in a tournament locally
* **Leaderboard:** Have an insights of your match history and the achievements you've unlocked
* **Friend System**: Add or remove, block or unblock and search for new friend

---

## 🚀 Instructions

### Prerequisites
* `Docker` & `Docker Compose`
* **Browser:** `Google Chrome (latest stable version)` or `Firefox (latest stable version)` or `Brave (latest stable version)`

### Installation & Run
1.  Clone the repository :
    ```bash
    git clone [link-to-repository] ft_transcendance
    cd ft_transcendance
    ```
2.  Launch the project :
    ```bash
    make
    ```
3.  Access to the project at `https://localhost:9443`


---

## 👥 Team Information

| Member | Role | Responsabilites |
| :--- | :--- | :--- |
| **zsailine** | **Product Owner + Developer** | Has created the idea of BEYOND THE PONG and has validated every functionnality of the game |
| **mitandri** | **Product Manager + Developer** | Has assigned tasks to other members and has checked if all functionnalities are working |
| **aranaivo** | **Tech Lead + Developer** | Has established the project infrastructure on the backend and frontend  |
| **grasoani** | **Architect + Developer** | Has established the project infrastructure in containerization |

---

## 🛠 Project Management
* **Methodology:** Meeting at least once a week to talk about what we have done already at 42 Antananarivo.
* **Task Distribution:** Task distribution via a Trello board.
* **Tools:**
    * **Management:** [GitHub / Trello]
    * **Communication:** [Verbally / Slack]
    * **Version Control:** Git (Feature Branch Workflow).

---

## 💻 Technical Stack

### Architecture
* **Frontend:** `React`, `Typescript`, `Tailwind CSS`
* **Building Tool:** `Vite`
* **Backend:** `Node JS`, `Fastify`
* **Database:** `SQLite` - *Selected for its reliability and ease of use*
* **Real-time:** `Socket.io`
* **DevOps:** `Docker`, `Nginx` (Reverse Proxy), `Vault` (Secrets Management).

### Justification des choix
> *`Vite` was chosen because it is incredibly fast at launching the project and viewing changes in real time, which makes development much smoother than with older tools.*

---

## 🗄 Database Schema

![Database Schema](./image/database_schema.png)

---

## 🕹 Features List

| Feature | Team Member(s) | Description |
| :--- | :--- | :--- |
| **Core Game** | [Nom] | Moteur de jeu côté serveur pour éviter la triche. |
| **OAuth2 / 2FA** | [Nom] | Connexion via 42 Intranet et double authentification TOTP. |
| **Live Chat** | [Nom] | Salons de discussion avec modération (mute/ban/admin). |
| **Friend System** | [Nom] | Ajout, blocage et visualisation du statut "en ligne". |

---

## 🧩 Modules (Points Calculation)

**Total Points: [Calculer le total ici]**

| Module | Type | Points | Justification & Implementation | Dev(s) |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Framework** | Major | 2 | Utilisation de [Framework] pour l'API et la logique. | [Nom] |
| **Standard User Mgmt** | Major | 2 | Inscription, profil, avatars, 2FA. | [Nom] |
| **Remote Players** | Major | 2 | Possibilité de jouer sur deux navigateurs différents. | [Nom] |
| **[Module Choice]** | Minor | 1 | [Justification du choix du module]. | [Nom] |

---

## 👨‍💻 Individual Contributions

### [Nom du Membre 1]
* **Contributions:** Architecture Docker, sécurité des headers Nginx.
* **Challenges:** Configuration du certificat SSL auto-signé pour le HTTPS.
* **Overcoming:** Recherche approfondie sur les certificats X.509 et configuration de `openssl`.

### [Nom du Membre 2]
* **Contributions:** Développement du système de tournoi automatisé.
* **Challenges:** Gestion des déconnexions imprévues en plein milieu d'un tournoi.
* **Overcoming:** Implémentation d'un système de "reconnect" et de timeout automatique.

## 📚 Resources
* [Documentation Django Channels](https://channels.readthedocs.io/)
* [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/)
* [Articles sur les WebSockets et la Latence](https://gafferongames.com/)

### AI Usage Spec
Nous avons utilisé l'intelligence artificielle (ChatGPT/Gemini) pour les tâches suivantes :
* **Refactoring :** Optimisation de la boucle de rendu du jeu.
* **Debugging :** Identification de fuites de mémoire dans les WebSockets.
* **Boilerplate :** Génération de la structure initiale des fichiers de configuration Docker.

---
