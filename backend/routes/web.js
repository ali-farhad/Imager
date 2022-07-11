const express = require('express')
const app = express()
const router = express.Router()
const csv = require('csv-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const CsvStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './csvs')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})


const upload = multer({storage : fileStorageEngine})
const uploadCsv = multer({storage : CsvStorageEngine})


//upload single image file
router.post('/single', upload.single('image'), (req, res) => {
    console.log(req.file)
    res.send('uploaded an image successfully!')
})

//upload mutliple image file
router.post('/multiple', upload.array('images', 500), (req, res) => {
    console.log(req.file)
    res.send('uploaded images successfully!')
})



//upload single CSV file
router.post('/singleCsv', uploadCsv.single('csv'), (req, res) => {
   
    
    console.log(req.file)
    res.send('uploaded CSV successfully!')
    //rename file to target.csv
    fs.rename('./csvs/' + req.file.filename, './csvs/target.csv', (err) => {
        if (err) throw err;
        console.log('File Renamed');
    });
   
})


//parse CSV File
router.get('/csv/', (req, res) => {
    const results = []
    //csv with utf8 encoding
    
    fs.createReadStream('./csvs/target.csv', {encoding: 'binary'})
   .pipe(csv())
   .on('data', (data) => results.push(data))
   .on('end', () => {

    res.json(results)
        
    })
    
  });





// Function to serve all static files
// inside public directory.
app.use(express.static('images')); 
app.use('../images', express.static('images'));



//get all images with fullpath

router.get('/getImgsFull', (req, res) => {

    const uri = 'http://localhost:5000/api/getImgFile/'

    fs.readdir('./images', function(err, files) {
        if (err) throw err; // Fail if the file can't be read.
        
        let obj = []
       
        files.map((file, i)  => {
        let resp = {
                uri: uri + file,
                name: file
         }
         obj.push(resp)
        })
        
       return  res.send(obj)
    }

)})


//get all images
router.get('/getImgFile/:filename', (req, res) => {

    fs.readFile('./images/' + req.params.filename , function(err, data) {
        if (err) {
            return res.status(404).json({error: 'file Not Found'})
        }
          res.writeHead(200, {'Content-Type': 'image/jpeg'});
          res.end(data); // Send the file data to the browser.
      });

  })

//delete all images
router.delete('/deleteImgFile/:filename', (req, res) => {

    fs.readFile('./images/' + req.params.filename , function(err, data) {
        if (err) {
            return res.status(404).json({error: 'file Not Found'})
        }
        filePath = './images/' + req.params.filename; 
        fs.unlinkSync(filePath);
        return res.send("file Deleted Successfully!")
      
    });

  })



//get all image names
router.get('/getImgNames', (req, res) => {

    fs.readdir('./images', function(err, files) {
        if (err) throw err; // Fail if the file can't be read.
        
        //send relative path of all files
        res.json({imgs: files})
          


      });
  })






//get test
router.get("/", (req, res) => {
    res.json({"msg": "hello beautifu!"})
})


module.exports = router
