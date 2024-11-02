# Bonfire

## Overview

Bonfire is a social media platform where users can post, react, and comment in communities based on shared interests.

## Group Members

1. Esteban Tinajero

2. Michael Duenas

3. Qianqian Ke

## Requirements

1. Python (Version 3.12 or higher) ([Download](https://www.python.org/downloads/))

2. Node (Version 18.18 or higher) ([Download](https://nodejs.org/en/download/prebuilt-installer))

3. PostgreSQL Server
   - Local ([Download](https://www.postgresql.org/download/))
   - Serverless ([Neon.tech](https://neon.tech/))

## Installation

1. Clone the repository:
   `git clone git@github.com:TinajeroOC/Bonfire.git`

2. Change directory:
   `cd Bonfire`

3. Create a database for each service.

4. Create environment file for each service.

   1. Create `.env` file and copy contents from `.env.example`.
   2. Update `DATABASE_URL` with the respective URL for that service.
   3. Database URL should follow this format: `postgresql://[username]:[password]@[host]:[port]/[database_name]`.

5. Create environment file for the Next.js app.

   1. Create `.env` file and copy contents from `.env.example`.

6. Set up virtual environment, install dependencies, and apply migrations:
   `python3 setup.py`

7. Run services, gateway, and web app:
   `python3 run.py`

> [!NOTE]
> Run `npm run codegen` in the `web` directory whenever modifications are made to the underlying service APIs. This command generates type definitions that are up-to-date with the schema that the Apollo Server (the API gateway) is running queries against.

## Development on Windows

This project is developed and tested on macOS and Linux environments. If you plan to develop on a Windows machine, it is recommended to install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and follow the tutorials listed below.

1. [Python Installation](https://learn.microsoft.com/en-us/windows/python/web-frameworks)

2. [Node.js Installation](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)

3. [VSCode w/ WSL](https://code.visualstudio.com/docs/remote/wsl)
