FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# FIX permission
RUN chmod -R 755 /app

RUN npx prisma generate
RUN npm run build

EXPOSE 3003

CMD ["sh", "-c", "npx prisma db push && npm start"]