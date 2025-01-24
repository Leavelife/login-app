const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('halo cuuy')
})

app.listen(3001, () => {
    console.log(`server berjalan....`)
})