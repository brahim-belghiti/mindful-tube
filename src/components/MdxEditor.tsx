'use client';

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  codeBlockPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

function NotesEditor() {
  return (
    <MDXEditor
      markdown=""
      className='mdx-editor min-h-[600px] '
      plugins={[
        headingsPlugin({
          allowedHeadingLevels: [1, 2, 3, 4, 5, 6],
        }),
        listsPlugin(),
        codeBlockPlugin(),
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              {' '}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
            </>
          )
        })

      ]}
    />
  );
}

export default NotesEditor;
