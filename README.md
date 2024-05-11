<div align="center">
  <p>
    <img src="https://res.cloudinary.com/rxg/image/upload/v1715448682/vprompt/Screenshot_from_2024-05-11_22-59-13_vxzc1l.png" width="400" height="300"/>
  </p>
  <b>AI based prompt searching tool for video footages</b>
</div>


### Prerequisites and Setup
---

Before starting with the setup process, ensure that you have the following prerequisites installed on your system:

1. **[Git](https://git-scm.com/)**
2. **[Python](https://www.python.org/)**
3. **[PIP](https://pypi.org/project/pip/)**
4. **[Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)**
5. **venv ([Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html#introduction))**
6. **[Node.js](https://nodejs.org/en)**
7. **[pnpm](https://pnpm.io/)**
8. **[Rust](https://www.rust-lang.org/) (for [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites))**

#### Installation Steps:

1. **Create Parent Folder:**
   Create a parent folder where all the project files will be stored.

2. **Clone vPrompt Repository:**
   Clone the vPrompt repository from GitHub into the parent folder using the following command:
   ```
   git clone https://github.com/reenphygeorge/vPrompt.git
   ```


3. **Setup Python Virtual Environment:**
   - Install the venv module (Python Virtual Environment) into the parent folder:
     ```
     python -m venv env
     ```
   - Activate the virtual environment:
     - For Linux/Mac:
       ```
       source env/bin/activate
       ```
     - For Windows:
       ```
       .\env\Scripts\activate
       ```

4. **Navigate to API Folder:**
   - Open your terminal or command prompt.
   - Use the `cd` command to navigate into the API folder within the cloned repository:
     ```
     cd vPrompt/api
     ```


5. **Install Python Requirements:**
   - Ensure that the virtual environment is active.
   - Install the required Python packages and dependencies listed in `requirements.txt`:
     ```
     pip install -r requirements.txt
     ```

6. **Start Docker Containers:**
   - Ensure Docker and Docker Compose are installed and running.
   - Navigate back to the parent folder.
   - Start the Docker containers using Docker Compose:
     ```
     docker compose up
     ```
   - This command will start the PostgreSQL database, Redis, and the admin panel NocoDB.

7. **Setup Database Structure:**
   - Once the Docker containers are running, open a new terminal window/tab.
   - Navigate back to the `api` directory within the cloned repository.
   - Run the following command to setup the database structure:
     ```
     prisma migrate dev --schema=prisma/schema.prisma
     ```

8. **Start API Server:**
   - Now that the Docker containers and database structure are set up, start the API server:
     ```
     uvicorn main:app --reload
     ```

9. **Navigate to UI Folder:**
   - Open a new terminal window/tab.
   - Navigate to the `ui` folder within the vPrompt directory using the following command:
     ```
     cd ../ui
     ```

10. **Install UI Dependencies:**
    - Install the required UI dependencies using `pnpm`:
      ```
      pnpm install
      ```

11. **Start UI:**
    - Once the dependencies are installed, start the UI using the following command:
      ```
      pnpm tauri dev
      ```
    - This command will launch the desktop application.

### Start Using vPrompt

With the API server and UI running, you can now start using vPrompt for your video analysis needs.
