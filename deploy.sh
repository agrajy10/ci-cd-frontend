#!/bin/bash

# filepath: c:\ci-cd-practice\ci-cd-frontend\deploy.sh

# Clone the repository
git clone https://github.com/agrajy10/ci-cd-frontend.git
cd ci-cd-frontend

# Install dependencies and build the project
npm install
npm run build

# Set permissions for the build directory
sudo chown -R www-data:www-data /home/ubuntu/ci-cd-frontend/dist
sudo find /home/ubuntu/ci-cd-frontend/dist -type d -exec chmod 755 {} \;
sudo find /home/ubuntu/ci-cd-frontend/dist -type f -exec chmod 644 {} \;

# Configure Nginx
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
sudo systemctl restart nginx