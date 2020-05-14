const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase}] ${url}`;

  console.log(logLabel);

  return next();
}

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' });
  }
}

app.use(logRequests);

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title 
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, owner } = request.body;

  const repository = { id: uuid(), title, owner };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const repository = {
    id,
    title,
    owner
  };

  repositories[repositoryIndex] = repository;
  
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
