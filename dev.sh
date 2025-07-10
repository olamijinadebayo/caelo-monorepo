#!/bin/bash

# Caelo Community Bridge - Development Environment Script
# This script manages the Docker development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Caelo Community Bridge - Development Environment"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services (frontend, backend, database)"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show logs from all services"
    echo "  backend     Show backend logs only"
    echo "  frontend    Show frontend logs only"
    echo "  db          Show database logs only"
    echo "  status      Show status of all services"
    echo "  rebuild     Rebuild all containers"
    echo "  clean       Stop and remove all containers, volumes, and images"
    echo "  test        Run all tests (backend and frontend)"
    echo "  test:backend Run backend tests only"
    echo "  test:frontend Run frontend tests only"
    echo "  test:coverage Run tests with coverage reports"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start the development environment"
    echo "  $0 test           # Run all tests"
    echo "  $0 logs           # View all logs"
    echo "  $0 clean          # Clean up everything"
}

# Function to start services
start_services() {
    print_status "Starting Caelo Community Bridge development environment..."
    
    check_docker
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file with default values..."
        cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://caelo_user:caelo_password@postgres:5432/caelo
POSTGRES_DB=caelo
POSTGRES_USER=caelo_user
POSTGRES_PASSWORD=caelo_password

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Frontend Configuration
VITE_API_URL=http://localhost:8000
EOF
        print_success "Created .env file"
    fi
    
    # Start services
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Development environment started successfully!"
        echo ""
        echo "Services:"
        echo "  Frontend: http://localhost:8080"
        echo "  Backend API: http://localhost:8000"
        echo "  API Documentation: http://localhost:8000/docs"
        echo "  Database: localhost:5432"
        echo ""
        echo "Demo Accounts:"
        echo "  Admin: sarah@withcaelo.ai / demo123"
        echo "  Analyst: mike@cdfi.example.org / demo123"
        echo "  Borrower: jessica@smallbiz.com / demo123"
    else
        print_error "Failed to start services. Check logs with: $0 logs"
        exit 1
    fi
}

# Function to stop services
stop_services() {
    print_status "Stopping development environment..."
    docker-compose down
    print_success "Development environment stopped"
}

# Function to restart services
restart_services() {
    print_status "Restarting development environment..."
    stop_services
    start_services
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        print_status "Showing logs from all services..."
        docker-compose logs -f
    else
        print_status "Showing logs from $1 service..."
        docker-compose logs -f "$1"
    fi
}

# Function to show status
show_status() {
    print_status "Service status:"
    docker-compose ps
}

# Function to rebuild containers
rebuild_containers() {
    print_status "Rebuilding containers..."
    docker-compose down
    docker-compose build --no-cache
    start_services
}

# Function to clean everything
clean_environment() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up development environment..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Environment cleaned up"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to run tests
run_tests() {
    case "$1" in
        "backend")
            print_status "Running backend tests..."
            docker-compose exec backend pytest
            ;;
        "frontend")
            print_status "Running frontend tests..."
            docker-compose exec frontend npm test
            ;;
        "coverage")
            print_status "Running tests with coverage..."
            print_status "Backend coverage:"
            docker-compose exec backend pytest --cov=. --cov-report=html
            print_status "Frontend coverage:"
            docker-compose exec frontend npm run test:coverage
            ;;
        *)
            print_status "Running all tests..."
            print_status "Backend tests:"
            docker-compose exec backend pytest
            print_status "Frontend tests:"
            docker-compose exec frontend npm test
            ;;
    esac
}

# Main script logic
case "$1" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs "$2"
        ;;
    "backend")
        show_logs "backend"
        ;;
    "frontend")
        show_logs "frontend"
        ;;
    "db")
        show_logs "postgres"
        ;;
    "status")
        show_status
        ;;
    "rebuild")
        rebuild_containers
        ;;
    "clean")
        clean_environment
        ;;
    "test")
        run_tests "$2"
        ;;
    "test:backend")
        run_tests "backend"
        ;;
    "test:frontend")
        run_tests "frontend"
        ;;
    "test:coverage")
        run_tests "coverage"
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 