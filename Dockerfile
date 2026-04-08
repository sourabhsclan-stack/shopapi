# ──────────────────────────────────────────
# STAGE 1 — Builder
# Purpose: install deps and run tests
# This stage is temporary — not in final image
# ──────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy package files FIRST (Docker cache trick)
# If package.json didn't change, Docker skips npm ci
# and uses cached node_modules — much faster builds
COPY package*.json ./

# Install ALL dependencies (including dev like jest)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Run tests inside Docker — if tests fail, build fails
# This means broken code can NEVER become an image
RUN npm test

# ──────────────────────────────────────────
# STAGE 2 — Production
# Purpose: lean final image with only what's needed
# This is what actually runs in Kubernetes
# ──────────────────────────────────────────
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
# --omit=dev skips jest, nodemon, supertest etc.
# Final image is much smaller this way
RUN npm ci --omit=dev && npm cache clean --force

# Copy only the source code from builder stage
# node_modules from builder are NOT copied
COPY --from=builder /app/src ./src

# Tell Docker this container listens on port 3000
EXPOSE 3000

# Run as non-root user for security
# node user already exists in node:alpine image
USER node

# Start the app
CMD ["node", "src/app.js"]