FROM node:lts-alpine

WORKDIR /application

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5173

ENV VITE_API_URL=http://18.194.169.203/api

CMD ["yarn","run", "dev"]