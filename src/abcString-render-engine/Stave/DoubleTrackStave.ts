import { INotation } from '../Notations/INotation';
import { NotationType } from '../Enums/NotationType';
import {
  StringsIndexChangeHandle,
  StaveCommand,
  UpdateAbcStringHandle
} from '../common';
import { InfoField } from '../Notations/InfoField';
import { InfoFiledType } from '../Enums/InfoFieldType';
import { Note } from '../Notations/Note';
import { BarLine } from '../Notations/BarLine';
import { RestNote } from '../Notations/RestNote';
import { InlineInfoField } from '../Notations/InlineInfoField';
import { StaveBase } from './StaveBase';

/**
 *
 * @description
 * a. 添加的任何 Notation 都可能引起 abcstring 变化
 * b. 添加的 Notation 的变化都可能引起 abcstring 变化
 */
export class StaveDoubleTrack extends StaveBase {
  public spacingStaves = new InfoField(
    InfoFiledType.spacing_staves,
    '{(PianoRightHand) (PianoLeftHand)}'
  );
  public rightHandHeader = new InfoField(
    InfoFiledType.voice,
    'PianoRightHand clef=treble'
  );
  public leftHandHeader = new InfoField(
    InfoFiledType.voice,
    'PianoLeftHand clef=bass'
  );
  public rightHand = new InlineInfoField(InfoFiledType.voice, 'PianoRightHand');
  public leftHand = new InlineInfoField(InfoFiledType.voice, 'PianoLeftHand');

  constructor() {
    super();
  }

  public init(dataraw: string = '[]') {
    var data = JSON.parse(dataraw);

    if (this.abcString) {
      return;
    }

    if (data.length) {
      for (const nState of data) {
        this.addNotation(this.deserializeNotation(nState));
      }
    } else {
      const headers = [
        this.id,
        this.title,
        this.composer,
        this.tempo,
        this.metre,
        this.unitNoteLength,
        this.spacingStaves,
        this.rightHandHeader,
        this.leftHandHeader,
        this.key,
        this.rightHand,
        this.leftHand
      ];
      for (const notation of this.notations.concat(headers)) {
        this.addNotation(notation);
      }
    }
    return this;
  }
  public save() {
    return JSON.stringify(this.notations);
  }

  //TODO：看能否合并到基类去
  public generationLyrics() {
    // 删除原有的歌词信息
    this.notations.map((v, i) => {
      if (
        v instanceof InfoField &&
        v.fieldType == InfoFiledType.words_aftertune
      ) {
        this.deleteNotation(v);
      }
    });

    // 添加进所有的歌词信息
    let lyrics = []; // 每一行的歌词内容集
    for (let i = 0; i < this.notations.length; i++) {
      const n = this.notations[i];
      const n_next = this.notations[i + 1];

      // a.记录下每个音符的lyric 到 lyrics, 空的用占位符号替代
      if (n instanceof Note) {
        lyrics.push(n.lyrics || '*');
      }

      // b. 到换行处/终点 的时候就 添加进这一行的lyrics
      const isBarlineEnd = n instanceof BarLine && n.hasNewlineInEnd;
      const isLeftHandEnd = !n_next;
      const isRightHandEnd =
        n_next instanceof InfoField && n_next.fieldType == InfoFiledType.voice && n_next.getContent() === "PianoLeftHand";
      if (isBarlineEnd || isLeftHandEnd || isRightHandEnd) {
        var lyricWords = lyrics.join(' ');
        var lyricsInfoField = new InfoField(
          InfoFiledType.words_aftertune,
          lyricWords
        );
        lyrics = []; // 重新记录下一行lyrics

        // 如果结尾是小节线才添加歌词，其他情况暂不加（用作编辑完成，再添加歌词的场景）
        if (n instanceof BarLine) {
          n.hasNewlineInEnd || n.setNewlineInEnd(); // 手动换行
          this.insertNotationAfter(n, lyricsInfoField);
          i++;
        };
      }

    }
  }
}
