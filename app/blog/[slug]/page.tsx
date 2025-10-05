import { blogArticles } from "../articles";
import { notFound } from "next/navigation";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { BlogPostClient } from "@/components/blog/BlogPostClient";
import fs from 'fs';
import path from 'path';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = blogArticles.find(article => article.slug === slug);
  
  if (!article) {
    notFound();
  }

  // Charger le contenu Markdown côté serveur
  const getMarkdownContent = (slug: string): string => {
    try {
      const contentPath = path.join(process.cwd(), 'app/blog/articles', `${slug}.md`);
      const content = fs.readFileSync(contentPath, 'utf8');
      
      // Remove frontmatter
      const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
      const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');
      
      return contentWithoutFrontmatter.trim();
    } catch (error) {
      console.error(`Erreur lors du chargement du contenu pour ${slug}:`, error);
      return `# ${slug}\n\n*Contenu en cours de développement...*`;
    }
  };

  const markdownContent = getMarkdownContent(article.slug);

  // Articles similaires
  const relatedArticles = blogArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <>
      <MarketingHeader currentPage="blog" />
      <BlogPostClient 
        article={article} 
        markdownContent={markdownContent} 
        relatedArticles={relatedArticles} 
      />
      <MarketingFooter />
    </>
  );
}