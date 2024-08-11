# Task Management Application with Eisenhower Matrix

## Description

This project is a web application designed for task management using the Eisenhower Matrix. The application allows users to categorize tasks into four groups, manage them, and mark them as completed or pending. It consists of a React frontend and a Go backend.

## Local Development

### Dependencies

To run the application locally, you'll need to have the following dependencies installed:

- [Go](https://golang.org/dl/) (version 1.22 or later)
- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Running the Application

```bash
git clone https://github.com/g-vit/eisen-matrix.git
cd eisen-matrix
make run
```

## Deployment on Server

### Dependencies

- [Ubuntu Server](https://ubuntu.com/server) (version 20.04 or later)
- **A valid domain name** (for setting up [Let's Encrypt](https://doc.traefik.io/traefik/https/acme/))

### Init the Server

```bash
touch .env
echo HOST=yourdomain.com > .env
make run-script name=init-server
```

### Deploying the application

```bash
make run-script name=deploy
```

### Stopping the application

```bash
make run-script name=stop
```
