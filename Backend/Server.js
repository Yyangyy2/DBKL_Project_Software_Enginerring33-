    import express from 'express';
    import mysql from 'mysql';
    import cors from 'cors';
    import bcrypt from 'bcrypt';//hash password
    import multer from 'multer'//handle multiple form content
    import cookieParser from 'cookie-parser';//httpOnly cookie

    //.env
    import dotenv from 'dotenv';

    //login 
    import jwt from 'jsonwebtoken'; // import json web token

    const app = express();

    // Use cookie-parser middleware
    app.use(cookieParser());

    // Load environment variables
    dotenv.config();
    
    // Middleware
    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:3000',  // Change to the client URL if different
        credentials: true                 // Allow cookies to be sent
    }));

    // MySQL connection
    const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "dbkl_project",
    });

    //middleware to verify token
    const verifyToken = (req, res, next) => {
        const token = req.cookies.token; // Access token from cookies
    
        console.log('Token from cookies:', token); // Debug log
    
        if (!token) {
            return res.status(403).json({ message: 'No token provided.' });
        }
    
        jwt.verify(token, process.env.LOGIN_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Failed to authenticate token.' });
            }
            req.user = decoded; // Store decoded token information in req.user
            next();
        });
    };
    

    const storage = multer.memoryStorage(); // Use memory storage for simplicity
    const upload = multer({ storage: storage });

    // DB connection is established
    db.connect(err => {
        if (err) {
            console.error('Error connecting to the database:', err);
            process.exit(1);
        }
        console.log('Connected to the database');
    }); 

    // Endpoint to handle GET request
    app.get('/', (req, res) => {
        return res.json("From Backend Side!");
    });

    // Endpoint to fetch all user locations data
    app.get('/AdminLogin', (req, res) => {
        const query = "SELECT * FROM users_location";
        db.query(query, (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.json(data);
        });
    });

    //async for using try catch function

    // Login route
    app.post('/Login', async (req, res) => {
        const { email, password, ic, userType } = req.body;
        console.log("Request Received Login", req.body);

         // Validate input based on userType
    if (userType === "Admin") {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required for Admin login.' });
        }
    } else if (userType === "users") {
        if (!ic || !password) {
            return res.status(400).json({ message: 'IC and password are required for User login.' });
        }
    } else {
        return res.status(400).json({ message: 'Invalid user type.' });
    }

    try{
        let parameter
        let query
    
        if(userType === "Admin"){
            query = "SELECT * FROM admin WHERE email = ?";
            parameter = [email];

        }else{
            query = "SELECT * FROM users WHERE ic = ?";
            parameter = [ic];
        }
        
        db.query(query, parameter, async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'No user found!' });
            }

            const user = results[0];// take the first users in the database

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            // Create a JSON Web Token (JWT) that securely encodes the user's 
            //information (such as ID and email) and includes an expiration time.
            const token = jwt.sign({ id: user.id, email: user.email || user.ic, userType: userType }, process.env.LOGIN_KEY, { expiresIn: '1h' });

              // Set the JWT in an HttpOnly cookie
              res.cookie('token', token, {
                httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
                secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
                sameSite: 'strict',  // Strictly same-site to avoid CSRF
                maxAge: 3600000      // Cookie expiration set to 1 hour
            });

            // Respond with user info and token
            return res.json({ message: 'Login successful', user: { id: user.id, email: user.email || user.ic, userType: userType }, token });
        });
    }catch(error){
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
    });

    // check-account-exist endpoint
    app.post('/check-account-exist', (req, res) => {
        const { username, email, ic, userType } = req.body;

        if(userType === "Admin"){

        const emailQuery = "SELECT * FROM admin WHERE email = ?";
        db.query(emailQuery, [email], (err, emailResults) => {
            if (err) return res.status(500).json({ message: 'Error checking account existence.' });

            if (emailResults.length > 0) {
                return res.json({ message: 'An account already exists with this email.' });
            }

            const usernameQuery = "SELECT * FROM admin WHERE username = ?";
            db.query(usernameQuery, [username], (err, usernameResults) => {
                if (err) return res.status(500).json({ message: 'Error checking account existence.' });

                if (usernameResults.length > 0) {
                    // Return a 409 Conflict status for an existing IC
                    return res.status(409).json({ message: 'An account already exists with this email.' });
                }

                // If no existing account with IC, allow creation
                return res.json({ message: 'No existing account with this email or username.' });
            });
        });
        }else if(userType === "users"){
            const icQuery = "SELECT * FROM users WHERE ic = ?";

            db.query(icQuery,[ic], (err, icResults) =>{
                if (err) return res.status(500).json({ message: 'Error checking account existence.' });
                
                
                if (icResults.length > 0) {
                     // Return a 409 Conflict status for an existing IC
                    return res.status(409).json({ message: 'An account already exists with this IC.' });
                }

                // If no existing account with IC, allow creation
                return res.json({message: "No existing account with this IC."})
            
            });
        }else{
            return res.status(400).json({ message: 'Invalid user type.' });
        }
    });

    // Register endpoint
    app.post('/register', async (req, res) => {
        console.log('Received request:', req.body);  // Log the request body
        const { username, email, password, ic, userType} = req.body;

        if(userType === "Admin"){
            if (!username || !email || !password || password.length < 6) {
                return res.status(400).json({ message: 'All fields are required and password must be at least 6 characters long.' });
            }
        }else{
            if(!ic || !password || password.length < 6) {
                return res.status(400).json({ message: 'All fields are required and password must be at least 6 characters long.' });
            }
        }
        
        try {
            const saltRounds = 10; // Typically a value between 10 and 12
            // Generate salt and hash the password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            let parameter;
            let query; 

            //differentiate user and admin and save to different database 
            if(userType === "Admin"){
                query = "INSERT INTO admin (email, username, password) VALUES (?, ?, ?)";
                parameter = [email, username, hashedPassword]
            } else if(userType === "users"){
                query = "INSERT INTO users (IC, password) VALUES (?, ?)";
                parameter = [ic, hashedPassword]
            }else{
                return res.status(400).json({ message: 'Invalid user type.' });
            }
               
            db.query(query, parameter, (err, data) => {

                if (err) {
                    console.error('Error inserting data:', err.code, err.message);
                    return res.status(500).json({ message: 'Error !!', error: err.message });
                }

                if (data.affectedRows > 0) {
                    console.log('signup successful', req.body)
                    return res.json({ message: "Sign Up Successful" });
                }
                return res.json({ message: "Sign Up unsuccessfully", data: data });
                
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ message: 'Error hashing password', error: error.message });
        }
    });

    //Image Upload
    app.post('/uploadImage', upload.single('file'), verifyToken, (req, res) => {
        console.log("File Upload Request: ", req.file);
        const userId = req.user.id; // Retrieve userId from the decoded token
        

        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        // Ensure the uploaded file is an image
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: 'Invalid file type. Only JPG, PNG are allowed.' });
        }
        

        //convert based64 string to buffer
        const imageBuffer = req.file.buffer// Get the buffer directly from req.file
        const image = imageBuffer.toString('base64') 
        const imageContentType = req.file.mimetype;
        
        const query = 'UPDATE users SET images = ?, image_content_type = ? WHERE id = ?';
        db.query(query, [image, imageContentType , userId], (err, result) =>{

            if(err){
                console.error('Error updating image:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (result.affectedRows > 0) {
                return res.json({ message: 'Image updated successfully' });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }

        });
    }); 

    // Start the server
    const PORT = 8081;
    app.listen(PORT, () => {
        console.log(`connected to database on port ${PORT}`);
    });

