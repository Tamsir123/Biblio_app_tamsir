const API_BASE_URL = 'http://localhost:5000/api';

// Types pour les données analytics
export interface DashboardAnalytics {
  overview: {
    total_books: number;
    total_users: number;
    active_borrowings: number;
    overdue_borrowings: number;
    total_reviews: number;
    average_rating: number;
  };
  trends: {
    books_growth: number;
    users_growth: number;
    borrowings_growth: number;
  };
  popular_books: Array<{
    id: number;
    title: string;
    author: string;
    borrow_count: number;
  }>;
  recent_activity: Array<{
    date: string;
    new_borrowings: number;
    returns: number;
  }>;
  categories_stats: Array<{
    genre: string;
    book_count: number;
    percentage: number;
  }>;
  peak_hours: Array<{
    hour: number;
    activity_count: number;
  }>;
}

export interface BorrowingAnalytics {
  daily_stats: Array<{
    date: string;
    new_borrowings: number;
    returns: number;
    overdue: number;
  }>;
  monthly_trends: Array<{
    month: string;
    total_borrowings: number;
    average_duration: number;
    overdue_rate: number;
  }>;
  peak_hours: Array<{
    hour: number;
    borrowing_count: number;
  }>;
  user_activity: Array<{
    user_id: number;
    user_name: string;
    total_borrowings: number;
    current_active: number;
    overdue_count: number;
  }>;
}

class AnalyticsService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Récupérer les données du dashboard
  async getDashboardStats(): Promise<DashboardAnalytics> {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques du dashboard');
    }

    const data = await response.json();
    return data.data;
  }

  // Récupérer les analytics détaillés des emprunts
  async getBorrowingAnalytics(): Promise<BorrowingAnalytics> {
    const response = await fetch(`${API_BASE_URL}/analytics/borrowings`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des analytics des emprunts');
    }

    const data = await response.json();
    return data.data;
  }

  // Exporter les données en CSV
  async exportData(type: 'borrowings' | 'users' | 'books'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/analytics/export/${type}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'export des ${type}`);
    }

    return response.blob();
  }

  // Télécharger un fichier CSV
  downloadCSV(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Formater les données pour les graphiques
  formatTrendData(recentActivity: DashboardAnalytics['recent_activity']) {
    return recentActivity.map(item => ({
      date: item.date,
      emprunts: item.new_borrowings,
      retours: item.returns
    }));
  }

  formatActivityData(peakHours: DashboardAnalytics['peak_hours']) {
    return peakHours.map(item => ({
      hour: `${item.hour}h`,
      activity: item.activity_count
    }));
  }

  formatPopularBooksData(popularBooks: DashboardAnalytics['popular_books']) {
    return popularBooks.slice(0, 10).map(book => ({
      title: book.title.length > 20 ? `${book.title.substring(0, 20)}...` : book.title,
      borrowCount: book.borrow_count
    }));
  }

  formatCategoryData(categories: DashboardAnalytics['categories_stats']) {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
    ];

    return categories.map((category, index) => ({
      genre: category.genre || 'Non catégorisé',
      count: category.book_count,
      color: colors[index % colors.length]
    }));
  }

  formatBorrowingStatsData(monthlyTrends: BorrowingAnalytics['monthly_trends']) {
    return monthlyTrends.map(trend => ({
      month: trend.month,
      emprunts: trend.total_borrowings,
      retards: Math.floor(trend.total_borrowings * (trend.overdue_rate / 100))
    }));
  }
}

export const analyticsService = new AnalyticsService();
