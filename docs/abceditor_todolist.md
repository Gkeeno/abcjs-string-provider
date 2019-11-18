> 后面的数字是预估实现天数

## 待实现符号
- [x] 二分音符附点  0.5
- [x] 四分音符附点
- [ ] 和弦音符      2
- [x] 反复小节线，终止小节线等 `|| :| |: :: |] [|`  2
- [ ] ~~三连音~~ 暂不用实现

## 待实现特征
- [x] 合音，延音(仅倆音之间能形成)  3
  - [ ] 能更改形成合音俩音的时值
  - [ ] 由stave添加boundary到notations改为 添加start boundary自己能添加end boundary 到notations
- [ ] 【和弦】合音，延音（仅俩和弦之间能形成）4
  - [ ] 能更改形成合音俩音的时值
  - [ ] 由stave添加boundary到notations改为 添加start boundary自己能添加end boundary 到notations

- [ ] 音符 备注/歌词(Lyrics下方)  4

## 待实现调性 1
- [ ] 左右手谱：能分别选调性
- [x] C major `C大调`
- [ ] A minor `A小调` (降b的调!?)
- [ ] ~~G major~~
- [ ] ~~D major~~
- [ ] ~~F major~~
- [ ] ~~A minor melodic `A旋律小调`~~
- [ ] ~~D minor melodic~~
- [ ] ~~A minor harmonic `A和声小调`~~
- [ ] ~~C# harmonic (enharmonic D)~~

## 待实现播放
- [x] 播放音符高亮、同步(如果最后结束是休止符不会高亮)
- [x] 双手谱播放
  - [x] 出现左手亮完了右手不亮了的情况，右手亮完了也是 (暂时改不了，这种情况需要谱子把俩条音轨的音符时值对齐解决)
