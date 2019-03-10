```base
 $ jio-cli update 更新单个项目
 $ jio-cli update --all 更新所有项目
 $ jio-cli create 创建项目
 $ jio-cli create --local 创建本地template
 $ jio-cli db 显示项目列表
 $ jio-cli db --path 显示db路径
 $ jio-cli -V 显示脚手架版本
```
### update更新文件
```javascript
module.exports = {
  actions: [
    {
      //需要做处理的文件
      targetPath: "./files/index.js",
      type: "u",//a:添加 u:更新 r:替换
      //run 可以是string或 async function
      // 当是async function时，表示对目标文件做处理
      // 做处理后返回字符串
      async run(source, {}) {
        return source;
      },
      // 当是string时，表示替换或添加的文件
      run:"./files/index.js"
    }
  ]
};

```
