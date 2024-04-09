export function substringAfter(value: string, delimiter: string): string {
  const index = value.indexOf(delimiter);
  return index === -1 ? "" : value.substring(index + delimiter.length);
}

export function substringBefore(value: string, delimiter: string): string {
  const index = value.indexOf(delimiter);
  return index === -1 ? "" : value.substring(0, index);
}

export function substringBeforeLast(value: string, delimiter: string): string {
  const index = value.lastIndexOf(delimiter);
  return index === -1 ? "" : value.substring(0, index);
}

export function substringAfterLast(value: string, delimiter: string): string {
  const index = value.lastIndexOf(delimiter);
  return index === -1 ? "" : value.substring(index + delimiter.length);
}
