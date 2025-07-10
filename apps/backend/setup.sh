#!/bin/bash

echo "Setting up Caelo Backend..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "Please update .env file with your configuration"
fi

# Run database migrations and seed data
echo "Setting up database..."
python -c "
from main import app
from seed import create_demo_users
from database import engine
from models import Base

# Create tables
Base.metadata.create_all(bind=engine)
# Seed demo users
create_demo_users()
"

echo "Backend setup complete!"
echo "To start the server, run: python run.py" 