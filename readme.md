# Bizplus ホームページ

![https://img.shields.io/npm/v/npm.svg](https://img.shields.io/npm/v/npm.svg)![https://img.shields.io/badge/build-pass-brightgreen.svg](https://img.shields.io/badge/build-pass-brightgreen.svg)

### 系统安装
1. 创建Sakura VPS(CentOS7 x86_64)
2. 使用SSH登录VPS
3. 关闭防火墙 `service firewalld stop`
4. 安装NODEJS `curl -sL https://rpm.nodesource.com/setup_10.x | bash -` `yum install -y nodejs `
5. 安装pm2 `npm i -g pm2`
6. 使用SFTP登录VPS
7. 创建服务器目录 `mkdir /usr/local/site`
8. 进入服务器目录 `cd /usr/local/site`
9. 进入本地HP目录 `lcd 本地网站代码目录`
10. 上传HP文件 `put -r ./*`
11. 使用SSH登录VPS，启动HP服务器 `pm2 start /usr/local/site/biz.js `

> 上述过程的全部执行命令如下
```
service firewalld stop
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
yum install -y nodejs  
npm i -g pm2
mkdir /usr/local/site
cd /usr/local/site
lcd 本地网站代码目录
put -r ./*
pm2 start /usr/local/site/biz.js 
```


### Sakura SSL
1. 创建服务器密钥 `openssl genrsa -des3 -out server.key 2048`
2. 生成CSR文件 `openssl req -new -key server.key -out server.csr`

### 系统技术说明
Bizplus HP系统包括前端服务器模块和后端管理模块，前端服务器是使用Express框架，主要使用HTML5、CSS3、Jquery语言撰写，数据存储采用JSON和Localstorage模式; 后端管理模块采用React、Mobx、Antd、Less框架，基本兼容目前主要的浏览器平台，比如Chrome、Safria、Firefox等。

### 项目结构 BIZPLUS
**前端服务器**  
代码地址: [https://github.com/quanta2015/Web-Bizplus](https://github.com/quanta2015/Web-Bizplus)  
代码结构:   
```bash
├── admin           # 后台管理员
├── css             # css
├── data            # 数据和配置
├── imgs            # 图片文件
├── lib             # 库函数
├── node_modules    # express模块
├── tmpl            # 页面模板
├── upload          # 上传数据
├── views           # express页面模板
├── about.html      # 关于页面
├── access.html     # 地图页面
├── benefit.html    # 福利页面
├── business.html   # 商务页面
├── careers.html    # 招聘页面
├── contact.html    # 联系方式页面
├── index.html      # home页面
├── biz.js          # express服务代码
├── package.json    # 项目配置
```

**后端服务器**  
代码地址: [https://github.com/quanta2015/Web-Bizplus-Admin](https://github.com/quanta2015/Web-Bizplus-Admin)  
代码结构: 
```
├── build           # 编译后的代码     
├── config          # 项目配置
├── node_modules    # 项目库函数
├── public          # 项目页面
├── scripts         # webpack编译代码
├── src             # 项目代码
├── README.md       # 项目说明
└── package.json    # 项目配置
```


1. 修改 `src/constant/apis.js` 中的服务器地址
2. 编译项目 `npm run build`
3. 修改编译后 `build` 文件夹下的 `index.html`, 去掉链接中的 `/`
4. 将 `build` 文件夹的全部文件拷贝到 bizplus主页项目的 `admin` 文件夹下面









