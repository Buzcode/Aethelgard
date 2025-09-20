# Use a stable and lightweight Node.js version as our base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json AND package-lock.json from the 'frontend' directory.
# We copy these files separately to take advantage of Docker's layer caching.
COPY frontend/package*.json ./

# Install all the dependencies from package.json
RUN npm install

# Copy the rest of your frontend application's source code from the 'frontend' directory
COPY frontend/ .

# This command will run a development server.
# This is fine for local testing. For production on Vercel/Netlify,
# they will use their own build process.
EXPOSE 3000
CMD ["npm", "run", "dev"]