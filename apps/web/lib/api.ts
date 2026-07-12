const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  (typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_STRAPI_URL
    : "http://cms:1337") ||
  "http://localhost:1337";

const API_TOKEN = process.env.STRAPI_API_TOKEN || "";

interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
  };
}

async function fetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers, next: { revalidate: 60 } });
    if (!res.ok) {
      const errorData: StrapiError = await res.json().catch(() => ({
        error: { status: res.status, name: "FetchError", message: res.statusText },
      }));
      console.error(`Strapi API error: ${res.status} ${errorData.error.message}`);
      return null as T;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return null as T;
  }
}

function populateQuery(): string {
  return "populate=%2a";
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

export interface ImageData {
  id: number;
  name: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
}

export interface RichText {
  type: string;
  children: RichTextNode[];
}

export interface RichTextNode {
  type: string;
  children?: RichTextNode[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  url?: string;
  level?: number;
  format?: string;
  image?: ImageData;
  caption?: string;
  language?: string;
}

export interface HeroSection {
  id: number;
  name: string;
  title: string;
  positioningStatement: string;
  subtitle?: string;
  description?: string;
  profile_image: ImageData;
  availability_status: "available" | "busy" | "open";
  social_links: { platform: string; url: string }[];
  cta_buttons: { text: string; url: string; variant?: string }[];
}

export interface AboutSection {
  id: number;
  title: string;
  content: RichText;
  image: ImageData;
}

export interface FeaturedProjectsSection {
  id: number;
  title: string;
  projects: StrapiData<ProjectAttributes>[];
}

export interface LatestArticlesSection {
  id: number;
  title: string;
  count: number;
}

export interface ContactCTASection {
  id: number;
  title: string;
  description: string;
  button_label: string;
  button_url: string;
}

export interface SEOSection {
  id: number;
  meta_title: string;
  meta_description: string;
  meta_image: ImageData | null;
  canonical_url: string;
  no_index: boolean;
}

export interface HomepageAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero: HeroSection;
  about: AboutSection;
  skills: { id: number; title: string };
  experience: { id: number; title: string };
  featuredProjects: FeaturedProjectsSection;
  latestArticles: LatestArticlesSection;
  contactCta: ContactCTASection;
  seo: SEOSection;
}

export interface Skill {
  id: number;
  name: string;
  category: "frontend" | "backend" | "devops" | "design" | "tool" | "other";
  proficiency: number;
  icon: string | null;
  order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  skills: Skill[];
}

export interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: RichText;
  skills: string[];
  order: number;
}

export interface ArticleAttributes {
  title: string;
  slug: string;
  description: string;
  content: RichText;
  cover: ImageData | null;
  author: AuthorData | null;
  category: CategoryData | null;
  tags: TagData[];
  featured: boolean;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  no_index: boolean;
  doc_collection: DocCollectionData | null;
  doc_parent: DocParentData | null;
  children: StrapiData<ArticleAttributes>[];
  nav_order: number;
  version: string;
  repo_edit_url: string;
  related_articles: StrapiData<ArticleAttributes>[];
  reading_time: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorData {
  id: number;
  name: string;
  slug: string;
  bio: RichText | null;
  avatar: ImageData | null;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
  email: string;
}

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface TagData {
  id: number;
  name: string;
  slug: string;
}

export interface ProjectAttributes {
  title: string;
  slug: string;
  description: string;
  cover: ImageData | null;
  client: string;
  role: string;
  timeline: string;
  team: string;
  tech_stack: string[];
  problem: RichText;
  research: RichText;
  process: RichText;
  design_decisions: RichText;
  technical_decisions: RichText;
  results: RichText;
  metrics: { label: string; value: string; prefix?: string; suffix?: string }[];
  gallery: ImageData[];
  live_url: string;
  repo_url: string;
  related_projects: StrapiData<ProjectAttributes>[];
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  no_index: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocCollectionAttributes {
  name: string;
  slug: string;
  description: string | null;
  order: number;
  articles: StrapiData<ArticleAttributes>[];
}

export type DocCollectionData = DocCollectionAttributes;

export interface DocParentData {
  id: number;
  title: string;
  slug: string;
}

export interface SiteSettings {
  site_name: string;
  site_description: string;
  site_logo: ImageData | null;
  favicon: ImageData | null;
  social_links: { platform: string; url: string }[];
  seo_defaults: SEOSection;
}

export interface NavigationAttributes {
  items: { title: string; url: string; order: number; children?: { title: string; url: string; order: number }[] };
}

export async function getHomepage(): Promise<StrapiResponse<StrapiData<HomepageAttributes>> | null> {
  return fetchAPI<StrapiResponse<StrapiData<HomepageAttributes>>>(
    `/homepage?${populateQuery()}`
  );
}

export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<StrapiResponse<StrapiData<ArticleAttributes>[]> | null> {
  const query = new URLSearchParams();
  query.append("sort", "publishedAt:desc");
  if (params?.page) query.append("pagination[page]", String(params.page));
  if (params?.pageSize) query.append("pagination[pageSize]", String(params.pageSize));
  if (params?.category) query.append("filters[category][slug][$eq]", params.category);
  if (params?.tag) query.append("filters[tags][slug][$eq]", params.tag);
  if (params?.search) query.append("filters[$or][0][title][$containsi]", params.search);
  if (params?.search) query.append("filters[$or][1][description][$containsi]", params.search);
  const pop = populateQuery();
  return fetchAPI<StrapiResponse<StrapiData<ArticleAttributes>[]>>(
    `/articles?${pop}&${query.toString()}`
  );
}

export async function getArticle(slug: string): Promise<StrapiResponse<StrapiData<ArticleAttributes>> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ArticleAttributes>>>(
    `/articles?filters[slug][$eq]=${slug}&${populateQuery()}`
  ).then((res) => {
    if (!res?.data) return null;
    return { ...res, data: Array.isArray(res.data) ? res.data[0] : res.data } as StrapiResponse<StrapiData<ArticleAttributes>>;
  });
}

export async function getDocArticle(slug: string): Promise<StrapiResponse<StrapiData<ArticleAttributes>> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ArticleAttributes>>>(
    `/articles?filters[slug][$eq]=${slug}&filters[doc_collection][id][$notNull]=true&${populateQuery()}`
  ).then((res) => {
    if (!res?.data) return null;
    return { ...res, data: Array.isArray(res.data) ? res.data[0] : res.data } as StrapiResponse<StrapiData<ArticleAttributes>>;
  });
}

