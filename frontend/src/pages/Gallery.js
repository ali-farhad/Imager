import React, {useState, useEffect} from 'react'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


import axios from 'axios'

import Typography from '@mui/material/Typography';

//gallery imports
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';


//form imports
import CardContent from '@mui/material/CardContent';


//component imports
import FileUpload from "../components/FileUpload/FileUpload";
import '../App.scss';



const prodUri = process.env.REACT_APP_API_ENDPOINT;

function Gallery() {



  const [pics, setPics] = useState([]);
  const [imageLoaded, setImageLoaded]=React.useState(false);

  useEffect(() => {
        
    const fetchPics = async () => {

        const response = await fetch(prodUri + "api/getImgsFull")
        const json = await response.json()

        if(response.ok) {
            //order them by name
            const sorted = json.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            }
            )
            
            return setPics(json)
        }
    }


    fetchPics()


   


}, [])

// console.log(pics)

const [files, setFiles] = useState([])
const removeFile = (filename) => {
  setFiles(files.filter(file => file.name !== filename))
}

const handleDelete = (item) => {
      //axios delete request
      axios.delete(`${prodUri}api/deleteImgFile/${item}`)
      .then(res => {
        console.log(res)
        //reload windows
        window.location.reload();
      }
      )
}


  return (
    <>
    
    <Typography variant="h4" gutterBottom component="div">
        Gallery
      </Typography>

   

     

    

      <CardContent>

      <div className="App">
      <Typography variant="h5" gutterBottom component="div">
        Upload Files
      </Typography>
      <FileUpload files={files} setFiles={setFiles}
        removeFile={removeFile} pics={pics} setPics={setPics} />
    </div>
      
    </CardContent>

   
    


    <ImageList sx={{ width: '100%', height: '100%', overflowY: 'unset' }} cols={4} gap={10}>
      {pics.map((item, index) => (
        <ImageListItem key={index}>
          <img
            src={`${item.uri}`}
            alt={item.name}
            // style={{border: '2px solid black'}}
            //set visiblity hidden if imageLoaded is false
            onLoad={() => setImageLoaded(true)} className={`${!imageLoaded}`}
          />
           {!imageLoaded && (
          <div className="smooth-preloader">
              <Skeleton count={10} /> 
          </div>
        )}
          <ImageListItemBar
            title={item.name}
            subtitle={<span>by: {item.name}</span>}
            position="below"
          />
          <Button sx={{ marginBottom: "1rem" }}  onClick={() => handleDelete(item.name)} color="error" variant="contained">Delete</Button>

        </ImageListItem>
      ))}
    </ImageList>


    
      
    </>
  )}



export default Gallery


