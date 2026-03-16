FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy project files
COPY . .

# Build the TypeScript application
RUN npx tsc

EXPOSE 3003

# Command to run the backend application
CMD ["node", "dist/app.js"]
