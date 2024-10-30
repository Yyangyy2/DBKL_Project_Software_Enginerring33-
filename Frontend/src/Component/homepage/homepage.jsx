import styles from './homepage.module.css';
import { Link } from 'react-router-dom';

import { useRef, useState, useEffect } from 'react';

//icons
import { LiaTimesSolid } from "react-icons/lia";
import { LuFilePlus2 } from "react-icons/lu";
import { BsFileEarmark } from "react-icons/bs";
import axios from 'axios';

function Homepage() {
    const dialogRef = useRef(null);
    const [file, setFile] = useState(null); 
    const [token, setToken] = useState(null);

    const openDialog = () => {
        dialogRef.current.showModal();
    };

    const closeDialog = () => {
        dialogRef.current.close();
    };

    const fileExist = (newFileName) => {
        return file && file.name === newFileName.name; // Changed to use file
    };

    const validExtensions = (file) => {
        const allowedExtensions = ['jpeg', 'jpg', 'png'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    };

    const validFileSize = (file, maxSizeMb) => {
        const maxFileSizeInMb = maxSizeMb || 25; // file size maximum 25 MB
        const fileSize = file.size;
        const fileSizeInMb = Math.round(fileSize / 1048576);
        return fileSizeInMb <= maxFileSizeInMb;
    };

    const isValidExtension = (file) => {
        if (!validExtensions(file)) {
            alert(`${file.name} does not have a valid file extension.`);
            return false;
        }
        return true;
    };

    const isValidSize = (file) => {
        if (!validFileSize(file)) {
            alert(`${file.name} has an invalid file size. Maximum file size is 25MB.`);
            return false;
        }
        return true;
    };

    const isNewFile = (file) => {
        if (fileExist(file)) {
            alert(`${file.name} already exists.`);
            return false;
        }
        return true;
    };

    const handleFileInput = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && isNewFile(selectedFile) && isValidExtension(selectedFile) && isValidSize(selectedFile)) {
            setFile(selectedFile); // Update state to a single file
            console.log("Valid files selected:", selectedFile);
        }
        event.target.value = null; // clear an input
    };

    const handleFileDrop = (event) => {
        event.preventDefault(); // Prevent default behavior
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && isNewFile(droppedFile) && isValidExtension(droppedFile) && isValidSize(droppedFile)) {
            setFile(droppedFile); // Update state to a single file
            console.log("Files dropped:", droppedFile);
        }
        event.target.value = null; // clear an input
    };

    const isImage = (file) => {
        return file && file.type && file.type.split('/')[0] === "image"; // Safeguard against undefined
    };

    const fileSize = (sizeInBytes) => {
        const names = ['bytes', 'Kib', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let count = 0, size = parseInt(sizeInBytes, 10) || 0;
        while (size >= 1024 && ++count) {
            size /= 1024;
        }
        return size.toFixed(size < 10 && count > 0 ? 1 : 0) + ' ' + names[count];
    };

    const handleFileDelete = () => {
        setFile(null); // Reset file
    };

    const handleUpload = async () => {
        if (file) {
            // Directly call uploadFile with the file state
            await uploadFile(file); 
            setFile(null); // Clear the file state after upload sucessful
            closeDialog(); // Close the dialog after upload

        } else {
            alert("No file selected. Please select an image file to upload.");
        }
    };

    const uploadFile = async (file) =>{
        const formData = new FormData(); // Corrected the casing of FormData
        formData.append('file', file);//append file object to form data
        formData.append('filename', file.name); // Add the filename to form data

        try{
            const response = await axios.post('http://localhost:8081/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  
                },
                withCredentials: true // Ensure cookies, including the HTTP-only token, are sent
            });

            if(response.status === 200){
                window.confirm(`${file.name} Upload Successful`)
            }else{
                alert(`${file.name} Uploaded Unsucessful, due to`, response.data);
            }
            
        }catch(error){
            alert(`Error Uploading File: ${error.message}`);
        }
    }
  
    return (
        <div className={styles.Container}>
            <div className={styles.button}>
                {/* do not change this part */}
                <button onClick={openDialog}>Upload Identity</button>
                <dialog ref={dialogRef} className={styles.uploadIdentityDialog}>
                    <div className={styles.file_upload_container}>
                        <div className={styles.top}>
                            <h3 className={styles.title}>Upload Image</h3>
                        </div>
                        <div className={styles.middle}>
                            <label className={styles.file_drop_area} onDrop={handleFileDrop} onDragOver={handleFileDrop}>
                                <LuFilePlus2 className={styles.icon} />
                                <p className={styles.description}>Drop your image here <span className={styles.color_primary}>browse</span></p>
                                <p className={styles.text_muted}>Max. File Size 25 MB</p>
                                <input type="file" onChange={handleFileInput} accept='.jpeg, .jpg, .png' />
                            </label>
                            <div className={styles.preview_area}>
                                {file && ( // Updated to check if file is defined
                                    <div className={styles.preview_card}>
                                        <div className={styles.column_avater}>
                                            {isImage(file) ? <img src={URL.createObjectURL(file)} alt={file.name}/> : <BsFileEarmark />}
                                        </div>

                                        <div className={styles.column}>
                                            <p className={styles.name}>{file.name}</p>
                                            <p className={styles.text_muted_size}>{fileSize(file.size)}</p>
                                        </div>

                                        <div className={styles.column_last}>
                                            <LiaTimesSolid className={styles.cancel_icon} onClick={handleFileDelete} />
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            <button className={styles.btn} onClick={closeDialog}>Cancel</button>
                            <button className={styles.btn_primary} onClick={handleUpload}>Save</button>
                        </div>
                    </div>
                </dialog>

                {/* start from here */}
                <button><Link to="/camera">Take Picture</Link></button>
                <button><Link to="">Logout</Link></button>
            </div>
        </div>
    );
}

export default Homepage;
