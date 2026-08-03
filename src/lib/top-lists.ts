export interface TopListItem {
  rank: number;
  title: string;
  subtitle: string;
  /**
   * Square box-art thumbnail rendered on the right of the row. Optional: a list
   * with no images renders exactly as it did before thumbnails existed.
   * Generate the files with `npm run thumbs:toplists`.
   */
  image?: string;
  /** Steam app ID the thumbnail is generated from. Not used at runtime. */
  steamAppId?: number;
  /** Source image for titles Steam does not carry. Not used at runtime. */
  thumbSource?: string;
  /** "icon" fits a logo whole instead of cropping it. Not used at runtime. */
  thumbFit?: "icon";
}

export interface TopList {
  title: string;
  icon: string;
  href: string;
  items: TopListItem[];
}
