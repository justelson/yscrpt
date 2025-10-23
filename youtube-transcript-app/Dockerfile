# Dockerfile for Render deployment
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server code
COPY server/ ./server/

# Expose port
EXPOSE 10000

# Start the server
CMD ["npm", "run", "server"]