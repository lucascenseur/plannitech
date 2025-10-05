"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock,
  User,
  ArrowLeft,
  Tag,
  Share2,
  BookOpen,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Markdown } from "@/components/ui/markdown";

interface BlogPostClientProps {
  article: any;
  markdownContent: string;
  relatedArticles: any[];
}

export function BlogPostClient({ article, markdownContent, relatedArticles }: BlogPostClientProps) {
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Breadcrumb */}
      <div className="py-4 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au blog
                </Button>
              </Link>
            </div>
            
            <Badge className="mb-4">{article.category}</Badge>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {article.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {article.description}
              </p>
            </div>

            <div className="flex items-center space-x-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(article.date)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {article.readingTime}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button>
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Lire plus tard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Markdown content={markdownContent} />
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center mb-8">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Articles similaires</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle, index) => (
                  <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                      <div className="relative z-10 text-center p-4">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-semibold text-lg line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{relatedArticle.category}</Badge>
                        <span className="text-sm text-gray-500">{relatedArticle.readingTime}</span>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">
                        {relatedArticle.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {relatedArticle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {relatedArticle.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(relatedArticle.date)}
                        </div>
                      </div>
                      <Link href={`/blog/${relatedArticle.slug}`}>
                        <Button variant="outline" className="w-full">
                          Lire l'article
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <BookOpen className="w-12 h-12 text-white mx-auto" />
            </div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Restez informé
              </h2>
              <p className="text-xl text-blue-100">
                Recevez nos derniers articles et conseils directement dans votre boîte mail.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-lg border-0"
              />
              <Button variant="secondary">
                S'abonner
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              Pas de spam, désabonnement possible à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}