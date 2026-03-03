# Hướng dẫn Deploy lên Google Cloud VPS

## 1. Chuẩn bị VPS

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Node.js LTS (v20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài PM2 (process manager)
npm install -g pm2

# Kiểm tra
node -v && npm -v && pm2 -v
```

## 2. Upload code lên VPS

```bash
# Clone repo (hoặc rsync từ máy local)
git clone <your_repo_url> /var/www/bongda
cd /var/www/bongda

# Hoặc từ local dùng rsync:
rsync -avz --exclude node_modules --exclude .next \
  "h:/bongda_2026 Auto/" user@VPS_IP:/var/www/bongda/
```

## 3. Cài đặt và Build

```bash
cd /var/www/bongda

# Cài dependencies
npm install

# Tạo file .env.local với các biến môi trường
cat > .env.local << 'EOF'
MONGODB_URI=mongodb+srv://...
MONGODB_DB=bongda
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENROUTER_API_KEY=your_key
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=@your_channel
SITE_URL=https://tinthethao24h.com
SITE_NAME=Tin Thể Thao 24h
EOF

# Build Next.js production
npm run build

# Tạo thư mục logs
mkdir -p logs
```

## 4. Khởi chạy với PM2

```bash
cd /var/www/bongda

# Chạy cả web server và cron worker
pm2 start ecosystem.config.cjs

# Kiểm tra trạng thái
pm2 status

# Xem logs real-time
pm2 logs bongda-cron
pm2 logs bongda-web
```

## 5. Auto-start khi reboot VPS

```bash
pm2 save
pm2 startup   # Chạy lệnh được hiển thị, ví dụ:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

## 6. Lịch Cron (Tự động)

| Job | Lịch | Mô tả |
|-----|------|-------|
| 📰 Tin tức | Mỗi 2 giờ (0,2,4,...,22h) | 8 danh mục × 2 bài mới/ngày |
| 🎬 Video | Mỗi 3 giờ (1,4,7,...,22h) | Video YT mới trong ngày |

## 7. Kiểm tra Cron hoạt động

```bash
# Xem log cron realtime
pm2 logs bongda-cron --lines 50

# Trigger thủ công để test:
curl -X POST http://localhost:3000/api/admin/crawler/start \
  -H "Authorization: Basic $(echo -n 'admin:your_password' | base64)"

curl -X POST http://localhost:3000/api/admin/crawler/videos \
  -H "Authorization: Basic $(echo -n 'admin:your_password' | base64)"
```

## 8. Cài Nginx (Reverse Proxy)

```bash
sudo apt install nginx -y

# Tạo config
sudo nano /etc/nginx/sites-available/bongda
```

```nginx
server {
    listen 80;
    server_name tinthethao24h.com www.tinthethao24h.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bongda /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Cài SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tinthethao24h.com -d www.tinthethao24h.com
```

## 9. Monitor

```bash
pm2 monit          # Dashboard real-time
pm2 status         # Xem trạng thái tất cả process
pm2 restart all    # Restart khi cần
```
