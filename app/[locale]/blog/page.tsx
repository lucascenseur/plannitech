"use client";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MultilingualHeader } from "@/components/layout/MultilingualHeader";
import { MultilingualFooter } from "@/components/layout/MultilingualFooter";
import { 
  AnimatedSection, 
  AnimatedText, 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedIcon,
  AnimatedGrid,
  AnimatedGridItem
} from "@/components/ui/animations";
import { 
  Calendar, 
  Search,
  Clock,
  User,
  ArrowRight,
  Tag,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { blogArticles, blogCategories, blogSEO } from "./data";

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  // Vérifier que la locale est supportée
  const supportedLocales = ['fr', 'en', 'es'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Définir les traductions selon la locale
  const getTranslations = (locale: string) => {
    switch (locale) {
      case 'en':
        return {
          title: "Blog - Live Performance Management",
          subtitle: "Discover the latest trends and best practices in live performance management.",
          searchPlaceholder: "Search articles...",
          categories: "Categories",
          allCategories: "All",
          featured: "Featured Article",
          recent: "Recent Articles",
          readMore: "Read more",
          readTime: "min read",
          by: "by",
          searchResults: "Search Results",
          noResults: "No articles found matching your search.",
          language: "Language"
        };
      case 'es':
        return {
          title: "Blog - Gestión de Espectáculos en Vivo",
          subtitle: "Descubre las últimas tendencias y mejores prácticas en la gestión de espectáculos en vivo.",
          searchPlaceholder: "Buscar artículos...",
          categories: "Categorías",
          allCategories: "Todas",
          featured: "Artículo Destacado",
          recent: "Artículos Recientes",
          readMore: "Leer más",
          readTime: "min de lectura",
          by: "por",
          searchResults: "Resultados de Búsqueda",
          noResults: "No se encontraron artículos que coincidan con tu búsqueda.",
          language: "Idioma"
        };
      default: // fr
        return {
          title: "Blog - Gestion du Spectacle Vivant",
          subtitle: "Découvrez les dernières tendances et meilleures pratiques en gestion du spectacle vivant.",
          searchPlaceholder: "Rechercher des articles...",
          categories: "Catégories",
          allCategories: "Toutes",
          featured: "Article en vedette",
          recent: "Articles récents",
          readMore: "Lire la suite",
          readTime: "min de lecture",
          by: "par",
          searchResults: "Résultats de recherche",
          noResults: "Aucun article trouvé correspondant à votre recherche.",
          language: "Langue"
        };
    }
  };

  const t = getTranslations(locale);

  // Utiliser les données des articles réels
  const featuredArticle = blogArticles.find(article => article.featured);
  const otherArticles = blogArticles.filter(article => !article.featured);

  // Filtrer les articles selon la recherche et la catégorie
  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MultilingualHeader currentPage="blog" locale={locale} />

      {/* Hero Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t.title}
            </h1>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </AnimatedText>
        </div>
      </AnimatedSection>

      {/* Search and Filter Section */}
      <AnimatedSection className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "Tous" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("Tous")}
                  size="sm"
                >
                  {t.allCategories}
                </Button>
                {blogCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Article */}
      {featuredArticle && !searchTerm && selectedCategory === "Tous" && (
        <AnimatedSection className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedText className="mb-8" delay={0.2}>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                  {t.featured}
                </h2>
              </AnimatedText>

              <AnimatedCard delay={0.3}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <div className="h-64 md:h-full relative overflow-hidden">
                        <img
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 hidden">
                          <div className="text-white">
                            <Badge className="mb-2" variant="secondary">
                              {featuredArticle.category}
                            </Badge>
                            <h3 className="text-white font-semibold text-lg line-clamp-2">
                              {featuredArticle.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">{featuredArticle.category}</Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {featuredArticle.readingTime}
                        </span>
                      </div>
                      <CardTitle className="text-2xl mb-3 line-clamp-2">
                        {featuredArticle.title}
                      </CardTitle>
                      <CardDescription className="text-base mb-4 line-clamp-3">
                        {featuredArticle.description}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {featuredArticle.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(featuredArticle.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredArticle.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/blog/${featuredArticle.slug}`}>
                        <Button className="w-full">
                          {t.readMore}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </AnimatedCard>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Articles Grid */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedText className="mb-8" delay={0.2}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                {searchTerm ? t.searchResults : t.recent}
              </h2>
            </AnimatedText>

            {filteredArticles.length === 0 ? (
              <AnimatedText className="text-center py-12" delay={0.3}>
                <div className="text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">{t.noResults}</p>
                </div>
              </AnimatedText>
            ) : (
              <AnimatedGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <AnimatedGridItem key={article.id} delay={0.1 * index}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 hidden">
                          <div className="text-white">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-sm line-clamp-2 text-center">
                              {article.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <span className="text-sm text-gray-500">{article.readingTime}</span>
                        </div>
                        <CardTitle className="text-xl line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {article.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(article.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {article.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Link href={`/blog/${article.slug}`}>
                          <Button variant="outline" className="w-full">
                            {t.readMore}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </AnimatedGridItem>
                ))}
              </AnimatedGrid>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Newsletter CTA */}
      <AnimatedSection className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <AnimatedIcon className="mb-4">
              <BookOpen className="w-12 h-12 text-white mx-auto" />
            </AnimatedIcon>
            <AnimatedText className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t.title}
              </h2>
              <p className="text-xl text-blue-100">
                {t.subtitle}
              </p>
            </AnimatedText>
            <AnimatedButton className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 rounded-lg border-0"
              />
              <Button variant="secondary">
                S'abonner
              </Button>
            </AnimatedButton>
            <p className="text-sm text-blue-200 mt-4">
              Pas de spam, désinscription à tout moment.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <MultilingualFooter locale={locale} />
    </div>
  );
}
