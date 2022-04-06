
# nginx 安装

系统：Ubuntu 20.04 server 64bit

1. ## 安装nginx

```sh
sudo apt-get install nginx
```

2. ## 验证安装成功

```sj
nginx -v 
```
nginx version: nginx/1.18.0 (Ubuntu)

当出现类似输出的版本好 则说明 nginx 安装成功
默认安装目录 /etc/nginx

3. ## 配置使用nginx

```sh
vi blog.cong
```
输入以下内容

```conf
server {
    #服务启动时监听的端口
    listen 80 default_server;
    listen [::]:80 default_server;
    #服务启动时文件加载的路径
    root /var/www/html/blog;
    #默认加载的第一个文件wwhm
    index index.php index.html index.htm index.nginx-debian.html;
    #页面访问域名，如果没有域名也可以填写
    server_name xxxx;

    location / {
        #页面加载失败后所跳转的页面
        try_files $uri $uri/ =404;
    }
}
```
创建测试文件
1. 跳到刚刚配置的文件目录下
2. 创建文件夹
3. 创建index.html 并切入内容
```sh
cd /var/www/html 
mkdir blog
vi index.html
```
### 关闭默认进程

1. 查询nginx 进程
```sh
ps -ef | grep nginx
```

2. 关闭默认进程
master 的为主进程
```sh
kill -QUIT 主进程号
```

### 重新启动nginx

1. 查看nginx 配置文件 ```nginx.conf```

在nginx 文件夹内 运行 ```vi nginx.conf``` 打开nginx 配置文件
查看nginx.conf 是否有默认运行的配置文件与我们配置的 80 端口是否
重叠 如果有就删除默认

2. 然后运行启动nginx 
没有任何报错就算启动成功
```sh
nginx -c /etc/nginx/nginx.conf
```

