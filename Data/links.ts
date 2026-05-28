/**
 * 마이링크(MyLink) 제품 요구사항 정의서(PRD)의 
 * "Google Favicon API 기반 썸네일 아이콘 연동" 규격에 따라 설계된 링크 데이터 구조입니다.
 */

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface SocialItem {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'youtube' | 'instagram' | 'blog' | 'email';
  url: string;
}

export const dummyLinks: LinkItem[] = [
  {
    id: 'link-1',
    title: 'Next.js 공식 문서',
    url: 'https://nextjs.org',
  },
  {
    id: 'link-2',
    title: 'Tailwind CSS 디자인 가이드',
    url: 'https://tailwindcss.com',
  },
  {
    id: 'link-3',
    title: '깃허브 개인 저장소 (Github)',
    url: 'https://github.com',
  },
  {
    id: 'link-4',
    title: '개발 기술 블로그 (Velog)',
    url: 'https://velog.io',
  },
  {
    id: 'link-5',
    title: '유튜브 채널',
    url: 'https://youtube.com',
  },
];

export const dummySocials: SocialItem[] = [
  {
    id: 'social-1',
    platform: 'github',
    url: 'https://github.com',
  },
  {
    id: 'social-2',
    platform: 'linkedin',
    url: 'https://linkedin.com',
  },
  {
    id: 'social-3',
    platform: 'twitter',
    url: 'https://twitter.com',
  },
  {
    id: 'social-4',
    platform: 'youtube',
    url: 'https://youtube.com',
  },
  {
    id: 'social-5',
    platform: 'instagram',
    url: 'https://instagram.com',
  },
];

export const defaultTags: string[] = ['Developer', 'Frontend', 'Next.js 16', 'Tailwind v4', 'UI/UX'];

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
