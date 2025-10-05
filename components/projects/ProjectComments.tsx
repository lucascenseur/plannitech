"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Reply,
  Clock,
  User,
  Pin
} from "lucide-react";

interface ProjectCommentsProps {
  projectId: string;
  projectName: string;
}

interface ProjectComment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  isPinned: boolean;
  replies: ProjectComment[];
  parentId?: string;
}

export function ProjectComments({ projectId, projectName }: ProjectCommentsProps) {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingComment, setEditingComment] = useState<ProjectComment | null>(null);
  const [replyingTo, setReplyingTo] = useState<ProjectComment | null>(null);
  const [newComment, setNewComment] = useState({
    content: "",
    isPinned: false,
  });

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newComment,
          parentId: replyingTo?.id,
        }),
      });

      if (response.ok) {
        setNewComment({ content: "", isPinned: false });
        setShowCreateForm(false);
        setReplyingTo(null);
        await loadComments();
      }
    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setEditingComment(null);
        await loadComments();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handlePinComment = async (commentId: string, isPinned: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}/pin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned }),
      });

      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error("Erreur lors de l'épinglage:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Il y a moins d'une heure";
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
    
    return formatDate(date);
  };

  const renderComment = (comment: ProjectComment, isReply = false) => (
    <div key={comment.id} className={`space-y-3 ${isReply ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            {comment.isPinned && (
              <Badge variant="outline" className="text-xs">
                <Pin className="h-3 w-3 mr-1" />
                Épinglé
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>
          
          {editingComment?.id === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editingComment.content}
                onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                rows={3}
                className="text-sm"
              />
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateComment(comment.id, editingComment.content)}
                >
                  Sauvegarder
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingComment(null)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(comment)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Répondre
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingComment(comment)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePinComment(comment.id, !comment.isPinned)}
                >
                  <Pin className="h-3 w-3 mr-1" />
                  {comment.isPinned ? "Désépingler" : "Épingler"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Commentaires du projet</CardTitle>
              <CardDescription>
                Discussions et commentaires pour "{projectName}"
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau commentaire
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-2">
                <Label htmlFor="comment-content">Commentaire</Label>
                <Textarea
                  id="comment-content"
                  placeholder="Ajoutez un commentaire..."
                  rows={4}
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-pinned"
                  checked={newComment.isPinned}
                  onChange={(e) => setNewComment({ ...newComment, isPinned: e.target.checked })}
                />
                <Label htmlFor="is-pinned" className="text-sm">
                  Épingler ce commentaire
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleCreateComment} disabled={!newComment.content}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Publier
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle>Commentaires</CardTitle>
          <CardDescription>
            {comments.length} commentaire{comments.length > 1 ? "s" : ""} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {comments.map((comment) => renderComment(comment))}
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {replyingTo && (
        <Card>
          <CardHeader>
            <CardTitle>Répondre à {replyingTo.author.name}</CardTitle>
            <CardDescription>
              Répondre au commentaire du {formatDate(replyingTo.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reply-content">Réponse</Label>
                <Textarea
                  id="reply-content"
                  placeholder="Ajoutez une réponse..."
                  rows={3}
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handleCreateComment} disabled={!newComment.content}>
                  <Reply className="h-4 w-4 mr-2" />
                  Répondre
                </Button>
                <Button variant="outline" onClick={() => setReplyingTo(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

