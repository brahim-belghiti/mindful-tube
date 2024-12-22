'use client';

import { useRef, useState } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  toolbarPlugin,
  MDXEditorMethods,
  InsertThematicBreak,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

const STORAGE_KEY = 'editor-content';

export default function EditorSection() {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [markdown, setMarkdown] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || '';
    }
    return '';
  });

  const handleChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    localStorage.setItem(STORAGE_KEY, newMarkdown);
  };

  return (
    <div className="p-2">
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={handleChange}
        className="mdx-editor min-h-[700px] max-h-[800px] overflow-y-hidden"
        plugins={[
          markdownShortcutPlugin(),
          headingsPlugin({
            allowedHeadingLevels: [1, 2, 3, 4, 5, 6],
          }),
          listsPlugin({
            allowedListTypes: ['bullet', 'number'],
          }),
          quotePlugin(),
          thematicBreakPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap gap-2">
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <InsertThematicBreak />
              </div>
            ),
          }),
        ]}
      />
    </div>
  );
}
