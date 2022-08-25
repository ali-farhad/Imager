import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './FileUpload.scss'
import axios from 'axios'

//MUI Imports
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';


const prodUri = process.env.REACT_APP_API_ENDPOINT;

const FileUpload = ({ files, setFiles, removeFile, setPics, pics }) => {


    const [errors, setErrors] = useState([]);
    const [infos, setInfos] = useState([]);
    const [prog, setProg] = useState(0);
    const [uploading, setUploading] = useState(false);

    const uploadHandler = (event) => {
        setErrors([]);
        setInfos([]);
        const file = event.target.files;
        if(file.length > 500) {
            setErrors([...errors, 'Max 500 files allowed']);
            return;
        }
        console.log(file)

        //if file is not image/png then error
        //iterate through file and check if file is image/png
        for (let i = 0; i < file.length; i++) {
            //if file does not start with image
            if (file[i]['type'].split('/')[0] !== 'image') {
                setErrors([...errors, file[i].name + " is not a valid image file"]);
                return;
            }
        }

     

        
        // if(!file) return;
        file.isUploading = true;
        setUploading(true);
        setFiles([...files, file])

        //upload file
        const formData = new FormData();
        let config = {
            onUploadProgress: function(progressEvent) {
                    let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                    console.log(percentCompleted);
                    setProg(percentCompleted);
            }
       };

        
        //itearate through file and upload each file
        for (let i = 0; i < file.length; i++) {
            formData.append('images', file[i]);
        }
        
        axios.post(prodUri + 'api/multiple', formData, config)
            .then((res) => {
                file.isUploading = false;
                setUploading(false);
                //fire event after 10 seconds
                setInfos([...infos, 'Images uploaded successfully']);

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
        
        
            })
            .catch((err) => {
                // inform the user
                console.error(err)
                removeFile(file.name)
            });
    }

    return (
        <>
            <div className="file-card">

                <div className="file-inputs">
                    <input name="image" type="file" onChange={uploadHandler} accept="image/*" multiple />
                    <button>
                        <i>
                            <FontAwesomeIcon icon={faPlus} />
                        </i>
                        Upload
                    </button>
                </div>

                <Typography variant="subtitle2" gutterBottom component="p">
                Supported files: JPG, PNG
                </Typography>
                <Typography variant="subtitle2" gutterBottom component="p">
                Max 500 files
                </Typography>
            </div>

            {errors.map((error, index) => (
                <Typography mt={2} sx={{color: 'red'}} variant="h5" gutterBottom component="p" key={index}>
                    Error: {error}
                </Typography>
            ))}

            {infos && infos.map((info, index) => (
                <Typography mt={2} sx={{color: 'green'}} variant="h5" gutterBottom component="p" key={index}>
                    Info: {info}
                </Typography>
            ))}


    {uploading && (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', marginBlock: "2rem",}}>
        <LinearProgress sx={{height: '10px'}} variant="determinate" value={prog} />
      </Box>
      <Box>
        <Typography sx={{minWidth: "50px"}} variant="body2" color="text.secondary">
            {prog} %
        </Typography>
      </Box>
    </Box>
    )}
        </>
    )
}


export default FileUpload