npm run build
docker build -t editor_image .
docker kill editor
docker rm editor
docker run -d --name cms_front -p 9003:80 editor_image
docker rmi editor_image
