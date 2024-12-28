'use client';

import './placeholder.css';
import { cn } from '@repo/design-system/lib/utils';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Typography } from '@tiptap/extension-typography';
import { type AnyExtension, EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import type React from 'react';

export default function RichTextEditor({
  content,
  setContent,
  placeholder,
  className,
  characterLimit,
  proseInvert,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  className?: string;
  characterLimit?: number;
  proseInvert?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit as AnyExtension,
      Highlight,
      Typography,
      Link.configure({
        HTMLAttributes: {
          class: 'cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
      CharacterCount.configure({
        limit: characterLimit || undefined,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert focus:outline-none${proseInvert ? ' prose-invert' : ''}`,
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <EditorContent
      editor={editor}
      className={cn(
        'h-full w-full p-0 font-light text-sm outline-none',
        className
      )}
    />
  );
}
