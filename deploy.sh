#!/bin/bash

# filepath: c:\ci-cd-practice\ci-cd-frontend\deploy.sh

echo "Starting deployment script..."

# Clone the repository
echo "Cloning the repository..."
git clone https://github.com/agrajy10/ci-cd-frontend.git
if [ $? -ne 0 ]; then
    echo "Error: Failed to clone the repository."
    exit 1
fi
cd ci-cd-frontend || exit

# Install dependencies and build the project
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies."
    exit 1
fi

echo "Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Build failed."
    exit 1
fi

# Set permissions for the build directory
echo "Setting permissions for the build directory..."
sudo chown -R www-data:www-data /home/ubuntu/ci-cd-frontend/dist
sudo find /home/ubuntu/ci-cd-frontend/dist -type d -exec chmod 755 {} \;
sudo find /home/ubuntu/ci-cd-frontend/dist -type f -exec chmod 644 {} \;

# Configure Nginx
echo "Configuring Nginx..."
sudo bash -c 'cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name _;

    root /home/ubuntu/ci-cd-frontend/dist;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }
}
EOF'

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx
if [ $? -ne 0 ]; then
    echo "Error: Failed to restart Nginx."
    exit 1
fi

echo "Deployment completed successfully."