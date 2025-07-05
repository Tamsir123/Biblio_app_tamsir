import React from 'react';
import { CSVLink } from 'react-csv';
import { Download, FileText, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonsProps {
  onExportBorrowings: () => void;
  onExportUsers: () => void;
  onExportBooks: () => void;
  loading?: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportBorrowings,
  onExportUsers,
  onExportBooks,
  loading = false
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onExportBorrowings}
        disabled={loading}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <FileText className="h-4 w-4" />
        <span>Exporter Emprunts</span>
        <Download className="h-3 w-3" />
      </Button>

      <Button
        onClick={onExportUsers}
        disabled={loading}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <Users className="h-4 w-4" />
        <span>Exporter Utilisateurs</span>
        <Download className="h-3 w-3" />
      </Button>

      <Button
        onClick={onExportBooks}
        disabled={loading}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <BookOpen className="h-4 w-4" />
        <span>Exporter Livres</span>
        <Download className="h-3 w-3" />
      </Button>
    </div>
  );
};

interface StatCardAnalyticsProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCardAnalytics: React.FC<StatCardAnalyticsProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
  trend
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
