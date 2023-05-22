---
title: 配置docker环境下的jenkins
date: 2023-05-18T14:34
category: coding
layout: article
series: nest-react-in-action
authors: Barry
---

## 启动命令

```bash
sudo docker run -d  -p 8080:8080  -v ~/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock  -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose --name my-jenkins  jenkinsci/blueocean
```

如果你对 docker 不太明白也没关系，下面解释了各种指令的背后的含义

- -d: 以后台模式（守护进程）运行容器。

- -p 8080:8080: 将容器的 8080 端口映射到主机的 8080 端口，用于访问 Jenkins Web UI。

- -v ~/jenkins:/var/jenkins_home: 将主机上的 ~/jenkins 目录挂载到容器内的 /var/jenkins_home 目录，用于持久化 Jenkins 的数据。

- -v /var/run/docker.sock:/var/run/docker.sock: 将主机上的 Docker 守护进程的 UNIX 套接字挂载到容器内的相同路径，以便容器可以与主机上的 Docker 守护进程进行通信。

- -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose: 将主机上的 docker-compose 可执行文件挂载到容器内的相同路径，以便容器内部可以使用该命令。

- --name my-jenkins: 指定容器的名称为 "my-jenkins"。

jenkinsci/blueocean: 使用 jenkinsci/blueocean 镜像创建容器。这是一个包含了 Jenkins 和 Blue Ocean 插件的官方镜像，提供了一个现代化的 Jenkins Web UI。

## 如何链接 github

一般我们链接 github 就是为了 clone 代码，所以 clone 代码有两种方式

一种是直接 clone https 的方式，一种是 clone ssh 的方式，我们在点击 clone 的时候会看到这两个 tab。

clone https 的好处就是不用配置 ssh key，直接 clone 下来，但是没法 clone 私有仓库。

如果你的 jenkins 要部署的项目代码来自你的私有仓库，那么你就只有一个选择就是 ssh 的方式。

废话不多说，直接开始。

### 创建 ssh-key

我们的 jenkins 是放在 docker 容器里面的，所以我们需要先进入到 jenkins 的容器里面

```bash
sudo docker exec -it my-jenkins bash
```

这里我建议你把这段命令保存起来，我就是经常会用到这个命令，但是不属于很频繁的那种（经常忘记核心的命令参数是啥）

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

一路回车就行，其他的不用管(记得写的邮箱别忘记了)。

### 创建凭证

```bash
cat ~/.ssh/id_rsa.pub
```

获取到你的公匙内容，复制到 github setting ssh key 创建。

这里你如果链接过 github 就不用我多说了，我就截个图。

[![p9f8HdP.png](https://s1.ax1x.com/2023/05/18/p9f8HdP.png)](https://imgse.com/i/p9f8HdP)

接下来打开新建凭证

[![p9f8XRg.png](https://s1.ax1x.com/2023/05/18/p9f8XRg.png)](https://imgse.com/i/p9f8XRg)

凭证分为两类一类是用户，一类是系统，至于如何取舍看你自己，我是个人用这个 jenkins 所以我随便选个人

[![p9f8xMj.png](https://s1.ax1x.com/2023/05/18/p9f8xMj.png)](https://imgse.com/i/p9f8xMj)

点击用户民进去之后，直接点击全局就好了

[![p9fGkJU.png](https://s1.ax1x.com/2023/05/18/p9fGkJU.png)](https://imgse.com/i/p9fGkJU)

点击添加凭证

[![p9fGJQH.png](https://s1.ax1x.com/2023/05/18/p9fGJQH.png)](https://imgse.com/i/p9fGJQH)

选择第三个 key 和 username

[![p9fJy4K.png](https://s1.ax1x.com/2023/05/18/p9fJy4K.png)](https://imgse.com/i/p9fJy4K)

[![p9fJhDA.png](https://s1.ax1x.com/2023/05/18/p9fJhDA.png)](https://imgse.com/i/p9fJhDA)

这里需要注意一个事情，就是我们在 jenkins 创建 ssh key 是包含了私匙和公匙，而我们 jenkins 需要的就是私匙，在 github 上创建的就是公匙。

关于私匙和公匙，大家可以查看一下 https 的公匙和私匙的概念（我也会写一篇文章）。

**~/.ssh/id_rsa.pub** 就是公匙，看到结尾的 pub 了吗，pub 就是 public，因为私匙的文件叫做 id_rsa

使用命令获取

```bash
cat ~/.ssh/id_rsa
```

注意这两个结尾和开头也算作私匙的一部分，不要忘记了

```
-----BEGIN OPENSSH PRIVATE KEY-----
xxxxx正文
-----END OPENSSH PRIVATE KEY-----
```

[![p9fYFv4.png](https://s1.ax1x.com/2023/05/18/p9fYFv4.png)](https://imgse.com/i/p9fYFv4)

id 就写 github，图中我忘记填了，不过没有写没关系，他会自动使用登录名词作为 id

这里提示一下，github 的 username 就是你 profile url 里面那个 username

```
https://github.com/BarrySong97
```

我就是 BarrySong97

### 复制私密 env 文件到 jenkins 容器里面

当我们是公有项目在 github 上的时候，我们通常不会把服务器相关的配置传上去，但是部署的时候我们需要，所以我们要手动把 env 文件传上去

也就是我们需要把文件传进 jenkins 的容器里面（jenkins 在 docker 容器里面）

```bash
sudo docker cp ./.env my-jenkins:/var/jenkins_home/workspace/breeze后端
```

这是一种思路，但是别忘记了我们在配置 jenkins 的时候挂载文件目录在宿主环境里面

我们直接把.env 文件传到服务器上，然后移动到挂载的目录就行了。

一般我们 jenkins clone 的代码在 /var/jenkins_home/workspace/ 之下

```bash
cp <源文件> <目标文件>
```
