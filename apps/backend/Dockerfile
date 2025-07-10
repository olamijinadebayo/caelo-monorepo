FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create .env file with default values
RUN echo "DATABASE_URL=postgresql://caelo_user:caelo_password@postgres:5432/caelo" > .env && \
    echo "JWT_SECRET_KEY=your-super-secret-key-change-in-production" >> .env && \
    echo "JWT_ALGORITHM=HS256" >> .env && \
    echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env && \
    echo "API_HOST=0.0.0.0" >> .env && \
    echo "API_PORT=8000" >> .env

# Make startup script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command
CMD ["./start.sh"] 