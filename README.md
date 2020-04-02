> 对 [abcjs](https://github.com/paulrosen/abcjs) 中音乐乐符字符串内容封装, 为了更方便和更直观地制谱。

```ts
const stave = new Stave()
stave.init()
stave.addNotation(new Note(NoteKey.C3))
```

> 虽然abcjs提供的主要交互方式就是点击, 但是不代表仅能实现点击交互, 还可以间接实现快捷键等功能

## install
```bash
> npm i abcjs-string-provider
```
