export function createGoogleIcon(iconName: string, className: string): HTMLSpanElement {
  const icon = document.createElement('span');
  icon.className = `material-symbols-outlined ${className}`;
  icon.innerText = iconName;
  return icon;
}

export function appendChildren(container: HTMLElement, elementList: HTMLElement[]) {
  elementList.forEach(element => {
    container.appendChild(element);
  });
}

export function createElementAndSetClassName(elementName: string, className: string) {
  const element = document.createElement(elementName);
  element.className = className;
  return element;
}