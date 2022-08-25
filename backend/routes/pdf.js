const express = require('express')
const app = express()
const router = express.Router()
//require font libs
const fs = require('fs');
const Pdfmake = require('pdfmake');
const path = require('path')




var fonts = {
    Roboto: {
        normal: './fonts/roboto/Roboto-Regular.ttf',
        bold: './fonts/roboto/Roboto-Medium.ttf',
        italics: './fonts/roboto/Roboto-Italic.ttf',
        bolditalics: './fonts/roboto/Roboto-MediumItalic.ttf'
    }
};



//create a get route that says hello
router.post('/generate/', (req, res, next) => {
    
    //get the data from the body of the request
    let data = req.body;
    //get the filename from the url
    let pdfName = req.body['filename'];
    let rowsData = req.body['rows'];
    //get Reference value out of rowsData
    let reference = rowsData[0]['Reference'];
    //get the rowsData out of rowsData
    let references = [];
    let descriptions = [];
    let prices = [];
    let subrubro = [];
    let rubro = [];
    let marcas = [];
    let caras = [];
    let disponible = [];

    for (let i = 0; i < rowsData.length; i++) {
        references.push(rowsData[i]['Reference']);
        descriptions.push(rowsData[i]['Description']);
        prices.push(rowsData[i]['Price A']);
        subrubro.push(rowsData[i]['Sub Rubro']);
        rubro.push(rowsData[i]['Rubro']);
        marcas.push(rowsData[i]['Marca']);
        caras.push(rowsData[i]['Características']);
        disponible.push(rowsData[i]['Disponible']);
    }
    console.log(rowsData.length, "length")
    
    //for all items in prices
    for (let i =0; i < prices.length; i++) {
        prices[i] = Number(prices[i]).toFixed(2);

    }

    
    const tables = [];
    for (let i = 0; i < rowsData.length; i++) {

            let table = {
       
             widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*', '*'],

        body: [
            [
            {
                    text: 'Reference',
                    rowSpan: 1,
                    style: 'header'
    
            },
            {
                text: 'Description',
                rowSpan: 1,
                style: 'header'
            }, 
          
             {
                text: 'Price',
                rowSpan: 1,
                style: 'header'

                
            },
            {
                text: 'Sub Rubro',
                rowSpan: 1,
                style: 'header'

                
            },
            {
                text: 'Rubro',
                rowSpan: 1,
                style: 'header'

                
            },
            {
                text: 'Marca',
                rowSpan: 1,
                style: 'header'

                
            },
            {
                text: 'Disponible',
                rowSpan: 1,
                style: 'header'

                
            },
        // {
        //     //get image from references
        //     image: './images/' + references[i] + '.jpg',
        //     fit: [300, 300],
            
        // }
    ],
           
            // now data and values
            [ references[i], descriptions[i], prices[i], subrubro[i], rubro[i],disponible[i] , marcas[i] ],
            
        ]
    }

    tables.push(table);
        
    }

    let pdfmake = new Pdfmake(fonts)

    let listTableDocs = {
        pageSize: 'LEGAL',
          header : {
            image: 'data:image/jpeg;base64,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',
            alignment: 'center',
            fit: [200, 200],
            },
          footer: {
            //show full month name in date
            text: 'Generated Time: ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
            alignment: 'left',
            style: 'subheader',
            margin: [42, 0, 0, 0]
          },
        content: [  
    ],
   
        styles: {
            header: {
                // fontSize: 14,
                bold: true,
                alignment: 'center',
            },
            subheader: {
                fontSize: 14,
                margin: [0, 15, 0, 10],
                color: '#003893',
            },
            text: {
                alignment: 'justify'
            },
            link: {
                decoration: 'underline',
                color: '#0074c1'
            }
        }


    }

  
    tables.forEach((table, index) => {
        
        listTableDocs.content.push(
            //start order index from 1
            // {text: `Order ${index + 1}`, style: 'header'},
            
            {
                //get image from references
                image: './images/' + references[index] + '.jpg',
                width: 550,
                margin: [0, 100, 0, 250],             
                
            },



            {
                
                table: table,
                //add pagebreak : "before " if the table is not the last table
                pageBreak: (index === tables.length - 1) ? '' : 'after'
            }
        )
    })
   

  

 
    



    let pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
    let writeStream = pdfDoc.pipe(fs.createWriteStream('./pdfs/' + pdfName + '.pdf'));
    pdfDoc.end();

  
    writeStream.on('finish', function () {

    //send file to browser with pdfName
    
        res.download('./pdfs/' + pdfName + '.pdf', pdfName + '.pdf');

      
   
    
});


})


//create a get route to send pdf file
router.get('/getPdf/:pdfName', (req, res) => {
    res.sendFile(path.join(__dirname, '../pdfs/' + req.params.pdfName + '.pdf'));

})

module.exports = router