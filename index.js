const express = require("express")
const app = express()

const cors = require("cors")
app.use(cors())

app.use(express.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
]

app.get("/", (request, response) => {
  response.send("<h1>Hello Ulagam</h1>")
})

app.get("/api/notes", (req, res) => {
  res.json(notes)
})

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id) // URL
  const note = notes.find((n) => {
    console.log(n.id, typeof n.id, id, typeof id, n.id === id)
    return n.id === id
  })
  if (note) {
    response.json(note)
    console.log(note)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/note/:id", (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((n) => n.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
  // Creates a new array that contains all the ids of the notes, Math.max returns the maximum value of the numbers that are passed to it
  console.log(maxId)
  return maxId + 1
}

app.post("/api/notes", (request, response) => {
  const body = request.body // body section of the page

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
