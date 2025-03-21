FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies using clean install
RUN npm ci

# Copy all application files to the container
COPY . .


RUN addgroup -S mercari && adduser -S trainee -G mercari

# Change ownership to trainee user and mercari group with appropriate permissions
RUN chown -R trainee:mercari /app && chmod -R 755 /app

# Switch to non-root user for all following operations
USER trainee

# Declare the port the application will listen on
EXPOSE 3000

# Start the application when the container launches
# Listen on all network interfaces with 0.0.0.0  
CMD ["npm", "start", "--", "--host", "0.0.0.0"]