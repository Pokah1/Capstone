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

// import { PartialBlock } from "@blocknote/core";



// // Define the structure of the content blocks
// type ContentBlock = {
//   type: "text" | "link";
//   text?: string;
//   link?: string;
// };

// // Define the structure of the block properties
// interface Block {
//   type: string// Example: 'heading', 'paragraph', etc.
//   content?: ContentBlock[];
//   props?: BlockProps;
// }

// interface BlockProps {
//   textColor?: string;
//   backgroundColor?: string;
//   textAlignment?: string;
//   level?: number; // For headings, to define the level of heading (1-6)
// }
// export type PartialBlockWithContent = Block;

// export const serializeContent = (blocks: PartialBlockWithContent[]): string => {
//   return blocks.map(block => {
//     if (!block.type) return ''; // Handle missing type
//     if (!block.content) return ''; // Ensure content is defined

//     switch (block.type) {
//       case 'heading': {
//         const level = block.props?.level ?? 1; // Default to level 1 if undefined
//         const headingText = block.content
//           .filter((c): c is { type: "text"; text: string } => c.type === "text" && c.text !== undefined) // Type guard
//           .map(c => c.text)
//           .join('');
//         const textColor = block.props?.textColor ? ` style="color: ${block.props.textColor};"` : '';
//         return `<h${level}${textColor}>${headingText}</h${level}>`;
//       }

//       case 'paragraph': {
//         const paragraphText = block.content
//           .filter((c): c is { type: "text"; text: string } => c.type === "text" && c.text !== undefined) // Type guard
//           .map(c => c.text)
//           .join('');
//         const textColor = block.props?.textColor ? ` style="color: ${block.props.textColor};"` : '';
//         return `<p${textColor}>${paragraphText}</p>`;
//       }

//       default:
//         return '';
//     }
//   }).join('');
// };
