const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

//enable cors
app.use(cors())



//router
const webRoutes = require("./routes/web")
const pdfRoutes = require("./routes/pdf")

//middleware
app.use(express.json())

//config path for static files

//web routes
app.use('/api/', webRoutes)
app.use('/pdf/', pdfRoutes)


//to deploy via backend
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );


//listen for root route on port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000')
})
