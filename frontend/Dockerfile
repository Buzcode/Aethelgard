# Use a stable and lightweight Node.js version as our base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the container. We copy this file separately
# to take advantage of Docker's layer caching. If this file doesn't change,
# Docker won't re-run 'npm install', making builds much faster.
COPY package.json ./

# Install all the dependencies from package.json
RUN npm install

# Copy the rest of your frontend application's source code
COPY . .

# The command 'npm run build' will be triggered by Docker Compose later.
# This default CMD is useful if you wanted to run a development server.
CMD ["npm", "run", "dev"]