import time
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
import os
from dotenv import load_dotenv

from models import Base
from seed import create_demo_users

load_dotenv()

def wait_for_database():
    """Wait for the database to be ready"""
    max_attempts = 30
    attempt = 0
    
    while attempt < max_attempts:
        try:
            # Try to connect to PostgreSQL
            conn = psycopg2.connect(
                host=os.getenv("POSTGRES_HOST", "postgres"),
                database=os.getenv("POSTGRES_DB", "caelo"),
                user=os.getenv("POSTGRES_USER", "caelo_user"),
                password=os.getenv("POSTGRES_PASSWORD", "caelo_password"),
                port=os.getenv("POSTGRES_PORT", "5432")
            )
            conn.close()
            print("Database is ready!")
            return True
        except psycopg2.OperationalError:
            attempt += 1
            print(f"Waiting for database... (attempt {attempt}/{max_attempts})")
            time.sleep(2)
    
    print("Failed to connect to database")
    return False

def init_database():
    """Initialize the database with tables and seed data"""
    if not wait_for_database():
        return False
    
    try:
        # Create database engine
        database_url = os.getenv("DATABASE_URL", "postgresql://caelo_user:caelo_password@postgres:5432/caelo")
        engine = create_engine(database_url)
        
        # Create tables
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Seed demo users
        print("Seeding demo users...")
        create_demo_users()
        
        print("Database initialization complete!")
        return True
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        return False

if __name__ == "__main__":
    init_database() 