#!/usr/bin/env python3
"""
Database migration helper script for Caelo Backend.

Usage:
  python db_migrate.py init       # Initialize Alembic (first time only)
  python db_migrate.py create     # Create new migration
  python db_migrate.py upgrade    # Apply migrations
  python db_migrate.py downgrade  # Rollback migrations
  python db_migrate.py current    # Show current migration
  python db_migrate.py history    # Show migration history
"""

import subprocess
import sys
import os
from pathlib import Path


def run_command(cmd: list, description: str):
    """Run a command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        if e.stderr:
            print(e.stderr)
        if e.stdout:
            print(e.stdout)
        return False


def init_alembic():
    """Initialize Alembic (first time setup)."""
    print("🚀 Initializing Alembic for database migrations...")
    
    # Check if alembic is already initialized
    if Path("alembic/versions").exists():
        print("ℹ️  Alembic already initialized")
        return True
        
    return run_command(
        ["alembic", "init", "alembic"],
        "Initializing Alembic"
    )


def create_migration(message: str = None):
    """Create a new migration."""
    if not message:
        message = input("Enter migration message: ").strip()
        if not message:
            message = "auto migration"
    
    return run_command(
        ["alembic", "revision", "--autogenerate", "-m", message],
        f"Creating migration: {message}"
    )


def upgrade_database(revision: str = "head"):
    """Upgrade database to specified revision."""
    return run_command(
        ["alembic", "upgrade", revision],
        f"Upgrading database to {revision}"
    )


def downgrade_database(revision: str):
    """Downgrade database to specified revision.""" 
    return run_command(
        ["alembic", "downgrade", revision],
        f"Downgrading database to {revision}"
    )


def show_current():
    """Show current migration."""
    return run_command(
        ["alembic", "current"],
        "Showing current migration"
    )


def show_history():
    """Show migration history."""
    return run_command(
        ["alembic", "history", "--verbose"],
        "Showing migration history"
    )


def main():
    """Main CLI function."""
    if len(sys.argv) < 2:
        print("❌ Usage: python db_migrate.py <command>")
        print("Commands: init, create, upgrade, downgrade, current, history")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    # Change to backend directory
    os.chdir(Path(__file__).parent)
    
    if command == "init":
        success = init_alembic()
        if success:
            print("\n🎉 Alembic initialized successfully!")
            print("Next steps:")
            print("1. Run: python db_migrate.py create 'initial_schema'")
            print("2. Run: python db_migrate.py upgrade")
    
    elif command == "create":
        message = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else None
        create_migration(message)
    
    elif command == "upgrade":
        revision = sys.argv[2] if len(sys.argv) > 2 else "head"
        upgrade_database(revision)
    
    elif command == "downgrade":
        if len(sys.argv) < 3:
            print("❌ Downgrade requires a revision (e.g., -1 for previous)")
            sys.exit(1)
        downgrade_database(sys.argv[2])
    
    elif command == "current":
        show_current()
    
    elif command == "history":
        show_history()
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Available commands: init, create, upgrade, downgrade, current, history")
        sys.exit(1)


if __name__ == "__main__":
    main()
