# Multi-stage: build with Node, ship only the static files behind nginx
# (TECH_SPECS §17).

FROM node:22-alpine AS build
WORKDIR /app
# Dependencies first, so source edits do not invalidate the install layer.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
# Only the built application and its server config reach the final image.
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
