import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { LoanProduct } from '@/lib/types';
import { 
  Edit, 
  Copy, 
  Trash2, 
  DollarSign, 
  Percent, 
  Calendar,
  Building2
} from 'lucide-react';

interface LoanProductCardProps {
  product: LoanProduct;
  onEdit: (product: LoanProduct) => void;
  onDuplicate: (product: LoanProduct) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  isHighlighted?: boolean;
}

export const LoanProductCard: React.FC<LoanProductCardProps> = ({
  product,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  isHighlighted = false,
}) => {
  return (
    <Card className={`group hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 hover:scale-[1.02] ${
      isHighlighted ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg shadow-blue-200/50 bg-blue-50/30' : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
              {product.name}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-gray-600">
              {product.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Switch
              checked={product.isActive}
              onCheckedChange={(checked) => onToggleStatus(product.id, checked)}
            />
            <Badge 
              variant={product.isActive ? "default" : "secondary"}
              className={product.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
            >
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Amount Range</p>
              <p className="font-semibold text-gray-900">
                ${(product.minAmount || 0).toLocaleString()} - ${(product.maxAmount || 0).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors">
            <Percent className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Interest Rate</p>
              <p className="font-semibold text-gray-900">{product.interestRate}%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50/50 hover:bg-purple-50 transition-colors">
            <Calendar className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">Term Length</p>
              <p className="font-semibold text-gray-900">{product.termLength} months</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors">
            <Building2 className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-xs font-medium text-orange-700 uppercase tracking-wide">Business Types</p>
              <p className="font-semibold text-gray-900">{(product.businessTypes ?? []).length}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate(product)}
              className="hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 