const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());  // Middleware to parse JSON data

// Endpoint to save the tasks to a file
app.post('/save-tasks', (req, res) => {
  const tasks = req.body; // Get the tasks data from the request

  // Specify the path where you want to save the JSON file
  const filePath = path.join(__dirname, 'tasks.json');

  // Write the data to the file, overwriting it if it already exists
  fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error saving tasks:', err);
      return res.status(500).send('Error saving tasks');
    }
    res.status(200).send('Tasks saved successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
