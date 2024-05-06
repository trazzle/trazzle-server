export function enhanceLogLevel(logEntry: string): string {
  // 로그 레벨 패턴을 찾아내기 위해 ANSI 코드를 무시하고 실제 텍스트 내용만 추출
  const regex = /\x1B\[\d+m(\w+)\x1B\[\d+m/;
  const match = logEntry.match(regex);

  if (match && match[1]) {
    // 로그 레벨을 대문자로 변환
    const uppercaseLevel = match[1].toUpperCase();

    // 원본 문자열에서 로그 레벨 부분만 대문자로 변경
    return logEntry.replace(match[1], uppercaseLevel);
  }

  return logEntry; // 매칭되는 로그 레벨이 없는 경우, 원본 반환
}
