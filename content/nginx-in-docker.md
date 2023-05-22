---
title: 使用nginx代理你的网页或者服务
date: 2023-5-20T15:58
authors: Barry
category: coding
layout: article
series: nest-react-in-action
---

## 启动容器

```bash
 sudo docker run -d -p 80:80 --name my-nginx -p 443:443 --network breeze_default -v /home/lighthouse/jenkins/jenkins_home/site:/etc/nginx/conf.d -v ~/nginx/nginx.conf:/etc/nginx/nginx.conf nginx
```

- -d: 以后台模式（守护进程）运行容器。

- -p 80:80: 将容器的 80 端口映射到主机的 80 端口，用于 HTTP 流量。

- --name my-nginx: 指定容器的名称为 "my-nginx"。

- -p 443:443: 将容器的 443 端口映射到主机的 443 端口，用于 HTTPS 流量。

- --network breeze_default: 将容器连接到名为 "breeze_default" 的网络。这假设在 Docker 中已经创建了名为 "breeze_default" 的网络。

- -v ~/nginx:/etc/nginx/conf.d: 将主机上的 /home/lighthouse/jenkins/jenkins_home/site (也是 jenkins 容器的挂载目录，通过挂载目录共享数据) 目录挂载到容器内的 /etc/nginx/conf.d 目录，用于存储 Nginx 的配置文件。

- -v ~/nginx/nginx.conf:/etc/nginx/nginx.conf: 将主机上的 ~/nginx/nginx.conf 文件挂载到容器内的 /etc/nginx/nginx.conf 文件，用于配置 Nginx。

nginx: 使用 nginx 镜像创建容器。这是官方的 Nginx 镜像，用于运行 Nginx Web 服务器。

上面比较关键的两个一个是 network，如果你就是一个项目，其实你把你的 nginx 放在 docker-compose 就可以了，如果你是需要兼容多个项目 nginx 的话，建议单独配置 nginx 服务，我是为了兼容以前的配置所以单独加入了 network，如果你不需要可以去掉这个。

另外一个就是 volume 的挂载，我在部署前后端项目的时候，前端我是使用了镜像打包构建，这样我就不用再本地创建 nodejs 环境。

再者我的 jenkins 是放在 docker 里面的，所以 jenkins 如果要访问宿主环境比较麻烦，所以我使用 volume 来同步文件，也就是多个容器都访问一个挂载的文件夹，这样可以共享访问的文件。

关于 jenkins 在 docker 里面的问题可以看我的另外一篇文章。

[配置 docker 环境下的 jenkins](https://bs4real.netlify.app/config-docker-in-jenkins)

## 修改nginx.conf文件