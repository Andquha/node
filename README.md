# Подключаемся к VPS

Покделючаемся к нашему серверу чрез PuTTY с помощю IP и пароля к нему.

## 1 Первые настройки

### 1.1 Удаляем apach сервер

```
systemctl stop apache2
```

```
systemctl disable apache2
```

```
apt remove apache2
```

```
apt autoremove
```

### 1.2 Чистим и обновляем сервер

```
apt clean all && sudo apt update && sudo apt dist-upgrade
```

### 1.3 Устанавливаем Nginx

```
apt install nginx
```

Удаляем стартовую стандартную страницу
```
rm -rf /var/www/html
```

### 1.4 Что бы убедится что у нас все работает создадим папку и свой первый Html 

Переходим в папку "www"
```
сd /var/www
```

Создаем новую папку "webapp"
```
mkdir webapp
```

Создаем index.html
```
nano webapp/index.html
```
В появившемся окне пишем любой текст, например: "Привет это первая страница на моем VPS"
Сохраняем Ctrl+S
Выходим с редактора Ctrl+X

#### 1.4.1 Чтобы увидеть нашу страницу нужно сбросить стандартные настройки сервера и установить свои

Настройки можно увидеть с помощью
```
 nano /etc/nginx/sites-available/default
```
Есть 2 папки по настройкам сервера "sites-available" и "sites-enabled", доступные и включены соответственно.
Стандартные настройки нам не нужны поетому их сносим
```
 rm /etc/nginx/sites-available/default
```
И также удаляем эти настройки с папки "Включены"
```
 rm /etc/nginx/sites-enabled/default
```

Проверим что мы сделали все верно
Перейдем в папку..
```
 cd /etc/nginx/sites-enabled
```
И попросим список вайлов, дерикторий
```
 ls
```
Вывод должен быть пустым


#### Первые настройки
Создаем свой файл с настройками
```
 nano /etc/nginx/sites-available/webapp
```

Копируем сами настройки (Незабываем заменить имя папки "webapp", в соотвецтвии с 1.4)
```
server {
  listen 80;

  location / {
        root /var/www/webapp;
        index  index.html index.htm;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        try_files $uri $uri/ /index.html;
  }
}
```

```
ln -s /etc/nginx/sites-available/netflix /etc/nginx/sites-enabled/netflix

```

##### Write your fist message
```
nano /var/www/netflix/index.html

```

##### Start Nginx and check the page

```
systemctl start nginx
```

## Uploading Apps Using Git

```
apt install git
```

```
mkdir netflix
```
```
cd netflix
```

```
git clone <your repository>
```

## Nginx Configuration for new apps
```
nano /etc/nginx/sites-available/netflix
```
```
location /api {
        proxy_pass http://45.90.108.107:8800;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
  }
```

##### If you check the location /api you are going to get "502" error which is good. Our configuration works. The only thing we need to is running our app

```
apt install nodejs
```

```
apt install npm
```

```
cd api
```
```
npm install
```
```
nano .env
```
##### Copy and paste your env file
```
node index.js
```

#### But if you close your ssh session here. It's gonna kill this process. To prevent this we are going to need a package which is called ```pm2```
```
npm i -g pm2
```
Let's create a new pm2 instance

```
pm2 start --name api index.js   
```
```
pm2 startup ubuntu 
```

## React App Deployment

```
cd ../client
```

```
nano .env
```
Paste your env file.

```
npm i
```
Let's create the build file

```
npm run build
```

Right now, we should move this build file into the main web file

```
rm -rf /var/www/netflix/*
```
```
mkdir /var/www/netflix/client
```

```
cp -r build/* /var/www/netflix/client
```

Let's make some server configuration
```
 location / {
        root /var/www/netflix/client/;
        index  index.html index.htm;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        try_files $uri $uri/ /index.html;
  }

```
### Adding Domain
1 - Make sure that you created your A records on your domain provider website.

2 - Change your pathname from Router

3 - Change your env files and add the new API address 

4 - Add the following server config
```
server {
 listen 80;
 server_name safakkocaoglu.com www.safakkocaoglu.com;

location / {
 root /var/www/netflix/client;
 index  index.html index.htm;
 proxy_http_version 1.1;
 proxy_set_header Upgrade $http_upgrade;
 proxy_set_header Connection 'upgrade';
 proxy_set_header Host $host;
 proxy_cache_bypass $http_upgrade;
 try_files $uri $uri/ /index.html;
}
}

server {
  listen 80;
  server_name api.safakkocaoglu.com;
  location / {
    proxy_pass http://45.90.108.107:8800;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    }
}

server {
  listen 80;
  server_name admin.safakkocaoglu.com;
  location / {
    root /var/www/netflix/admin;
    index  index.html index.htm;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    try_files $uri $uri/ /index.html;
  }
}
```

## SSL Certification
```
apt install certbot python3-certbot-nginx
```

Make sure that Nginx Full rule is available
```
ufw status
```

```
certbot --nginx -d example.com -d www.example.com
```

Let’s Encrypt’s certificates are only valid for ninety days. To set a timer to validate automatically:
```
systemctl status certbot.timer
```

