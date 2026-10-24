# Imagen base: Node 22 sobre Alpine (liviana)
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Se copian primero solo los package*.json: esta capa solo se invalida
# si cambian las dependencias, y así Docker reutiliza el cache de npm install
COPY package*.json ./

# Instala las dependencias dentro de la imagen
RUN npm install

# Recién ahora se copia el resto del código (cambia seguido, no rompe el cache anterior)
COPY . .

# Documenta el puerto en el que escucha la API
EXPOSE 3000

# Comando por defecto al iniciar el contenedor
CMD ["npm", "run", "dev"]
