'use client';

import { useRef } from 'react';
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
  codeBlockPlugin,
  codeMirrorPlugin,
  linkPlugin,
  linkDialogPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export default function Editor({ markdown, onChange }: EditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      className="mdx-editor min-h-[500px]"
      contentEditableClassName="prose prose-sm dark:prose-invert max-w-none p-4"
      placeholder="Start typing your notes..."
      plugins={[
        headingsPlugin({
          allowedHeadingLevels: [1, 2, 3],
        }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        codeBlockPlugin(),
        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', ts: 'TypeScript', py: 'Python', css: 'CSS' } }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <div className="flex flex-wrap items-center gap-1">
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <InsertThematicBreak />
            </div>
          ),
        }),
      ]}
    />
  );
}
