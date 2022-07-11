import React, {useState, useEffect} from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import Skeleton from '@mui/material/Skeleton';


import axios from 'axios'

import Typography from '@mui/material/Typography';

//gallery imports
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';


//form imports
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';


//component imports
import FileUpload from "../components/FileUpload/FileUpload";
import '../App.scss';


const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};



function Gallery() {

  const { user, isAuthenticated, isLoading } = useAuth0();


  const [pics, setPics] = useState([]);

  useEffect(() => {
        
    const fetchPics = async () => {

        const response = await fetch("http://localhost:5000/api/getImgsFull")
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
      axios.delete(`http://localhost:5000/api/deleteImgFile/${item}`)
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

    {isLoading ? 
         <Skeleton variant="rectangular" width={'100%'} height={200} />

    :   

    (isAuthenticated && (

      <CardContent>

      <div className="App">
      <Typography variant="h5" gutterBottom component="div">
        Upload Files
      </Typography>
      <FileUpload files={files} setFiles={setFiles}
        removeFile={removeFile} pics={pics} setPics={setPics} />
    </div>
      
    </CardContent>

     ))
    }

    


    <ImageList sx={{ width: '100%', height: '100%', overflowY: 'unset' }} cols={4} gap={10}>
      {pics.map((item, index) => (
        <ImageListItem key={index}>
          <img
            src={`${item.uri}`}
            srcSet={`${item.uri}`}
            alt={item.name}
            loading="lazy"
            style={{border: '2px solid black'}}
          />
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


