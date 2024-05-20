import defaultParser, { BaseNode, ChildrenHolderNode, TextNode } from "bbcode-ast";

function exportValidTextFromBBCodeNode(node: BaseNode): string {
  if (node instanceof TextNode) {
    // Remove all whitespace characters
    return node.text.replace(/\s+/g, "");
  }

  if (node instanceof ChildrenHolderNode) {
    return node.children.filter(child => !(child instanceof ChildrenHolderNode) || (child.name !== "quote" && child.name !== "img")).map(exportValidTextFromBBCodeNode).join("");
  }

  throw new Error(`Unexpected node type: ${node.name}`);
}

export default function validText(text: string) {
  const ast = defaultParser.parse(text);
  return exportValidTextFromBBCodeNode(ast).length >= 15;
}
