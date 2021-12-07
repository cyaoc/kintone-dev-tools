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

- serve <source>
  启动静态服务器

- watch <source>
  监听目录并自动上传 js & css 文件
  
  - 启动watch命令时会在指定的监听目录下自动生成名为.devtoolsrc.js的配置文件
  - 程序启动时，监听目录下现存的文件不会上传
  - .devtoolsrc.js自动会被忽略，不会上传到任何地方
  - .devtoolsrc.js改动后，程序会自动加载，无需重启程序
  - .devtoolsrc.js文件的字段定义如下


  |  字段   | 功能  |
  |  ----  | ----  |
  | env  | kintone信息 |
  | env.baseurl  | kintone url |
  | env.username  | kintone 账户名 |
  | env.password  | 密码 |
  | map  | array,文件与kintone app的映射关系 |
  | type  | portal 或 app，占位用，目前没实际用处 |
  | appid  | 正整数，kintone的app id号，没有填写appid或者<=0就自动上传到portal |
  | folder  | 和src相冲突，该字段指定的文件夹下所有文件均会上传到同一个kintone app中 |
  | src  | array，和folder冲突，该字段指定的所有文件均会上传到同一个kintone app中 |
  | ignore  | array，这些文件不会被上传 |
  | upload  | 你可以指定上传到‘desktop’或‘mobile’，当省略upload字段时，会同时上传到‘desktop’和‘mobile’ |


## LICENSE

MIT License
