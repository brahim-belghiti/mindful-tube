// components/editor.tsx
'use client';

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
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
import { useRef } from 'react';

export default function mdxEditor() {
  const editorRef = useRef<MDXEditorMethods>(null);

  return (
    <div className="p-4 h-full overflow-y-auto">
      <MDXEditor
        ref={editorRef}
        markdown=""
        className="mdx-editor min-h-[600px]"
        contentEditableClassName="prose dark:prose-invert max-w-none"
        plugins={[
          // Enable markdown shortcuts
          markdownShortcutPlugin(),

          // Headings plugin with all levels enabled
          headingsPlugin({
            allowedHeadingLevels: [1, 2, 3, 4, 5, 6],
          }),

          // Lists plugin with all features
          listsPlugin({
            allowedListTypes: ['bullet', 'number'],
            unorderedListCommand: 'bulletList',
            orderedListCommand: 'numberList',
          }),

          // Thematic breaks (horizontal rules)
          thematicBreakPlugin(),

          // Toolbar with all our desired options
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
