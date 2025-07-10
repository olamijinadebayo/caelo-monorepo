#!/bin/bash

echo "Starting Caelo Backend..."

# Initialize database
echo "Initializing database..."
python init_db.py

# Start the FastAPI server
echo "Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload 