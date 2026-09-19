# FOOD MESS MANAGEMENT SYSTEM

A complete production-style MVP for managing a college/student mess.

## Features
- **User Roles:** Separated Student and Admin authentication mechanisms.
- **Weekly Menu:** Admins can rapidly configure and update daily meals (Breakfast, Lunch, Snacks, Dinner).
- **Feedback System:** Students can rate mess quality across attributes. Admins can view complete analytics.
- **Nutrition Scanner:** Upload your meal image to instantly get nutritional output (Ready for AI integration).

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript. Restful API integration. Fully Mobile Responsive.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas + Mongoose.
- **Security:** bcryptjs hashing, JSON Web Tokens (JWT) role-based gating constraints.

## Folder Structure
- `frontend/`: Standalone Vanilla JS client application.
  - `css/`, `js/`: Application design system and logic.
  - `admin/`: Subfolder strictly isolating the Admin application context.
- `backend/`: Node.js server with segmented logic for logic clarity.
  - `models/`, `controllers/`, `routes/`, `middleware/`

## Installation & Running

### Backend Setup
1. `cd backend`
2. `npm install`
3. Edit the existing `.env` file to include your exact MongoDB connection string (never share it). Ensure the file remains completely excluded via `.gitignore`.
4. Start the Application: `npm run dev`
*The server will securely mount on `http://localhost:5000`*

### Frontend Setup
Since there are no bundlers (No React, Webpack or Vite), you can test the frontend instantly without installation.
Just use any static file server like Live Server in VS Code, or install Vercel's `serve`:
```bash
cd frontend
npx -y serve .
```

*Note: All API routes point directly to `API_BASE_URL` defined inside `frontend/js/common.js`. Ensure you adjust it only when deploying to Render or AWS.*

## Security Requirements enforced
- Plain passwords are NEVER saved in the database.
- Responses never leak passwords via `.select('-password')`.
- Endpoints differentiate tightly between User and Admin. JWT role tampering will inherently result in `401 Unauthorized`.
- Environment files exist in `.gitignore` strictly.
