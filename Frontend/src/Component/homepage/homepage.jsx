import styles from './homepage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { LiaTimesSolid } from "react-icons/lia";
import { LuFilePlus2 } from "react-icons/lu";
import axios from 'axios';

function Homepage() {
    const dialogRef = useRef(null);
    const [file, setFile] = useState(null); 
    const [uploadedImage, setUploadedImage] = useState(null); // State for uploaded image
    const [token, setToken] = useState(null); // Add this line
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUploadedImage = async () => {
            try {
                const response = await axios.get('http://localhost:8081/getUploadedImage', {
                    withCredentials: true,
                    responseType: 'arraybuffer',
                });
        
                const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                setUploadedImage(`data:image/jpeg;base64,${base64Image}`);
            } catch (error) {
                console.error("Error fetching uploaded image:", error.response || error.message);
            }
        };

        fetchUploadedImage();
    }, []);

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
            alert('${file.name} does not have a valid file extension.');
            return false;
        }
        return true;
    };

    const isValidSize = (file) => {
        if (!validFileSize(file)) {
            alert('${file.name} has an invalid file size. Maximum file size is 25MB.');
            return false;
        }
        return true;
    };

    const isNewFile = (file) => {
        if (fileExist(file)) {
            alert('${file.name} already exists.');
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
            await uploadFile(file); 
            setFile(null); // Clear the file state after upload
            closeDialog(); // Close the dialog after upload
        } else {
            alert("No file selected. Please select an image file to upload.");
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);

        try {
            const response = await axios.post('http://localhost:8081/uploadImage', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (response.status === 200) {
                alert(`${file.name} Upload Successful`);
                setUploadedImage(response.data.imageUrl); // Update the uploaded image state
            } else {
                alert(`${file.name} Upload Unsuccessful: ${response.data}`);
            }
        } catch (error) {
            alert(`Error Uploading File: ${error.message}`);
        }
    };


    //Handle logout
    const logout = async ()=>{
        try{
            const response = await axios.post('http://localhost:8081/logout', {}, {
                withCredentials: true // Send the request with cookies
            });

            if(response.status === 200){
                alert('logout successful');
                setToken(null);//clear the token
                navigate('/login')//redirect to the login page
            }else{
                alert('logout unsuccessfully!')
            }

        }catch(error){
            console.error("Logout error:", error);
            alert("Error logging out, please try again.");
        }
    }
  
    return (
        <div className={styles.Container}>
            <div className={styles.center_container}>
                {/* do not change this part */}
                <button className={styles.main_btn} onClick={openDialog}>Upload Identity</button>
                <dialog ref={dialogRef} className={styles.uploadIdentityDialog}>
                    <div className={styles.file_upload_container}>
                        <div className={styles.top}>
                            <h3 className={styles.title}>Upload Image</h3>
                        </div>
                        <div className={styles.middle}>
                            <label className={styles.file_drop_area} onDrop={handleFileDrop} onDragOver={handleFileDrop}>
                                <LuFilePlus2 className={styles.icon} />
                                <p className={styles.description}>Drop your image here <span className={styles.color_primary}>browse</span></p>
                                <p className={styles.text_muted}>Max. File Size 2 MB</p>
                                <input type="file" onChange={handleFileInput} accept='.jpeg, .jpg, .png' />
                            </label>
                            <div className={styles.preview_area}>
                                {file && ( // Check if a file is selected
                                    <div className={styles.preview_card}>
                                        <div className={styles.column_avater}>
                                            <img src={URL.createObjectURL(file)} alt={file.name} />
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
                            <button id={styles.btn} onClick={closeDialog}>Cancel</button>
                            <button className={styles.btn_primary} onClick={handleUpload}>Save</button>
                        </div>
                    </div>
                </dialog>
    
                {/* Display uploaded image if it exists */}
                {uploadedImage && (
                    <div className={styles.uploadedImageContainer}>
                        <h3>Your Uploaded Image:</h3>
                        <img src={uploadedImage} alt="Uploaded" className={styles.uploadedImage} />
                        <p className={styles.textMuted}>You have already uploaded your picture.</p>
                    </div>
                )}
    
                {/* Buttons for actions */}
                <div className={styles.actionButtons}>
                    <button className={styles.main_btn}><Link to="/camera">Take Picture</Link></button>
                    <button className={styles.main_btn} onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Homepage;