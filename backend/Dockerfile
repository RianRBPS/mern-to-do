# imagem
FROM node:20-alpine

# working directory in the container
WORKDIR /backend

# copia package.json e package-lock.json para o diretorio de trabalho
# basically next time i build the image it wont run npm install again unless these files are changed
# if i were to copy all the code first then change anything  docker would have to redo npm install every time even if dependencies didnt change, wasting time
COPY package*.json

# instala dependencias
RUN npm install

# copia o restante do code da aplicação para o diretorio de trabalho
COPY . .

# expoe a porta que o app vai rodar
EXPOSE 3000

# define o comando para rodar a aplicação
CMD ["npm", "start"]