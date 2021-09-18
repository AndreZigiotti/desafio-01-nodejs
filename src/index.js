const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).json({error: 'User not found'})
  }

  request.user = user
  return next()
}

function checksExistsTodo(request, response, next) {
  const { user } = request
  const { id } = request.params

  const todoExists = user.todos.find(todo => todo.id === id)
  if(!todoExists) {
    return response.status(404).json({error: 'Task not found'})
  }

  return next()
}

function userAlreadyExists(username) {
  return users.find(user => user.username === username)
}

app.post('/users', (request, response) => {
  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;