import styles from './homepage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

// Icons
import { LiaTimesSolid } from "react-icons/lia";
import { LuFilePlus2 } from "react-icons/lu";
import axios from 'axios';

function Homepage() {
    const dialogRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State for the fetched image URL
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Function to fetch the image URL from the server
    const fetchImageUrl = async () => {
        try {
            const response = await axios.get('http://localhost:8081/getImage', { withCredentials: true });
            if (response.status === 200 && response.data.imageUrl) {
                setImageUrl(response.data.imageUrl); // Store the URL in state
            }
        } catch (error) {
            console.error("Error fetching image URL:", error);
        }
    };

    useEffect(() => {
        // Fetch the image URL initially when the component mounts
        fetchImageUrl();
    }, []);

    const openDialog = () => {
        fetchImageUrl(); // Fetch the latest image URL each time the dialog opens
        dialogRef.current.showModal();
    };

    const closeDialog = () => {
        dialogRef.current.close();
    };

    const fileExist = (newFile) => file && file.name === newFile.name;

    const validExtensions = (file) => {
        const allowedExtensions = ['jpeg', 'jpg', 'png'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    };

    const validFileSize = (file, maxSizeMb = 25) => {
        const fileSizeInMb = Math.round(file.size / 1048576);
        return fileSizeInMb <= maxSizeMb;
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
            setFile(selectedFile);
            console.log("Valid file selected:", selectedFile);
        }
        event.target.value = null;
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && isNewFile(droppedFile) && isValidExtension(droppedFile) && isValidSize(droppedFile)) {
            setFile(droppedFile);
            console.log("File dropped:", droppedFile);
        }
    };

    const fileSize = (sizeInBytes) => {
        const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
        let index = 0, size = parseInt(sizeInBytes, 10) || 0;
        while (size >= 1024 && ++index) {
            size /= 1024;
        }
        return `${size.toFixed(size < 10 && index > 0 ? 1 : 0)} ${units[index]}`;
    };

    const handleFileDelete = () => setFile(null);

    const handleUpload = async () => {
        if (file) {
            setLoading(true);
            await uploadFile(file);
            setLoading(false);
            setFile(null);
            closeDialog();
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
                alert(`${file.name} uploaded successfully`);
                setImageUrl(response.data.imageUrl); // Update the image URL after successful upload
            } else {
                alert(`${file.name} upload unsuccessful.`);
            }
        } catch (error) {
            alert(`Error uploading file: ${error.message}`);
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:8081/logout', {}, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert('Logout successful');
                navigate('/login');
            } else {
                alert('Logout unsuccessful');
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Error logging out, please try again.");
        }
    };

    return (
        <div className={styles.Container}>
            <div className={styles.center_container}>
                {/* Conditionally render the fetched image if it exists */}
                {imageUrl && (
                    <div className={styles.preview_existing_image}>
                        <h3 className={styles.title}>Existing Uploaded Image:</h3>
                        <img src={imageUrl} alt="Uploaded" className={styles.existing_image} />
                    </div>
                )}

                <button className={styles.main_btn} onClick={openDialog}>Upload Identity</button>
                <dialog ref={dialogRef} className={styles.uploadIdentityDialog}>
                    <div className={styles.file_upload_container}>
                        <div className={styles.top}>
                            <h3 className={styles.title}>Upload Image</h3>
                        </div>
                        <div className={styles.middle}>
                            <label className={styles.file_drop_area} onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
                                <LuFilePlus2 className={styles.icon} />
                                <p className={styles.description}>Drop your image here or <span className={styles.color_primary}>browse</span></p>
                                <p className={styles.text_muted}>Max. File Size 25 MB</p>
                                <input type="file" onChange={handleFileInput} accept='.jpeg, .jpg, .png' />
                            </label>
                            <div className={styles.preview_area}>
                                {file && (
                                    <div className={styles.preview_card}>
                                        <div className={styles.column_avatar}>
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
                            <button className={styles.btn_primary} onClick={handleUpload} disabled={loading}>
                                {loading ? "Uploading..." : "Save"}
                            </button>
                        </div>
                    </div>
                </dialog>

                <button className={styles.main_btn}><Link to="/camera">Take Picture</Link></button>
                <button className={styles.main_btn} onClick={logout}>Logout</button>
            </div>
        </div>
    );
}

export default Homepage;
