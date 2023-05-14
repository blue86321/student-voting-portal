FROM node:16-alpine 

WORKDIR /app

COPY . .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
RUN npm run build

# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production

EXPOSE 3000

CMD [ "npx", "serve", "build" ]