export async function getProjects(): Promise<StrapiResponse<StrapiData<ProjectAttributes>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ProjectAttributes>[]>>(
    `/projects?sort=publishedAt:desc&${populateQuery()}`
  );
}

export async function getProject(slug: string): Promise<StrapiResponse<StrapiData<ProjectAttributes>> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ProjectAttributes>>>(
    `/projects?filters[slug][$eq]=${slug}&${populateQuery()}`
  ).then((res) => {
    if (!res?.data) return null;
    return { ...res, data: Array.isArray(res.data) ? res.data[0] : res.data } as StrapiResponse<StrapiData<ProjectAttributes>>;
  });
}

export async function getCategories(): Promise<StrapiResponse<StrapiData<CategoryData>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<CategoryData>[]>>("/categories");
}

export async function getTags(): Promise<StrapiResponse<StrapiData<TagData>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<TagData>[]>>("/tags");
}

export async function getDocCollections(): Promise<StrapiResponse<StrapiData<DocCollectionAttributes>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<DocCollectionAttributes>[]>>(
    `/doc-collections?${populateQuery()}`
  );
}

export async function getFeaturedArticles(): Promise<StrapiResponse<StrapiData<ArticleAttributes>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ArticleAttributes>[]>>(
    `/articles?filters[featured][$eq]=true&sort=publishedAt:desc&pagination[pageSize]=3&${populateQuery()}`
  );
}

export async function getRelatedArticles(id: number): Promise<StrapiResponse<StrapiData<ArticleAttributes>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ArticleAttributes>[]>>(
    `/articles?filters[id][$ne]=${id}&sort=publishedAt:desc&pagination[pageSize]=3&${populateQuery()}`
  );
}

export async function getRelatedProjects(id: number): Promise<StrapiResponse<StrapiData<ProjectAttributes>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ProjectAttributes>[]>>(
    `/projects?filters[id][$ne]=${id}&sort=publishedAt:desc&pagination[pageSize]=3&${populateQuery()}`
  );
}

export async function getNavigation(): Promise<StrapiResponse<StrapiData<NavigationAttributes>> | null> {
  return fetchAPI<StrapiResponse<StrapiData<NavigationAttributes>>>("/navigation");
}

export async function getSiteSettings(): Promise<StrapiResponse<StrapiData<SiteSettings>> | null> {
  return fetchAPI<StrapiResponse<StrapiData<SiteSettings>>>(
    `/site-setting?${populateQuery()}`
  );
}

export async function getSkills(): Promise<StrapiResponse<StrapiData<SkillCategory>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<SkillCategory>[]>>(
    `/skill-categories?${populateQuery()}&sort=order:asc`
  );
}

export async function getExperience(): Promise<StrapiResponse<StrapiData<ExperienceItem>[]> | null> {
  return fetchAPI<StrapiResponse<StrapiData<ExperienceItem>[]>>(
    `/experiences?sort=order:asc&${populateQuery()}`
  );
}

export function getStrapiMediaUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}
