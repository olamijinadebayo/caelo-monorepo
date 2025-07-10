FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Default command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"] 