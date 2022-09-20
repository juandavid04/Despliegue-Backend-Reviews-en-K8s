# jenkins
## Crear imagen de jenkins
creamos un dockerfile que contiene lo siguiente. (este archivo ya se encuentra en esta carpeta)
```dockerfile
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && \
    apt-get -y install apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common && \
    curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
    add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
    $(lsb_release -cs) \
    stable" && \
    apt-get update && \
    apt-get -y install docker-ce
RUN apt-get install -y docker-ce
RUN usermod -a -G docker jenkins
USER jenkins
```
y luego hacer una imagen de ese dockerfile. (debemos tener la consola abierta en la carpeta donde esta el Dockerfile)
```console
docker build --pull -t jenkinswithdocker:latest .
```
## Crear contenedor
para crear el contenedor con la imagen jenkins creada y que esta pueda ejecutar comandos de docker dentro de un pipeline, hay que crearlo de la siguiente manera:
```console
docker run -d --group-add 0 --name jenkins-docker-pruebas -p 20000:8080 -p 50000:50000 -v //var/run/docker.sock:/var/run/docker.sock jenkinswithdocker
```
con ```--group-add 0``` le decimos que se ejecute como usuario root.

con ```-v //var/run/docker.sock:/var/run/docker.sock``` le decimos que pueda usar los comandos de docker mediante la instruccion sh en un pipeline de jenkins.

EJM:
```
pipeline{
    ...
    sh 'docker version'
    sh 'docker ps'
    ...
}
```
NOTA: no es necesario instalar ningun complemento adicional a los recomendados por jenkins al comienzo de la instalacion.

fuente: https://juanmanuellopezduran.wordpress.com/2020/09/21/integrando-docker-en-una-imagen-de-jenkins/