const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  if (!isUuid(id)){
    return response.status(400).json({error: "ID invalid."});
  }

  const repIndex = repositories.findIndex(repository => repository.id === id);

  if (repIndex < 0){
    return response.status(400).json({error: "Repository does not exist."});
  }

  repositories[repIndex].title = title;
  repositories[repIndex].url = url;
  repositories[repIndex].techs = techs;

  return response.json(repositories[repIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  if (!isUuid(id)){
    return response.status(400).json({error: "ID invalid."});
  }
  const repIndex = repositories.findIndex(repository => repository.id === id)
  if (repIndex < 0){
    return response.status(400).json({error: "Repository does not exist."});
  }
  repositories.splice(repIndex);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
//  const {likes} = request.body;

  if (!isUuid(id)){
    return response.status(400).json({error: "ID invalid."});
  }
  const repIndex = repositories.findIndex(repository => repository.id === id)
  if (repIndex < 0){
    return response.status(400).json({error: "Repository does not exist."});
  }
  repositories[repIndex].likes += 1;
  return response.json(repositories[repIndex]);
});

module.exports = app;
