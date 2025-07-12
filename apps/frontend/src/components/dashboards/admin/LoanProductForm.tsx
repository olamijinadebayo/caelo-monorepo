import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { LoanProduct, RiskSpread } from '../../../lib/types';
import { BUSINESS_TYPES } from '../../../lib/constants';
import { Plus, X } from 'lucide-react';

interface LoanProductFormProps {
  product?: LoanProduct | null;
  isOpen: boolean;
  onSave: (product: Omit<LoanProduct, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const LoanProductForm: React.FC<LoanProductFormProps> = ({
  product,
  isOpen,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minAmount: 0,
    maxAmount: 0,
    interestRate: 0,
    termLength: 0,
    isActive: true,
    businessTypes: [] as string[],
    riskSpreads: [] as RiskSpread[],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        interestRate: product.interestRate,
        termLength: product.termLength,
        isActive: product.isActive,
        businessTypes: [...product.businessTypes],
        riskSpreads: [...product.riskSpreads],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        minAmount: 0,
        maxAmount: 0,
        interestRate: 0,
        termLength: 0,
        isActive: true,
        businessTypes: [],
        riskSpreads: [],
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateRiskSpread = (index: number, field: 'lendscoreRange' | 'spread', value: string | number) => {
    const updatedSpreads = [...formData.riskSpreads];
    updatedSpreads[index] = { ...updatedSpreads[index], [field]: value };
    setFormData(prev => ({ ...prev, riskSpreads: updatedSpreads }));
  };

  const addRiskSpreadRow = () => {
    setFormData(prev => ({
      ...prev,
      riskSpreads: [...prev.riskSpreads, { lendscoreRange: '', spread: 0 }],
    }));
  };

  const removeRiskSpreadRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      riskSpreads: prev.riskSpreads.filter((_, i) => i !== index),
    }));
  };

  const toggleBusinessType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter(t => t !== type)
        : [...prev.businessTypes, type],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Loan Product' : 'Create New Loan Product'}
          </DialogTitle>
          <DialogDescription>
            Configure the loan product details and risk parameters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAmount">Minimum Amount ($)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, minAmount: Number(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="maxAmount">Maximum Amount ($)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAmount: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="termLength">Term Length (months)</Label>
                <Input
                  id="termLength"
                  type="number"
                  value={formData.termLength}
                  onChange={(e) => setFormData(prev => ({ ...prev, termLength: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Types */}
          <div>
            <Label>Business Types</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {BUSINESS_TYPES.map((type) => (
                <label key={type.code} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.businessTypes.includes(type.code)}
                    onChange={() => toggleBusinessType(type.code)}
                    className="rounded"
                  />
                  <span className="text-sm">{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Risk Spreads */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Risk Spreads</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRiskSpreadRow}>
                <Plus className="h-4 w-4 mr-1" />
                Add Spread
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.riskSpreads.map((spread, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Lendscore Range (e.g., 600-650)"
                    value={spread.lendscoreRange}
                    onChange={(e) => updateRiskSpread(index, 'lendscoreRange', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Spread %"
                    value={spread.spread}
                    onChange={(e) => updateRiskSpread(index, 'spread', Number(e.target.value))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRiskSpreadRow(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 