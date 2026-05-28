// Lucide는 상표권 및 패키지 경량화 문제로 인해 Instagram, Youtube, Github 등 브랜드 아이콘을 공식적으로 제공하지 않습니다.
// 따라서 icon 필드는 문자열(식별자)로 정의하며, 렌더링 시점에 적절한 SVG나 타사 아이콘 라이브러리(Simple Icons, FontAwesome 등)와 매핑하여 사용하는 것을 권장합니다.

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string; // 'instagram' | 'youtube' | 'blog' | 'github' | 'portfolio' 등 식별자 문자열
}

export const dummyLinks: LinkItem[] = [
  {
    id: 'instagram',
    title: '인스타그램',
    url: 'https://www.instagram.com',
    icon: 'instagram',
  },
  {
    id: 'youtube',
    title: '유튜브',
    url: 'https://www.youtube.com',
    icon: 'youtube',
  },
  {
    id: 'blog',
    title: '블로그',
    url: 'https://velog.io',
    icon: 'blog',
  },
  {
    id: 'github',
    title: 'Github',
    url: 'https://github.com',
    icon: 'github',
  },
  {
    id: 'portfolio',
    title: '포트폴리오',
    url: 'https://my-portfolio-example.com',
    icon: 'portfolio',
  },
];
