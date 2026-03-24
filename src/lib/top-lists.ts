export interface TopListItem {
  rank: number;
  title: string;
  subtitle: string;
}

export interface TopList {
  title: string;
  icon: string;
  href: string;
  items: TopListItem[];
}
