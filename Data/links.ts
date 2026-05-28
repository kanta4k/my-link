/**
 * 마이링크(MyLink) 제품 요구사항 정의서(PRD)의 
 * "Google Favicon API 기반 썸네일 아이콘 연동" 규격에 따라 설계된 링크 데이터 구조입니다.
 * 
 * URL 입력 시 Google Favicon API(https://www.google.com/s2/favicons?domain=도메인)를
 * 통해 자동으로 공식 아이콘을 추출하여 표시하는 것이 MVP 기본 스펙입니다.
 */

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string; // (선택) 커스텀 아이콘 경로 또는 특정 식별자가 필요할 경우를 위한 옵션 필드
}

export const dummyLinks: LinkItem[] = [
  {
    id: 'instagram',
    title: '인스타그램',
    url: 'https://instagram.com',
  },
  {
    id: 'youtube',
    title: '유튜브',
    url: 'https://youtube.com',
  },
  {
    id: 'blog',
    title: '블로그',
    url: 'https://velog.io',
  },
  {
    id: 'github',
    title: 'Github',
    url: 'https://github.com',
  },
  {
    id: 'portfolio',
    title: '포트폴리오',
    url: 'https://my-portfolio-example.com', // 해당 도메인의 파비콘을 자동으로 가져옴
  },
];

/**
 * [PRD 준수 유틸리티]
 * Google Favicon API를 사용하여 URL로부터 자동으로 파비콘 아이콘 URL을 생성하는 함수입니다.
 * sz 파라미터를 통해 고해상도 파비콘(기본 64px)을 요청할 수 있습니다.
 */
export function getFaviconUrl(targetUrl: string, size = 64): string {
  try {
    const urlObj = new URL(targetUrl);
    // Google Favicon API 형식: https://www.google.com/s2/favicons?domain=도메인&sz=크기
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${size}`;
  } catch (error) {
    // 유효하지 않은 URL일 경우 대체 이미지 혹은 빈 문자열 반환
    return '';
  }
}
