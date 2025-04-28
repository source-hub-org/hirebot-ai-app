# Docker Setup for HireBot AI App

This document explains how to use Docker to containerize and run the HireBot AI Next.js application.

## Development Commands

```bash
# Run ESLint to check for issues
npm run lint

# Run ESLint with auto-fix
npm run lint:fix

# Format code with Prettier
npm run format
```

## Files Overview

1. **Dockerfile**: Multi-stage build configuration for the Next.js application.

   - First stage builds the application
   - Second stage creates a lightweight production image

2. **docker-compose.yml**: Defines the service configuration for running the containerized application.

   - Maps port 3000 to the host
   - Sets production environment variables
   - Includes commented volume mounts for development

3. **ecosystem.config.js**: PM2 configuration for running the Next.js application in production mode.
   - Configures clustering for better performance
   - Sets up memory limits and restart policies
   - Configures logging

## Running with Docker

### Build and start the application:

```bash
docker-compose up -d
```

### Stop the application:

```bash
docker-compose down
```

### View logs:

```bash
docker-compose logs -f
```

## Running with PM2 (without Docker)

1. Install PM2 globally:

```bash
npm install -g pm2
```

2. Start the application:

```bash
pm2 start ecosystem.config.js
```

3. View logs:

```bash
pm2 logs hirebot-ai-app
```

4. Monitor the application:

```bash
pm2 monit
```

## Running with PM2 inside Docker

To use PM2 inside Docker, modify the Dockerfile CMD line to:

```dockerfile
CMD ["npx", "pm2-runtime", "start", "ecosystem.config.js"]
```

And ensure PM2 is installed in your package.json dependencies:

```bash
npm install --save pm2
```
