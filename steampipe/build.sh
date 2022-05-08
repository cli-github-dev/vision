# docker rmi $(docker images -f "dangling=true" -q)

# docker rm -f sp1
docker build ./steampipe -t sp1

docker run -d -p 9193:9193 -p 9194:9194 -e STEAMPIPE_DATABASE_PASSWORD=fb50_4f86_ba12  --name sp1 sp1 