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

### 1.4 Устанавливаем Фаервол

```
apt install ufw
```

Включаем его
```
ufw enable
```

Разрешаем все действия на сервере нашему Nginx
```
ufw allow "Nginx Full"
```

Тут важно нужно незабыть добавить правила на подключение по SSH, иначе после выхода с консоли подключится обратно не сможете
```
ufw allow 22/tcp
```

Для подключений по FTP к серверу добавляем
```
ufw allow 21/tcp
ufw allow 20/tcp
```
И добавим 80 , 443 порты для http и https соидинений
```
ufw allow 80/tcp
ufw allow 443/tcp
```
### 1.5 Что бы убедится что у нас все работает создадим папку и свой первый Html 

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
В появившемся окне пишем любой текст, например: "Hy it is my first page on VPS"
Сохраняем Ctrl+S
Выходим с редактора Ctrl+X

#### 1.5.1 Чтобы увидеть нашу страницу нужно сбросить стандартные настройки сервера и установить свои

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


#### 1.5.2 Первые настройки
Создаем свой файл с настройками
```
nano /etc/nginx/sites-available/webapp
```

Копируем сами настройки (Незабываем заменить имя папки "webapp", в соотвецтвии с 1.5)
Вставлять текст в редактор SHIFT+Ins
```
server {
  listen 80;
  listen [::]:80;

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
Сохраняем Ctrl+S
Выходим Ctrl+X

Незабываем скопировтаь настройки с "Доступных" во "Включены"
```
ln -s /etc/nginx/sites-available/webapp /etc/nginx/sites-enabled/webapp
```

Проверяем что файл у нас в папке
```
ls
```

### 1.6 Запускаем Nginx и смотрим нашу страницу
Перейдем в корневой каталог 
```
cd
```

Проверым наш Nginx на синтаксические ошибки
```
nginx -t
```

Запускаем
```
systemctl start nginx
```

Проверяем все ли работает
```
systemctl status
```
Выйти со списка Ctrl+C

Теперь переходим по нашему IP и должны увидеть нашу html с текстом

#### Проблеммы с nginx
У меня на серевере был установлен webuzo что мешало роботе nginx хоть я и удалил apache
Сначало просто убивал процессы на 80 и 433 портах, что решало проблему и nginx работал
```
sudo fuser -k 80/tcp
```
```
sudo fuser -k 443/tcp
```
```
sudo service nginx restart
```
Но после перезагрузки серевера проблема возвращалась, и мне єто не нравилось.


Потом я подумал что проблемы в конфиге nginx и страдал с ним. По итогу 2 дней непонятных решений и мозгового штурма я вошел в панель webuzo и увидел что там включен apache
Ну виключл его к чертям и все заработало
## 2 Сервер готов к роботе загружаем свое приложение
### 2.1 Устанавливаем git
```
apt install git
```

Создадим папку нашего проекта в корневой папке 

```
сd
mkdir webapp
```

Перейдем в нашу папку
```
cd webapp
```
И скопируем наш репозиторий с Git
```
git clone <your repository> .
```
Проверим все ли на месте
```
ls
```
### 2.2 Nginx Настройки для нашего бекэнда
Вернемся в наш файл с настройками 
```
nano /etc/nginx/sites-available/webapp
```
И в server{...} добавим еще один путь "/api"
Незабываем изменить порт на котором работает наш бекенд и IP нашего VPS
```
location /api {
        proxy_pass http://31.131.24.118:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
  }
```
Сохраняем, закрываем, проверяем на ошибки.
```
nginx -t
```
Перезапускаем Nginx
```
systemctl reload nginx
```


### 2.3 Для роботы нашего React, Node приложений нужно установить Nodejs
На момент написания гайда в убунту уже есть пак с Node 10.19 версией и его оможно установить
```
apt install nodejs
```

А последней версией Node есть 16.17.1
Для установки текущей версии я воспользуюсь NVM(Node Version Manager)
Инструкция по установке есть тут https://github.com/nvm-sh/nvm 

Устанавливаем NVM
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
```

Можем просмотреть список доступных версий
```
nvm list-remote
```
И установить нужную нам (В моем случае 16.17.1)
```
nvm install v16.17.1
```

Проверим все ли установилось
```
node -v
```

И для роботы с Node установим NPM
```
nvm install-latest-npm
```
Проверим все ли установилось
```
npm -v
```
### 2.4 Запустим бекенд на нашем VPS

Перейдем в нашу папку куда скидивали репозиторий
```
cd webapp
```
Перейдем в папку с бекендом (в моем случае "api")
```
cd api
```

Начнем установку всех модулей нашего приложения 
```
npm i
```

И запустим его (В файле "package.json" должна быть строка в скриптах
  "start": "node index.js"
```
npm start
```

Можем убидится что все работает 
Перейдем по нашему IP с портом который мы указали и /api
http://31.131.24.118:3001/api

#### 2.4.1 Но если мы закроем консоль, то процес который мы запустили прекратится, что бы этого избежать нужно установить "pm2"
Устанавливаем
```
npm i -g pm2
```
Создаем новый пример
```
pm2 start --name api index.js   
```
```
pm2 startup ubuntu 
```

### 2.5
Установим клиентскую часть
Перейдем в слиентскую часть нашего репозитория
```
cd webapp/client
```

Установим зависимости
```
npm i
```

Соберем пак для загрузки в браузер
```
npm run build
```

Удалим все содержимое в нашей браузерной папке (где мы создавали первыый index.html)
```
rm -rf /var/www/webapp/*
```

Создадим папку клиентской части
```
mkdir /var/www/webapp/client
```

Скопируем наш пак с репозитория в клиентскую часть
```
cp -r build/* /var/www/webapp/client
```

Внесем правки в наш Nginx (добавим client/)
```
 location / {
        root /var/www/webapp/client/;
        index  index.html index.htm;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        try_files $uri $uri/ /index.html;
  }
```

Перейдем по нашему IP и должны видеть что все работает фронт и бекенд
### 2.6 Работаем с доменом
Заходим в наш вайл с настройками
```
nano /etc/nginx/sites-available/webapp
```

И переписываем (server_name "Ваш домен")(server_name "api.Ваш домен" для бекенда в моем случае)
```
server {
  listen 80;
  listen [::]:80;
  server_name test-andrew.space;
  location / {
    root /var/www/webapp/client;
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
  server_name api.test-andrew.space;
  location /api {
    proxy_pass http://31.131.24.118:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## 3 SSL Сертификат
Устанавливаем
```
apt install certbot python3-certbot-nginx
```
Вместо example.com вставляем наш домен (если используем субдомены прописываем их через "-d")
```
certbot --nginx -d example.com -d www.example.com
```
И пропишем команду для автоматического обновления сертификатов
```
systemctl status certbot.timer
```

