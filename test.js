const express = require('express')
const app = express()
const port = 8880;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/webhook/api', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log('Example app listening on port 3000!'))