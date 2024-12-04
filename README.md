# **Cmail**

**Curtis Yungen**  
**CS221**  
**December 2024**

---

**Cmail** is a project developed to manage email inboxes overwhelmed by countless messages. It automates the organization of emails by clustering them into meaningful groups. Cmail uses machine learning techniques such as K-means, HDBSCAN, as well as enhancements such as TF-IDF, Autoencoders, and BERT for better clustering, and LDA for cluster naming.

### **Instructions to Run**

1. Clone the repository.
2. Navigate to project directory.
3. Navigate to `backend` folder.
    - Install required Python packages listed in `requirements.txt`.
4. Set up Gmail API Credentials:
    - Obtain a Gmail API `credentials.json` file from the Google Cloud console.
        - You'll have to create an OAuth2 credential for a web application.
        - Add `http://localhost`, `http://localhost:3000`, and `http://localhost:5000` as authorized JavaScript origins.
        - Add `http://localhost:3000` and `http://localhost:5000/oauth2` as authorized redirect URIs.
        - Download the credentials and name the file `credentials.json`.
        - Place the file in the `backend` directory.
    - Run backend using `flask run`.
5. In a separate terminal window, navigate to the `frontend` folder.
    - Install required NPM dependencies by running `npm install`.
    - Run frontend using `npm start`.
6. Open your web browser and go to `http://localhost:3000`
7. Login with your Gmail account.
    - Allow necessary access for importing emails.
