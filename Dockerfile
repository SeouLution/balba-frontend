# 운영 서버가 ARM64(OCI Ampere)라서 CI가 linux/arm64 로 빌드한다.
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite 는 빌드 시점에 환경변수를 번들에 넣는다.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# 워크플로가 배포된 커밋을 확인할 수 있도록 남긴다.
ARG GIT_SHA=dev
RUN echo "${GIT_SHA}" > dist/version.txt

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 80
