const path = require("path")
const express = require('express')

const app = express()
app.use(express.json())
app.use("/",express.static(path.join(__dirname,"../client")));

const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 4600;
app.listen(PORT,()=>{
    console.log(`Listening from port ${PORT} !!!`)
})

module.exports = app;
