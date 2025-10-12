"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n';
import { 
  Upload, 
  File, 
  X, 
  Download, 
  Eye,
  Trash2,
  Edit,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  createdAt: string;
  show?: {
    id: string;
    title: string;
  };
  venue?: {
    id: string;
    name: string;
  };
}

interface DocumentUploadProps {
  showId?: string;
  venueId?: string;
  onUpload?: (document: Document) => void;
  onUpdate?: (document: Document) => void;
  onDelete?: (documentId: string) => void;
}

export function DocumentUpload({ 
  showId, 
  venueId, 
  onUpload, 
  onUpdate, 
  onDelete 
}: DocumentUploadProps) {
  const { t } = useLocale();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'contract',
    description: '',
    tags: [] as string[],
    newTag: ''
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      // Créer FormData pour l'upload
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', file);
      formDataToUpload.append('name', formData.name || file.name);
      formDataToUpload.append('type', formData.type);
      formDataToUpload.append('description', formData.description);
      formDataToUpload.append('showId', showId || '');
      formDataToUpload.append('venueId', venueId || '');
      formDataToUpload.append('tags', JSON.stringify(formData.tags));
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formDataToUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const { document } = await response.json();
      setDocuments(prev => [document, ...prev]);
      
      toast({
        title: t('document_upload.success_title'),
        description: t('document_upload.success_description'),
      });

      onUpload?.(document);
      
      // Reset form
      setFormData({
        name: '',
        type: 'contract',
        description: '',
        tags: [],
        newTag: ''
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: t('document_upload.error_title'),
        description: t('document_upload.error_description'),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateDocument = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          description: formData.description,
          tags: formData.tags
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const { document: updatedDocument } = await response.json();
      setDocuments(prev => 
        prev.map(doc => doc.id === document.id ? updatedDocument : doc)
      );
      
      toast({
        title: t('document_upload.update_success_title'),
        description: t('document_upload.update_success_description'),
      });

      onUpdate?.(updatedDocument);
      setEditingDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: t('document_upload.update_error_title'),
        description: t('document_upload.update_error_description'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: t('document_upload.delete_success_title'),
        description: t('document_upload.delete_success_description'),
      });

      onDelete?.(documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: t('document_upload.delete_error_title'),
        description: t('document_upload.delete_error_description'),
        variant: 'destructive',
      });
    }
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType.includes('pdf')) {
      return '📄';
    } else if (mimeType.includes('word')) {
      return '📝';
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return '📊';
    } else {
      return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('document_upload.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('document_upload.drag_drop_title')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('document_upload.drag_drop_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.getElementById('file-input')?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('document_upload.select_files')}
              </Button>
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileInput}
                multiple
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card className="bg-white text-gray-900">
        <CardHeader>
          <CardTitle>{t('document_upload.document_info')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('document_upload.name_label')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white text-gray-900 border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="type">{t('document_upload.type_label')}</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">{t('document_upload.type_contract')}</SelectItem>
                  <SelectItem value="technical">{t('document_upload.type_technical')}</SelectItem>
                  <SelectItem value="financial">{t('document_upload.type_financial')}</SelectItem>
                  <SelectItem value="legal">{t('document_upload.type_legal')}</SelectItem>
                  <SelectItem value="other">{t('document_upload.type_other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">{t('document_upload.description_label')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="bg-white text-gray-900 border-gray-300"
            />
          </div>

          <div>
            <Label>{t('document_upload.tags_label')}</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={formData.newTag}
                onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                placeholder={t('document_upload.add_tag_placeholder')}
                className="flex-1 bg-white text-gray-900 border-gray-300"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="bg-white text-gray-900 border-gray-300"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <Card className="bg-white text-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              {t('document_upload.uploaded_documents')} ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(document.mimeType)}</span>
                    <div>
                      <h4 className="font-medium">{document.name}</h4>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(document.fileSize)} • {document.type} • {new Date(document.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      {document.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(document.fileUrl, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(document.fileUrl, '_blank')}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDocument(document)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(document.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Status */}
      {uploading && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">{t('document_upload.uploading')}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
