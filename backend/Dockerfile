# imagem
FROM node:20-alpine

# working directory in the container
WORKDIR /backend

# copia package.json e package-lock.json para o diretorio de trabalho
COPY package*.json

# instala dependencias
RUN npm install

# copia o restante do code da aplicação para o diretorio de trabalho
COPY . .

# expoe a porta que o app vai rodar
EXPOSE 3000

# define o comando para rodar a aplicação
CMD ["npm", "start"]