const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/note');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.post('/api/notes', (request, response, next) => {
  const body = request.body; // body section of the page

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        console.log(note);
        response.json(note);
      } else {
        response.status(404).end(); // 404 - Not found
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/note/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end(); // 204 - no content
    })
    .catch((error) => next(error));
});

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);
// this has to be the last loaded middleware.
app.use(errorHandler); // handler of requests with result to errors

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
