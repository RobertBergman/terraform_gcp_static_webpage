#!/bin/bash
# Complete VM setup script
# Run this ON THE VM (via SSH) to set up everything from scratch
# Use case: If VM gets recreated or you need to redeploy from scratch

set -e

echo "=========================================="
echo "Setting up Next.js VM Environment"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "Installing PM2..."
sudo npm install -g pm2

# Install nginx
echo "Installing nginx..."
sudo apt-get install -y nginx

# Install Cloud SQL Proxy
echo "Installing Cloud SQL Proxy..."
curl -o /tmp/cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
sudo mv /tmp/cloud_sql_proxy /usr/local/bin/cloud_sql_proxy
sudo chmod +x /usr/local/bin/cloud_sql_proxy

# Configure Cloud SQL Proxy service
echo "Configuring Cloud SQL Proxy..."
sudo tee /etc/systemd/system/cloud-sql-proxy.service > /dev/null <<'EOF'
[Unit]
Description=Cloud SQL Proxy
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/cloud_sql_proxy -instances=web-page-d9ec622e:us-central1:recipe-generator-db=tcp:5432
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable cloud-sql-proxy
sudo systemctl start cloud-sql-proxy

# Create app directory
echo "Creating app directory..."
sudo mkdir -p /var/www/app
sudo chown -R $USER:$USER /var/www/app

# Configure nginx
echo "Configuring nginx..."
sudo tee /etc/nginx/sites-available/nextjs > /dev/null <<'EOF'
server {
    listen 80;
    server_name fatesblind.com www.fatesblind.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Create environment file
# NOTE: Replace placeholder values with actual credentials from ../credentials.env
echo "Creating environment file..."
cat > /var/www/app/.env <<'EOF'
DATABASE_URL=postgresql://recipe_app:YOUR_DB_PASSWORD@localhost:5432/recipe_generator
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NODE_ENV=production
PORT=3000
EOF

chmod 600 /var/www/app/.env

# Create PM2 startup script
echo "Configuring PM2 startup..."
pm2 startup systemd -u $USER --hp /home/$USER

echo ""
echo "=========================================="
echo "VM Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Copy your Next.js app files to /var/www/app"
echo "2. Run: cd /var/www/app && npm ci"
echo "3. Run: npx prisma generate"
echo "4. Run: npm run build"
echo "5. Run: pm2 start 'npx next start -p 3000' --name nextjs-app"
echo "6. Run: pm2 save"
echo ""
echo "Or use the quick-deploy.sh script to automate steps 1-6"
