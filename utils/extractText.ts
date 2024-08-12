import { PartialBlock } from "@blocknote/core";

export const extractTextContent = (blocks: PartialBlock[]): string => {
  let textContent = "";

  blocks.forEach((block) => {
    if (Array.isArray(block.content)) {
      block.content.forEach((contentBlock: any) => {
        if (contentBlock.type === "text") {
          textContent += contentBlock.text;
        }
      });
    }

    if (block.children && Array.isArray(block.children)) {
      textContent += extractTextContent(block.children);
    }
  });

  return textContent;
};
