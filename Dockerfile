# Production Dockerfile for Render deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend-gestion-biblio/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY backend-gestion-biblio/ ./

# Create uploads directory
RUN mkdir -p uploads/covers uploads/profiles

# Expose port
EXPOSE 10000

# Set environment
ENV NODE_ENV=production
ENV PORT=10000

# Start command
CMD ["npm", "start"]
