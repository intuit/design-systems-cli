declare module 'markdown-table' {
  type MarkdownTable = (data: any[]) => string;
  const markdownTable: MarkdownTable;

  export = markdownTable;
}
