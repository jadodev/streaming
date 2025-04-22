FROM node:20-alpine

# Instala dependencias
RUN apk add --no-cache ffmpeg python3 make g++

WORKDIR /app

# 1. Copia solo lo necesario para instalar dependencias
COPY package.json yarn.lock tsconfig.json ./

# 2. Instala dependencias
RUN yarn install --frozen-lockfile

# 3. Copia TODO el código fuente
COPY . .

# 4. Compila TypeScript explícitamente
RUN yarn build

EXPOSE 3000 1935 8000

CMD ["yarn", "dev"]