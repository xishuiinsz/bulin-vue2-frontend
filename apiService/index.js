const express = require('express')
const cors = require('cors')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser')
// const { nanoid } = require('nanoid')
const db = low(new FileSync('db.json'))
// db.defaults().write()
const app = express()
app.use(cors())
app.use(bodyParser.json())
const PORT = 3000
app.get('/posts', (req, res) => {
  const { _limit } = req.query
  const data = db.get('posts').take(_limit).value()
  return res.json(data)
})
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`)
})
