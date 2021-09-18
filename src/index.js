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
  const { name, username } = request.body

  if(!name || !username) {
    return response.status(400).json({error: 'Name and Username must be provided!'})
  }

  if(userAlreadyExists(username)) {
    return response.status(400).json({error: 'User already exists'})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)
  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body

  const todoToUpdate = user.todos.find(todo => todo.id === id)

  Object.assign(todoToUpdate, {title, deadline: new Date(deadline)})

  return response.json(todoToUpdate)
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const { user } = request
  const { id } = request.params

  const todoToUpdate = user.todos.find(todo => todo.id === id)

  Object.assign(todoToUpdate, {done: true})

  return response.json(todoToUpdate)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;