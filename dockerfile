# Usa una imagen base con Node.js y FFmpeg
FROM node:18-alpine

# Instala FFmpeg y dependencias de compilación
RUN apk add --no-cache ffmpeg python3 make g++

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de configuración de dependencias
COPY package.json yarn.lock ./

# Instala dependencias
RUN yarn install --frozen-lockfile

# Copia todo el código fuente
COPY . .

# Compila el proyecto (si es necesario)
RUN yarn build

# Expone los puertos necesarios
EXPOSE 3000
EXPOSE 1935 
EXPOSE 8000  

CMD ["yarn", "dev"]