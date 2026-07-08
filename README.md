# EchoID

A song-recognition mobile app built with Expo React Native (SDK 54) and FastAPI. Users can record audio, identify songs via MFCC-based matching, save favorites, and view search history.

## Project Structure

```
EchoID/
├── frontend/          # Expo React Native app
│   ├── assets/        # Images and static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── config/      # API configuration
│   │   ├── navigation/  # App navigator (state-based)
│   │   ├── screens/     # Screen components
│   │   └── styles/      # Style files
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── backend/           # FastAPI Python server
│   ├── app/
│   │   ├── api/        # Route handlers (auth, identify, favorites, search)
│   │   ├── core/       # DB connection
│   │   ├── models/     # Pydantic schemas
│   │   └── services/   # Song matcher (MFCC recognition)
│   ├── .env.example
│   ├── requirements.txt
│   └── run_server.bat
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB instance (local or Atlas)
- Android/iOS device or emulator for frontend testing

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment and install dependencies:
   ```
   python -m venv venv
   source venv/bin/activate   # Linux/macOS
   venv\Scripts\activate      # Windows
   pip install -r requirements.txt
   ```

3. Create a `.env` file from the template and set your MongoDB URI:
   ```
   copy .env.example .env     # Windows
   cp .env.example .env       # Linux/macOS
   ```
   Edit `.env` and set `MONGODB_URI` to your MongoDB connection string.

4. Load song data into MongoDB. The `songs` collection in the `EchoID` database should contain documents with at least:
   - `title` (string)
   - `artist` (string)
   - `album` (string, optional)
   - `genre` (string, optional)
   - `features` (array of 20 floats — averaged MFCC vector)

5. Start the server:
   ```
   run_server.bat          # Windows
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The API will be available at `http://localhost:8000`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the API base URL in `src/config/api.ts` to point to your backend server:
   ```ts
   export const API_BASE_URL = 'http://<your-local-ip>:8000';
   ```

4. Start the Expo development server:
   ```
   npx expo start
   ```

5. Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `a` for Android emulator / `i` for iOS simulator.

## API Endpoints

| Method | Path                | Description                        |
|--------|---------------------|------------------------------------|
| POST   | `/auth/signup`      | Create a new account               |
| POST   | `/auth/login`       | Log in to existing account         |
| POST   | `/identify/`        | Upload audio and identify a song   |
| POST   | `/favorites/`       | Add a song to favorites            |
| GET    | `/favorites/`       | List favorites for a user          |
| DELETE | `/favorites/`       | Remove a song from favorites       |
| GET    | `/search/`          | Search songs by title/artist/album |
| POST   | `/history/`         | Add a search to history            |
| GET    | `/history/`         | Get search history for a user      |

## Recognition Pipeline

1. User records ~5+ seconds of audio on device
2. Audio (M4A/AAC) is uploaded to `POST /identify/`
3. Backend converts to WAV via bundled `imageio-ffmpeg` binary
4. Librosa trims silence and normalizes volume
5. 20 MFCC features are extracted and averaged
6. SongMatcher compares against ~7100 pre-computed song vectors in RAM
   - Dual metric: 50% L2 cosine distance + 50% centered correlation
   - Confidence is margin-based (higher = more certain)
7. Best match is returned with title, artist, album, genre, and confidence score

## Tech Stack

- **Frontend**: Expo SDK 54, React 19.1, React Native 0.81.5, TypeScript
- **Backend**: FastAPI, uvicorn, pymongo, bcrypt, librosa, numpy, scipy, imageio-ffmpeg
- **Database**: MongoDB (EchoID database with `users`, `songs`, `favorites`, `history` collections)
