#!/bin/bash
set -e

# Log all output
exec > >(tee -a /var/log/startup-script.log)
exec 2>&1

echo "Starting VM initialization..."

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    curl \
    git \
    nginx \
    certbot \
    python3-certbot-nginx \
    build-essential \
    jq

# Install Cloud SQL Proxy
curl -o /usr/local/bin/cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
chmod +x /usr/local/bin/cloud_sql_proxy

# Create systemd service for Cloud SQL Proxy
cat > /etc/systemd/system/cloud-sql-proxy.service << 'EOF'
[Unit]
Description=Cloud SQL Proxy
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/cloud_sql_proxy -instances=${project_id}:us-central1:${db_connection_name}=tcp:5432
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start Cloud SQL Proxy
systemctl daemon-reload
systemctl enable cloud-sql-proxy
systemctl start cloud-sql-proxy

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Create app directory
mkdir -p /var/www/app
chmod 755 /var/www/app

# Get database password from Secret Manager
DB_PASSWORD=$(gcloud secrets versions access latest --secret="recipe-generator-db-password" --project="${project_id}" 2>/dev/null || echo "RecipeGen2024Secure!")

# Create environment file
cat > /var/www/app/.env << EOF
DATABASE_URL=postgresql://${db_user}:$${DB_PASSWORD}@localhost:5432/${db_name}
NEXTAUTH_URL=https://${domain_name}
NEXTAUTH_SECRET=${nextauth_secret}
GOOGLE_CLIENT_ID=${google_client_id}
GOOGLE_CLIENT_SECRET=${google_client_secret}
NODE_ENV=production
PORT=3000
EOF

chmod 600 /var/www/app/.env

# Configure nginx
cat > /etc/nginx/sites-available/nextjs << 'NGINX_EOF'
server {
    listen 80;
    server_name ${domain_name} www.${domain_name};

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

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
NGINX_EOF

# Enable nginx site
ln -sf /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Create deployment script
cat > /root/deploy.sh << 'DEPLOY_EOF'
#!/bin/bash
set -e

APP_DIR="/var/www/app"
REPO_URL="YOUR_GITHUB_REPO_URL"  # Update this

echo "Starting deployment..."

cd $APP_DIR

# Clone or pull latest code
if [ ! -d ".git" ]; then
    echo "Cloning repository..."
    git clone $REPO_URL .
else
    echo "Pulling latest changes..."
    git pull origin main
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Run database migrations
echo "Running migrations..."
npx prisma migrate deploy
npx prisma generate

# Build Next.js app
echo "Building application..."
npm run build

# Restart PM2
echo "Restarting application..."
pm2 delete nextjs-app || true
pm2 start npm --name "nextjs-app" -- start
pm2 save
pm2 startup systemd -u root --hp /root

echo "Deployment complete!"
DEPLOY_EOF

chmod +x /root/deploy.sh

# Create SSL setup script
cat > /root/setup-ssl.sh << 'SSL_EOF'
#!/bin/bash
set -e

echo "Setting up SSL certificate..."
echo "Make sure ${domain_name} points to this server's IP"
echo "Press Enter when ready..."
read

# Obtain SSL certificate
certbot --nginx -d ${domain_name} -d www.${domain_name} \
    --non-interactive \
    --agree-tos \
    -m admin@${domain_name}

# Set up auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

echo "SSL setup complete!"
SSL_EOF

chmod +x /root/setup-ssl.sh

# Create monitoring script
cat > /root/monitor.sh << 'MONITOR_EOF'
#!/bin/bash

echo "=== VM Status ==="
uptime

echo -e "\n=== PM2 Status ==="
pm2 status

echo -e "\n=== Nginx Status ==="
systemctl status nginx --no-pager

echo -e "\n=== Cloud SQL Proxy Status ==="
systemctl status cloud-sql-proxy --no-pager

echo -e "\n=== Disk Usage ==="
df -h

echo -e "\n=== Memory Usage ==="
free -h

echo -e "\n=== Recent Application Logs ==="
pm2 logs nextjs-app --lines 20 --nostream
MONITOR_EOF

chmod +x /root/monitor.sh

# Create README
cat > /root/README.txt << 'README_EOF'
==============================================
Next.js on Google Compute Engine
==============================================

IMPORTANT COMMANDS:

1. Deploy application:
   /root/deploy.sh

2. Setup SSL certificate:
   /root/setup-ssl.sh

3. Monitor services:
   /root/monitor.sh

4. Check logs:
   pm2 logs nextjs-app
   sudo tail -f /var/log/nginx/error.log
   sudo journalctl -u cloud-sql-proxy -f

5. Restart services:
   pm2 restart nextjs-app
   sudo systemctl restart nginx
   sudo systemctl restart cloud-sql-proxy

==============================================
README_EOF

echo "Startup script completed successfully!"
echo "Instance is ready for application deployment"
