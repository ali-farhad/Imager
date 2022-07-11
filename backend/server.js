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

//listen for root route on port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000')
})



// var data =fs.readFileSync('pdfs/' + pdfName);
// res.contentType("application/pdf");
// return res.send(data);

  // listTableDocs['content'].push(
    // //first table
    //     {
    //     text: "Order Details",
    //     style: 'subheader',
        

    // }, {
    //     table: table,
    //     pageBreak: 'after'
    // },
    // //2nd table
    //     {
    //     text: "Order2 Details",
    //     style: 'subheader',
    // }, {
    //     table: table1,
    //     pageBreak: 'after'
    // },

    //  //2nd table
    //  {
    //     text: "Order3 Details",
    //     style: 'subheader',
    // }, {
    //     table: table2,

    // },


    
    // )
