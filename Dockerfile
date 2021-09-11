FROM node:lts-alpine as build-step

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM pierrezemb/gostatic

COPY --from=build-step /dist /srv/http/ 

EXPOSE 8043