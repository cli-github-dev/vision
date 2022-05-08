#!/bin/bash

dockerize -wait tcp://steampipe:9193 -timeout 30s
dockerize -wait tcp://mysql:3306 -timeout 120s

npx prisma db push

npm run start