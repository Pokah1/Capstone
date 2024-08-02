import React, { useState, useEffect } from 'react';
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockNoteView, darkDefaultTheme, lightDefaultTheme, Theme ,} from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { uploadFiles } from '@/utils/uploadthing';
import styles from '@/components/contentEditor/editor.module.css';

const lightCustomTheme = {
  colors: {
    editor: {
      text: "#222222",
      background: "#ffeeee",
    },
    menu: {
      text: "#ffffff",
      background: "#010414",
    },
    tooltip: {
      text: "#ffffff",
      background: "#000",
    },
    hovered: {
      text: "#ffffff",
      background: "#00509E",
    },
    selected: {
      text: "#ffffff",
      background: "#00509E",
    },
    disabled: {
      text: "#A1A1A1",
      background: "#7D7D7D",
    },
    shadow: "#333333",
    border: "#00509E",
    sideMenu: "#bababa",
    highlights: lightDefaultTheme.colors!.highlights,
  },
  borderRadius: 4,
  fontFamily: "Helvetica Neue, sans-serif",
} satisfies Theme;

// The theme for dark mode, uses the light theme defined above with a few changes
const darkCustomTheme = {
  ...lightCustomTheme,
  colors: {
    ...lightCustomTheme.colors,
    editor: {
      text: "#ffffff",
      background: "#010414",
    },
    sideMenu: "#ffffff",
    highlights: darkDefaultTheme.colors!.highlights,
  },
} satisfies Theme;

// The combined "custom theme",
// we pass this to BlockNoteView and then the editor will automatically
// switch between lightCustomTheme / darkCustomTheme based on the system theme
const customTheme = {
  light: lightCustomTheme,
  dark: darkCustomTheme,
};

interface EditorProps {
  onChange: (blocks:PartialBlock[]) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  initialContent,
  editable = true, // Default to true if not provided
}) => {
  const [theme, setTheme] = useState<Theme>(window.matchMedia('(prefers-color-scheme: dark)').matches ? customTheme.dark : customTheme.light);

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: async (file: File) => {
      const [res] = await uploadFiles('imageUploader', { files: [file] });
      return res.url;
    }
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? customTheme.dark : customTheme.light);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div className={`${styles.editorContainer} ${styles.customBlockNoteTheme}`}>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={theme}
        // onChange={onChange}
      />
    </div>
  );
};

export default Editor;