# TESEMO Content Generator

## React + TypeScript + Vite + Django Backend

This project is a full-stack application that combines a React frontend with a TypeScript setup and a Django backend. It allows users to create and manage articles and authors, utilizing OpenAI's API for generating content.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Create, read, update, and delete (CRUD) operations for articles and authors
- Integration with OpenAI for article generation
- Responsive design using Tailwind CSS

## Technologies

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Django, Django REST Framework
- **Database**: SQLite (default), can be configured to use PostgreSQL or others
- **APIs**: OpenAI API for content generation

## Setup

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- Django (v3.2 or later)
- PostgreSQL (optional, if you want to use it instead of SQLite)

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:

   ```bash
   python manage.py migrate
   ```

5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

## Usage

- Access the frontend at `http://localhost:3000` (or the port specified by Vite).
- Access the backend API at `http://localhost:8000/api/`.

### API Endpoints

- **Articles**: `/api/articles/`
- **Authors**: `/api/authors/`
- **Generate Article**: `/api/articles/generate/<author_id>/`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
