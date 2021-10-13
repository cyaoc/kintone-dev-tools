# kintone-dev-tools

kintone 开发工具集

## Usage

以子命令的方式提供各种服务

```
npx kintone-dev-tools ${command} <option>
```

## Features

- cert
  生成开发用证书
  -i --install 安装 ca 证书，mac 下需要输入当前用户的密码
  -u --uninstall 卸载证书

- serve <source>
  启动静态服务器

- watch <source>
  监听目录并自动上传 js & css 文件

## LICENSE

MIT License
