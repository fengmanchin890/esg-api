# Use Node.js LTS phiên bản mới hơn
FROM node:18-alpine AS build-stage

# Set thư mục làm việc
WORKDIR /app

# Copy file package.json & package-lock.json
COPY package.json package-lock.json ./

# Xóa cache npm và cài đặt dependency chuẩn
RUN npm cache clean --force
RUN npm ci --only=production

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cấp quyền thư mục build
RUN mkdir -p /app/dist && chmod -R 777 /app/dist

# Build Vue.js
RUN npm run build

# Chuyển sang Nginx để phục vụ ứng dụng
FROM nginx:alpine AS production-stage

# Copy ứng dụng đã build vào Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]

