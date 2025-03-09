    const express = require("express");
    const app = express();
    const mongoose = require("mongoose");
    const bcrypt = require("bcryptjs");
    const cors = require("cors");
    const jwt = require('jsonwebtoken');
    const nodemailer = require('nodemailer');
    const crypto = require('crypto');
    const path = require('path');
    const fs = require('fs');

    // Middleware
    app.use(express.json());
    app.use(cors());
    app.use(express.static('public'));

    // Generate JWT Secret
    const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
    const verificationCodes = new Map();

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'f219197@cfd.nu.edu.pk',
            pass: 'vdfs vpqn puoe czul'
        }
    });

    // MongoDB Connection
    const mongoUrl = "mongodb+srv://Sufyan:sufi@sufyan.knn67.mongodb.net/?retryWrites=true&w=majority&appName=Sufyan";

    mongoose.connect(mongoUrl)
        .then(async () => {
            console.log("Database Connected");
            
            // Check and create admin user if not exists
            const adminEmail = "sufyanbinimran@gmail.com";
            const existingAdmin = await User.findOne({ email: adminEmail });
            
            if (!existingAdmin) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash("Paki$tani@123", salt);
                
                const adminUser = new User({
                    name: "Sufyan",
                    email: adminEmail,
                    password: hashedPassword,
                    role: "admin"
                });
                
                await adminUser.save();
                console.log("Hardcoded admin user created successfully");
            } else {
                console.log("Admin user already exists");
            }
        })
        .catch((e) => {
            console.log("Database Connection Error:", e);
        });

    // Password Validation Function
    const validatePassword = (password) => {
        const minLength = 8;
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) errors.push('At least 8 characters required');
        if (!hasLowerCase) errors.push('At least 1 lowercase letter required');
        if (!hasUpperCase) errors.push('At least 1 uppercase letter required');
        if (!hasNumber) errors.push('At least 1 number required');
        if (!hasSpecialChar) errors.push('At least 1 special character required');

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    // User Schema
    const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        role: {
            type: String,
            enum: ['user', 'guardian', 'admin'],
            required: true
        },
        age: {
            type: Number,
            default: null
        },
        condition: {
            type: String,
            default: null
        },
        communicationMethod: {
            type: String,
            default: null
        },
        familyInfo: {
            type: String,
            default: null
        },
        likes: {
            type: String,
            default: null
        },
        dislikes: {
            type: String,
            default: null
        },
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpires: {
            type: Date,
            default: null
        }
    });
    const User = mongoose.model("malik", userSchema);
    // Create public directory and reset-password.html
    const publicDir = path.join(__dirname, 'public');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    const resetPasswordHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
            }
            .reset-container {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 100%;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            label {
                display: block;
                margin-bottom: 0.5rem;
                color: #333;
            }
            input {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
            }
            input.invalid {
                border-color: #dc3545;
            }
            button {
                background-color: #007bff;
                color: white;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
            }
            button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            button:hover:not(:disabled) {
                background-color: #0056b3;
            }
            .error {
                color: #dc3545;
                margin-top: 0.5rem;
                font-size: 0.875rem;
            }
            .success {
                color: #28a745;
                margin-top: 0.5rem;
            }
            .requirements {
                margin-top: 1rem;
                padding: 1rem;
                background-color: #f8f9fa;
                border-radius: 4px;
            }
            .requirement {
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }
            .requirement.valid {
                color: #28a745;
            }
            .requirement.invalid {
                color: #dc3545;
            }
            .password-toggle {
                position: relative;
            }
            .toggle-icon {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="reset-container">
            <h2>Reset Password</h2>
            <form id="resetForm">
                <div class="form-group">
                    <label for="password">New Password</label>
                    <div class="password-toggle">
                        <input type="password" id="password" required>
                        <span class="toggle-icon" onclick="togglePasswordVisibility('password')">👁️</span>
                    </div>
                    <div class="requirements">
                        <div class="requirement" data-requirement="length">• Minimum 8 characters</div>
                        <div class="requirement" data-requirement="lowercase">• At least 1 lowercase letter</div>
                        <div class="requirement" data-requirement="uppercase">• At least 1 uppercase letter</div>
                        <div class="requirement" data-requirement="number">• At least 1 number</div>
                        <div class="requirement" data-requirement="special">• At least 1 special character</div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <div class="password-toggle">
                        <input type="password" id="confirmPassword" required>
                        <span class="toggle-icon" onclick="togglePasswordVisibility('confirmPassword')">👁️</span>
                    </div>
                    <div class="error" id="confirmError"></div>
                </div>
                <button type="submit" disabled>Reset Password</button>
            </form>
            <div id="errorMessage" class="error"></div>
            <div id="successMessage" class="success"></div>
        </div>

        <script>
            function togglePasswordVisibility(inputId) {
                const input = document.getElementById(inputId);
                if (input.type === 'password') {
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }
            }

            document.addEventListener('DOMContentLoaded', function() {
                const form = document.getElementById('resetForm');
                const passwordInput = document.getElementById('password');
                const confirmInput = document.getElementById('confirmPassword');
                const errorDiv = document.getElementById('errorMessage');
                const successDiv = document.getElementById('successMessage');
                const submitButton = form.querySelector('button[type="submit"]');
                const confirmError = document.getElementById('confirmError');
                const requirements = document.querySelectorAll('.requirement');

                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');

                if (!token) {
                    errorDiv.textContent = 'Invalid reset link';
                    form.style.display = 'none';
                    return;
                }

                function validatePassword(password) {
                    const criteria = {
                        length: password.length >= 8,
                        lowercase: /[a-z]/.test(password),
                        uppercase: /[A-Z]/.test(password),
                        number: /\\d/.test(password),
                        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
                    };

                    requirements.forEach(req => {
                        const type = req.dataset.requirement;
                        if (criteria[type]) {
                            req.classList.add('valid');
                            req.classList.remove('invalid');
                        } else {
                            req.classList.add('invalid');
                            req.classList.remove('valid');
                        }
                    });

                    return Object.values(criteria).every(Boolean);
                }

                function validateForm() {
                    const password = passwordInput.value;
                    const confirmPassword = confirmInput.value;
                    const isPasswordValid = validatePassword(password);
                    const doPasswordsMatch = password === confirmPassword;

                    if (confirmPassword) {
                        if (!doPasswordsMatch) {
                            confirmError.textContent = 'Passwords do not match';
                            confirmInput.classList.add('invalid');
                        } else {
                            confirmError.textContent = '';
                            confirmInput.classList.remove('invalid');
                        }
                    }

                    submitButton.disabled = !(isPasswordValid && doPasswordsMatch);
                }

                passwordInput.addEventListener('input', validateForm);
                confirmInput.addEventListener('input', validateForm);

                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const password = passwordInput.value;

                    errorDiv.textContent = '';
                    successDiv.textContent = '';

                    try {
                        const response = await fetch('/reset-password', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token: token,
                                newPassword: password
                            })
                        });

                        const data = await response.json();

                        if (data.status === 'ok') {
                            successDiv.textContent = 'Password reset successful! Redirecting to login...';
                            form.style.display = 'none';
                            setTimeout(() => {
                                window.location.href = '/login';
                            }, 3000);
                        } else {
                            throw new Error(data.data);
                        }
                    } catch (error) {
                        errorDiv.textContent = error.message || 'Error resetting password';
                    }
                });
            });
        </script>
    </body>
    </html>
    `;

    fs.writeFileSync(path.join(publicDir, 'reset-password.html'), resetPasswordHTML);

    // Routes
    app.get("/", (req, res) => {
        res.send({ status: "started" });
    });

    // Register Route with Password Validation
    app.post('/register', async (req, res) => {
        try {
            const { name, email, password, role, age, condition, communicationMethod, familyInfo, likes, dislikes } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    status: "error",
                    data: "Please provide all required fields"
                });
            }

            // Validate password
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    status: "error",
                    data: "Invalid password format",
                    errors: passwordValidation.errors
                });
            }

            if (!['user', 'guardian', 'admin'].includes(role)) {
                return res.status(400).json({
                    status: "error",
                    data: "Invalid role specified"
                });
            }

            const oldUser = await User.findOne({ email });
            if (oldUser) {
                return res.status(400).json({
                    status: "error",
                    data: "User already exists!"
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                age,
                condition,
                communicationMethod,
                familyInfo,
                likes,
                dislikes
            });

            res.status(201).json({
                status: "ok",
                data: "User Created Successfully",
                userId: newUser._id,
                role: newUser.role
            });

        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({
                status: "error",
                data: "Error creating user"
            });
        }
    });
    // Login Route
    app.post('/login', async (req, res) => {
        try {
            const { email, password, loginAsRole } = req.body;

            if (!email || !password || !loginAsRole) {
                return res.status(400).json({
                    status: "error",
                    data: "Please provide email, password and role"
                });
            }

            if (!['user', 'guardian', 'admin'].includes(loginAsRole)) {
                return res.status(400).json({
                    status: "error",
                    data: "Invalid role specified"
                });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status: "error",
                    data: "User not found"
                });
            }

            if (user.role !== loginAsRole) {
                return res.status(403).json({
                    status: "error",
                    data: `Access denied. You are not registered as a ${loginAsRole}`
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    status: "error",
                    data: "Invalid credentials"
                });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

            res.json({
                status: "ok",
                data: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                status: "error",
                data: "Error during login"
            });
        }
    });

    // Forgot Password Route
    app.post('/forgot-password', async (req, res) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    status: "error",
                    data: "User not found"
                });
            }

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            const resetURL = `http://localhost:5001/reset-password.html?token=${token}`;

            const mailOptions = {
                from: 'f219197@cfd.nu.edu.pk',
                to: email,
                subject: 'Password Reset Request',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>Please click the link below to reset your password:</p>
                    <a href="${resetURL}">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Note: Your new password must meet the following requirements:</p>
                    <ul>
                        <li>Minimum 8 characters</li>
                        <li>At least 1 lowercase letter</li>
                        <li>At least 1 uppercase letter</li>
                        <li>At least 1 number</li>
                        <li>At least 1 special character</li>
                    </ul>
                `
            };

            await transporter.sendMail(mailOptions);

            res.json({
                status: "ok",
                data: "Password reset link sent to email"
            });

        } catch (error) {
            console.error("Forgot password error:", error);
            res.status(500).json({
                status: "error",
                data: "Error processing request"
            });
        }
    });

    // Verify Reset Token Route
    app.post('/verify-reset-token', async (req, res) => {
        try {
            const { token } = req.body;

            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await User.findOne({
                _id: decoded.id,
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    status: "error",
                    data: "Invalid or expired token"
                });
            }

            res.json({
                status: "ok",
                data: "Token verified"
            });

        } catch (error) {
            res.status(400).json({
                status: "error",
                data: "Invalid token"
            });
        }
    });

    // Reset Password Route
    app.post('/reset-password', async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            // Validate password format
            const validation = validatePassword(newPassword);
            if (!validation.isValid) {
                return res.status(400).json({
                    status: "error",
                    data: "Invalid password format",
                    errors: validation.errors
                });
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await User.findOne({
                _id: decoded.id,
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({
                    status: "error",
                    data: "Invalid or expired token"
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.json({
                status: "ok",
                data: "Password reset successful"
            });

        } catch (error) {
            console.error("Reset password error:", error);
            res.status(400).json({
                status: "error",
                data: "Error resetting password"
            });
        }
    });

    // Protected Route Example
    const authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: "error",
                data: "Access denied. No token provided."
            });
        }

        try {
            const verified = jwt.verify(token, JWT_SECRET);
            req.user = verified; 
            next();
        } catch (error) {
            res.status(400).json({
                status: "error",
                data: "Invalid token"
            });
        }
    };

    // Example protected route
    app.get('/protected', authenticateToken, async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    status: "error",
                    data: "User not found"
                });
            }

            res.json({
                status: "ok",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                data: "Error accessing protected route"
            });
        }
    });
    /////////////////////////////////
    // Generate verification code
    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    }
    
    // Send verification endpoint
    app.post('/send-verification', async (req, res) => {
        try {
        const { email } = req.body;
    
        if (!email) {
            return res.status(400).json({
            status: 'error',
            data: 'Email is required'
            });
        }
    
        // Generate a verification code
        const verificationCode = generateVerificationCode();
        
        // Store the code (with expiry time of 10 minutes)
        verificationCodes.set(email, {
            code: verificationCode,
            expiry: Date.now() + 600000 // 10 minutes
        });
        // Send email
        const mailOptions = {
            from: 'f219197@cfd.nu.edu.pk',
            to: email,
            subject: 'Email Verification Code',
            text: `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`
        };
    
        await transporter.sendMail(mailOptions);
    
        res.json({
            status: 'ok',
            data: 'Verification code sent successfully'
        });
    
        } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({
            status: 'error',
            data: 'Failed to send verification code'
        });
        }
    });
    
    // Verify email endpoint
    app.post('/verify-email', (req, res) => {
        const { email, code } = req.body;
    
        if (!email || !code) {
        return res.status(400).json({
            status: 'error',
            data: 'Email and verification code are required'
        });
        }
    
        const storedData = verificationCodes.get(email);
    
        if (!storedData) {
        return res.status(400).json({
            status: 'error',
            data: 'No verification code found for this email'
        });
        }
    
        if (Date.now() > storedData.expiry) {
        verificationCodes.delete(email);
        return res.status(400).json({
            status: 'error',
            data: 'Verification code has expired'
        });
        }
    
        if (storedData.code !== code) {
        return res.status(400).json({
            status: 'error',
            data: 'Invalid verification code'
        });
        }
    
        // Clear the verification code after successful verification
        verificationCodes.delete(email);
    
        res.json({
        status: 'ok',
        data: 'Email verified successfully'
        });
    });
    
    // Get all users
    app.get('/users', authenticateToken, async (req, res) => {
        try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
            status: 'error',
            data: 'Access denied'
            });
        }
        
        const users = await User.find({}, '-password');
        res.json({
            status: 'ok',
            users
        });
        } catch (error) {
        res.status(500).json({
            status: 'error',
            data: 'Error fetching users'
        });
        }
    });
    
    // Delete user
    app.delete('/users/:id', authenticateToken, async (req, res) => {
        try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
            status: 'error',
            data: 'Access denied'
            });
        }
        
        await User.findByIdAndDelete(req.params.id);
        res.json({
            status: 'ok',
            data: 'User deleted successfully'
        });
        } catch (error) {
        res.status(500).json({
            status: 'error',
            data: 'Error deleting user'
        });
        }
    });
    //////////////////////////////////////////
    const contactSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true 
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    });

    const Contact = mongoose.model("Contact", contactSchema);
    // Create a contact
    app.post('/contacts', authenticateToken, async (req, res) => {
        console.log('Received contact creation request:');
        console.log('Request body:', req.body);
        console.log('User ID:', req.user.id);

        const { name, phoneNumber } = req.body;
        const userId = req.user.id;

        console.log('Parsed data:', { name, phoneNumber, userId });

        if (!name || !phoneNumber) {
            console.log('Validation failed: Missing name or phone number');
            return res.status(400).json({ status: 'error', data: 'Name and phone number are required' });
        }

        try {
            const existingContact = await Contact.findOne({ userId: userId, phoneNumber: phoneNumber });
            if (existingContact) {
                return res.status(409).json({ status: 'error', data: 'This phone number already exists.' });
            }

            const newContact = new Contact({
                name,
                phoneNumber,
                userId
            });

            await newContact.save();
            res.status(201).json({ status: 'ok', data: newContact });

        } catch (error) {
            console.error('Error while creating contact:', error);
            if (error.code === 11000) { // MongoDB duplicate key error
                res.status(409).json({ status: 'error', data: 'This phone number already exists.' });
            } else {
                res.status(500).json({ status: 'error', data: 'Error creating contact' });
            }
        }
    });

    app.get('/contacts', authenticateToken, async (req, res) => {
        try {
            const userId = req.user.id; 
            const contacts = await Contact.find({ userId }).sort({ name: 1 }); 
            res.json({
                status: 'ok',
                data: contacts
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                data: 'Error fetching contacts'
            });
        }
    });


    // Delete a contact
    app.delete('/contacts/:id', authenticateToken, async (req, res) => {
        console.log('Delete contact request:');
        console.log('Contact ID:', req.params.id);
        console.log('User ID:', req.user.id);

        try {
            const contactId = req.params.id;
            const userId = req.user.id;

            const contact = await Contact.findOneAndDelete({ _id: contactId, userId: userId });
            
            console.log('Delete result:', contact);

            if (!contact) {
                return res.status(404).json({ status: 'error', data: 'Contact not found or user mismatch' });
            }
            res.json({ status: 'ok', data: 'Contact deleted successfully' });
        } catch (error) {
            console.error('Delete contact error:', error);
            res.status(500).json({ status: 'error', data: 'Error deleting contact' });
        }
    });

    app.get('/user-info', authenticateToken, async (req, res) => {
        try {
            console.log('User ID from token:', req.user.id); // Log user ID
            const user = await User.findById(req.user.id, '-password -email');
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    data: 'User not found'
                });
            }
    
            res.json({
                status: 'ok',
                data: user
            });
        } catch (error) {
            console.error("Error fetching user information:", error);
            res.status(500).json({
                status: 'error',
                data: 'Error fetching user information'
            });
        }
    });
    // Backend changes (server.js)
app.put('/update-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        // Remove any sensitive fields that shouldn't be updated
        delete updateData._id;
        delete updateData.password;
        delete updateData.email;

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { 
                new: true, // Return the updated document
                select: '-password -email', // Exclude sensitive fields
                runValidators: true // Run validation on update
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.json({
            status: 'ok',
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error updating profile'
        });
    }
});
    
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });