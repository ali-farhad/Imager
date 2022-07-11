import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './FileUpload.scss'
import axios from 'axios'

//MUI Imports
import Typography from '@mui/material/Typography';

// const prodUri = 'http://alifarhad.buzz/';
const prodUri = 'http://localhost:5000/';   


const FileUpload = ({ files, setFiles, removeFile, setPics, pics }) => {


    const [errors, setErrors] = useState([]);
    const [infos, setInfos] = useState([]);

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
        setFiles([...files, file])

        //upload file
        const formData = new FormData();

        
        //itearate through file and upload each file
        for (let i = 0; i < file.length; i++) {
            formData.append('images', file[i]);
        }
        // formData.append(
        //     "image", file
        // )
        axios.post(prodUri + 'api/multiple', formData)
            .then((res) => {
                file.isUploading = false;
                // setFiles([...files, file])
                window.location.reload();
        
            setInfos([...infos, 'Images Uploaded Successfully!']);
        
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

        </>
    )
}

export default FileUpload