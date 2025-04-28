# Bentune 3B - Frontend Interface

This repository contains the frontend code for **Bentune 3B**, a lightweight web client that interacts with our fine-tuned LLaMA 3.2 3B model through a Flask backend.

## Overview

- **Framework:** Next.js (React)
- **Purpose:** Query the backend model easily through a clean web interface
- **Backend:** Flask server (deployed on Render)

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the frontend.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## API Configuration

The frontend sends POST requests to the `/query` endpoint exposed by the backend.  
Make sure the backend Flask server is running and the environment variable for the backend URL is correctly set if needed.

- **Request Body:**
  ```json
  {
    "question": "Your input question here"
  }
  ```

- **Expected Response:**
  ```json
  {
    "answer": "Model's generated response"
  }
  ```

## Deployment

Bentune is deployed at [Vercel](https://bentune-front.vercel.app/).

## Contributors

- Deep Goyal
- Namita Shah
- Jay Pavuluri
- Evan Zhu
- Navni Athale