FROM node:20.18
WORKDIR /app
COPY . .
RUN npm install
CMD ["yarn", "dev"]
EXPOSE 4001
