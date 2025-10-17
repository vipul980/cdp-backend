# cdp-backend

Tech Stack
1. Runtime: Node.js
2. Framework: Express.js
3. Databases: PostgreSQL and MongoDB (using docker setup)

Prerequisites
1. Node.js
2. Docker desktop

Installation
1. Clone the repo
2. cd cdp-backend
3. npm install

Running the project
1. Add the .env file in the project root directory
2. Initialise docker containers, command: `docker-compose up -d`
3. For sample data, run the script using command:  `node src/scripts/initDb.js`
4. run `npm run dev`
