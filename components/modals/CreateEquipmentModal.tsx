"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useLocale } from '@/lib/i18n';

interface CreateEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (equipment: { id: string; name: string; category: string; quantity: number }) => void;
  locale: string;
}

export function CreateEquipmentModal({ isOpen, onClose, onSuccess, locale }: CreateEquipmentModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Audio');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          category, 
          quantity: parseInt(quantity.toString()), 
          description,
          supplier,
          status: 'available'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('create_equipment_modal.error_creating_equipment'));
      }

      const { equipment } = await response.json();
      toast({
        title: t('create_equipment_modal.success_title'),
        description: t('create_equipment_modal.success_description', { name: equipment.name }),
      });
      onSuccess(equipment);
      onClose();
      // Reset form
      setName('');
      setCategory('Audio');
      setQuantity(1);
      setDescription('');
      setSupplier('');
    } catch (error: any) {
      toast({
        title: t('create_equipment_modal.error_title'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>{t('create_equipment_modal.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t('create_equipment_modal.name_label')}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              {t('create_equipment_modal.category_label')}
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Audio">{t('create_equipment_modal.category_audio')}</SelectItem>
                <SelectItem value="Lumières">{t('create_equipment_modal.category_lights')}</SelectItem>
                <SelectItem value="Scène">{t('create_equipment_modal.category_stage')}</SelectItem>
                <SelectItem value="Transport">{t('create_equipment_modal.category_transport')}</SelectItem>
                <SelectItem value="Autre">{t('create_equipment_modal.category_other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              {t('create_equipment_modal.quantity_label')}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              {t('create_equipment_modal.supplier_label')}
            </Label>
            <Input
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t('create_equipment_modal.description_label')}
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? t('create_equipment_modal.creating') : t('create_equipment_modal.create_button')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
