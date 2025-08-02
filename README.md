MdAjharAlam1: give me description of this project for github and also give api work detail

Workspace: Collecting workspace information### Project Description

**Filemoon** is a file-sharing platform built with Node.js and Express.js. It allows users to upload, download, share, and manage files securely. The application includes features such as user authentication, file sharing via email, and dashboard analytics for file types and usage. The backend is powered by MongoDB for data storage, and the frontend is designed with HTML, CSS, and JavaScript.

---

### API Work Details

The backend exposes the following APIs:

#### **User APIs**
1. **Signup**  
   **Endpoint:** `POST /api/users/signup`  
   **Description:** Creates a new user account.  
   **Payload:**  
   ```json
   {
     "fullname": "John Doe",
     "email": "john@example.com",
     "mobile": "1234567890",
     "password": "password123"
   }
   ```

2. **Login**  
   **Endpoint:** `POST /api/users/login`  
   **Description:** Authenticates a user and returns a JWT token.  
   **Payload:**  
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Update Profile Picture**  
   **Endpoint:** `POST /api/users/profile-picture`  
   **Description:** Updates the user's profile picture.  
   **Payload:** Multipart form data with the file.

4. **Fetch Profile Picture**  
   **Endpoint:** `GET /api/users/profile-picture`  
   **Description:** Retrieves the user's profile picture.

---

#### **File APIs**
1. **Upload File**  
   **Endpoint:** `POST /api/file`  
   **Description:** Uploads a file to the server.  
   **Payload:** Multipart form data with the file.

2. **Fetch Files**  
   **Endpoint:** `GET /api/file`  
   **Description:** Retrieves a list of files uploaded by the user.  
   **Query Parameters:**  
   - `limit` (optional): Number of files to fetch.

3. **Delete File**  
   **Endpoint:** `DELETE /api/file/:id`  
   **Description:** Deletes a file by its ID.

4. **Download File**  
   **Endpoint:** `GET /api/file/download/:id`  
   **Description:** Downloads a file by its ID.

---

#### **Sharing APIs**
1. **Share File**  
   **Endpoint:** `POST /api/file/share`  
   **Description:** Shares a file via email.  
   **Payload:**  
   ```json
   {
     "email": "recipient@example.com",
     "fileId": "file_id"
   }
   ```

2. **Fetch Shared Files**  
   **Endpoint:** `GET /api/file/share`  
   **Description:** Retrieves a list of files shared by the user.  
   **Query Parameters:**  
   - `limit` (optional): Number of shared files to fetch.

---

#### **Dashboard APIs**
1. **Dashboard Data**  
   **Endpoint:** `GET /api/dashboard`  
   **Description:** Retrieves analytics data for file types and usage.

---

#### **Token APIs**
1. **Verify Token**  
   **Endpoint:** `POST /api/token/verify`  
   **Description:** Verifies the validity of a JWT token.  
   **Payload:**  
   ```json
   {
     "token": "jwt_token"
   }
   ```

---

This project is designed to provide a seamless file-sharing experience with robust security and analytics features.

