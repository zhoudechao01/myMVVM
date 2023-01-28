/**
 * 是否为自闭合标签，内置一些自闭合标签，为了处理简单
 */
export function isUnaryTag(tagName: string) {
  // 暂时只处理input标签
  const unaryTag = ['input']
  return unaryTag.includes(tagName)
}

/**
 * 判断是否为平台的保留标签
 */
export function isReserveTag(tagName:string) {
  const reserveTag = [
    "div",
    "h3",
    "span",
    "input",
    "select",
    "option",
    "p",
    "button",
    "template",
  ];
  return reserveTag.includes(tagName);
}

