const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
function checksExistsUserAccount(request, response, next) {
    const {username} = request.headers

    const user= users.find(user=>user.username ===username)
    if(!user){
      return response.status(400).json({error:"User not found"})
    }
    request.user = user
    return next()
   }

app.post('/users', (request, response) => {
 
    const {name,username}=request.body

try{
    users.push({
      id:uuidv4(),
      name,
      username,
      todos:[]
    })}catch(e){
      console.log(e)
    }

    return response.status(200).send({users})
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request
  return response.json(user.todos)
 
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user}= request
  const {title,deadline} = request.body
    const todo = {
      id:uuidv4(),
      title,
      done:false,
      deadline: new Date(deadline),
      created_at:new Date()
    }
    user.todos.push(todo)
    return response.status(201).json({todo})
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user}= request
  const {title,deadline} = request.body
  const {id}= request.params
  
 const todo= user.todos.find(todo=>todo.id===id)
 todo.title=title
 todo.deadline= new Date (deadline)

if(!todo){
  return response.status(400).json({message:"Todo not found"})
}

 return response.json(todo)
}); 

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    const {user} = request
    const {id} = request.params

    const todo = user.todos.find(todo=>todo.id===id)
  console.log(todo)
    if(!todo){
      return response.status(400).json({message:"Todo not found"})
    }

    todo.done=true
    return response.json({todo})
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request
  const {id} = request.params

  const todoIndex = user.todos.findIndex(todo=>todo.id===id)

  user.todos.splice(todoIndex,1)
  if(todoIndex==-1){
    return response.status(400).json({message:"Todo not found"})
  }
  return response.status(204).send()

 
});

module.exports = app;