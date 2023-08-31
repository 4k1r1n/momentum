const createNode = (
  tagName: keyof HTMLElementTagNameMap = 'div',
  className: string[] = [],
  textContent: string = '',
): HTMLElement => {
  const node = document.createElement(tagName);
  node.classList.add(...className);
  node.textContent = textContent;

  return node;
};

export default createNode;
