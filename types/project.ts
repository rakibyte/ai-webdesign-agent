export type PageType = {
  id: string;
  name: string;
  slug?: string;
  content?: string;
  [key: string]: unknown;
};

export type ProjectType = {
  id?: string;
  slugId?: string;
  title?: string;
  pages?: PageType[];
  [key: string]: unknown;
};
