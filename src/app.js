const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

/**
 * -> Entity Schemas
 * 
 * - Repositoriy
 *    id - String
 *    title - String
 *    url - String
 *    techs - array[String]
 *    likes - int
 * 
 * - Like
 *    id - String
 *    repoId - String
*/

const repositories = [];
const likes = [];


function addLikeMiddleware(req, res, next) {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(r => r.id === id);
  if (repoIndex < 0) return res.status(400).json({ error: 'Repository not found!!' });
  next();
  repositories[repoIndex].likes += 1;
  return res.json(repositories[repoIndex]);
}

// -- Apenas para testes 
app.get("/likes", (request, response) => {
  return response.json(likes);
});

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  let { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex(r => r.id === id);
  if (repoIndex < 0) return response.status(400).json({ error: 'Repository not found!!' });
  const { likes } = repositories[repoIndex];
  
  title = title ? title : repositories[repoIndex].title;
  url = url ? url : repositories[repoIndex].url;
  techs = techs ? techs : repositories[repoIndex].techs;

  const repo = { id, title, url, techs, likes }
  repositories[repoIndex] = repo;
  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(r => r.id === id);
  if (repoIndex < 0) return response.status(400).json({ error: 'Repository not found!!' });
  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", addLikeMiddleware, (request, response) => {
  const { id } = request.params;
  const like = { id: uuid(), repoId: id };
  likes.push(like);
});

module.exports = app;
