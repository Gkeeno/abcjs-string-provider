export enum InfoFiledType {
  /**
   * ====================================================
   * 
   *  Information & Headers
   * 
   * ====================================================
   */
  book = 'B:',
  composer = 'C:',
  discography = 'D:',
  file_URL = 'F:',
  group = 'G:',
  history = 'H:',
  instruction = 'I:',
  key = 'K:', // last header
  note_unit_length = 'L:',
  metre = 'M:',
  macro = 'm:',
  notes = 'N:',
  origin = 'O:',
  parts = 'P:',
  tempo = 'Q:',
  rhythm = 'R:',
  remark = 'r:',
  source = 'S:',
  symbol_line = 's:',
  title = 'T:',
  user_defined = 'U:',
  voice = 'V:',
  words_inline = 'W:',
  words_aftertune = 'w:',
  reference_number = 'X:',
  transcriber = 'z:',
  /**
   * ====================================================
   * 
   *  Formatting
   * 
   * ====================================================
   */
  // ########### Page Format

  // ########### Fonts

  // ########### Spacing
  spacing_staves = '%%staves', // 设置双手谱 连谱线

  spacing_stretchlast = '%%stretchlast',
  // ########### Measures/Bars

  // ########### Text

  // ########### Misc

}
