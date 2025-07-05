-- ================================================================
-- SCHÉMA COMPLET DE LA BASE DE DONNÉES - GESTION DE BIBLIOTHÈQUE
-- ================================================================
-- Version: 2.0.0
-- Date: 2025-07-03
-- Description: Schéma complet avec toutes les tables, index et vues
-- ================================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS railway
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE railway;

-- ================================================================
-- TABLE DES UTILISATEURS
-- ================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    is_active TINYINT(1) DEFAULT 1,
    
    -- Informations étudiantes
    student_id VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    level ENUM('L1', 'L2', 'L3', 'M1', 'M2', 'PhD'),
    
    -- Informations personnelles
    phone VARCHAR(20),
    address VARCHAR(255),
    date_of_birth DATE,
    country VARCHAR(100) DEFAULT 'Burkina Faso',
    city VARCHAR(100),
    
    -- Contacts d'urgence
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    
    -- Profil utilisateur
    bio TEXT,
    favorite_genres TEXT,
    profile_image VARCHAR(255),
    
    -- Métadonnées
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index pour les utilisateurs
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_country ON users(country);

-- ================================================================
-- TABLE DES PRÉFÉRENCES UTILISATEUR
-- ================================================================
CREATE TABLE user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    notification_email TINYINT(1) DEFAULT 1,
    notification_sms TINYINT(1) DEFAULT 0,
    language ENUM('fr', 'en') DEFAULT 'fr',
    theme ENUM('light', 'dark', 'auto') DEFAULT 'light',
    privacy_profile ENUM('public', 'friends', 'private') DEFAULT 'public',
    receive_recommendations TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================================
-- TABLE DE L'HISTORIQUE DE CONNEXION
-- ================================================================
CREATE TABLE user_login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    location VARCHAR(100),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour l'historique de connexion
CREATE INDEX idx_login_history_user ON user_login_history(user_id);
CREATE INDEX idx_login_history_date ON user_login_history(login_at);

-- ================================================================
-- TABLE DES CATÉGORIES DE LIVRES
-- ================================================================
CREATE TABLE book_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- TABLE DES LIVRES
-- ================================================================
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    genre VARCHAR(50),
    description TEXT,
    cover_image VARCHAR(255),
    total_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    publication_year YEAR,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index pour les livres
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_isbn ON books(isbn);

-- ================================================================
-- TABLE DE RELATION LIVRES-CATÉGORIES
-- ================================================================
CREATE TABLE book_category_relations (
    book_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (book_id, category_id),
    
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES book_categories(id) ON DELETE CASCADE
);

-- ================================================================
-- TABLE DES EMPRUNTS
-- ================================================================
CREATE TABLE borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrowed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    returned_at DATETIME,
    status ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',
    renewal_count INT DEFAULT 0,
    notes TEXT,
    comment_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Index pour les emprunts
CREATE INDEX idx_borrowings_user ON borrowings(user_id);
CREATE INDEX idx_borrowings_book ON borrowings(book_id);
CREATE INDEX idx_borrowings_status ON borrowings(status);
CREATE INDEX idx_borrowings_due_date ON borrowings(due_date);

-- ================================================================
-- TABLE DES AVIS/COMMENTAIRES
-- ================================================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_book_review (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Index pour les avis
CREATE INDEX idx_reviews_book ON reviews(book_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ================================================================
-- TABLE DES NOTIFICATIONS
-- ================================================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('reminder', 'overdue', 'approval', 'general') NOT NULL DEFAULT 'general',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour les notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ================================================================
-- VUES POUR LES REQUÊTES COMPLEXES
-- ================================================================

-- Vue: Livres avec informations d'emprunt
CREATE VIEW books_with_borrowing_info AS
SELECT 
    b.*,
    COALESCE(borrowed.currently_borrowed, 0) as currently_borrowed,
    COALESCE(reviews.average_rating, 0) as average_rating,
    COALESCE(reviews.review_count, 0) as review_count
FROM books b
LEFT JOIN (
    SELECT 
        book_id, 
        COUNT(*) as currently_borrowed
    FROM borrowings 
    WHERE status = 'active' 
    GROUP BY book_id
) borrowed ON b.id = borrowed.book_id
LEFT JOIN (
    SELECT 
        book_id,
        AVG(rating) as average_rating,
        COUNT(*) as review_count
    FROM reviews 
    WHERE is_approved = 1
    GROUP BY book_id
) reviews ON b.id = reviews.book_id;

-- Vue: Emprunts avec détails utilisateur et livre
CREATE VIEW borrowings_with_details AS
SELECT 
    b.*,
    u.name as user_name,
    u.email as user_email,
    u.student_id,
    u.department,
    u.level,
    bk.title as book_title,
    bk.author as book_author,
    bk.isbn,
    bk.cover_image,
    CASE 
        WHEN b.status = 'overdue' THEN 'overdue'
        WHEN b.status = 'returned' THEN 'returned'
        WHEN b.due_date < NOW() THEN 'overdue'
        ELSE 'active'
    END as current_status,
    CASE 
        WHEN b.due_date < NOW() AND b.status != 'returned' 
        THEN DATEDIFF(NOW(), b.due_date)
        ELSE NULL
    END as days_overdue
FROM borrowings b
JOIN users u ON b.user_id = u.id
JOIN books bk ON b.book_id = bk.id;

-- Vue: Utilisateurs avec statistiques
CREATE VIEW users_with_stats AS
SELECT 
    u.*,
    COALESCE(active_borr.active_borrowings_count, 0) as active_borrowings_count,
    COALESCE(total_borr.total_borrowings_count, 0) as total_borrowings_count,
    COALESCE(user_reviews.reviews_given_count, 0) as reviews_given_count,
    COALESCE(user_reviews.avg_rating_given, 0) as avg_rating_given
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as active_borrowings_count
    FROM borrowings 
    WHERE status = 'active'
    GROUP BY user_id
) active_borr ON u.id = active_borr.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_borrowings_count
    FROM borrowings 
    GROUP BY user_id
) total_borr ON u.id = total_borr.user_id
LEFT JOIN (
    SELECT 
        user_id, 
        COUNT(*) as reviews_given_count,
        AVG(rating) as avg_rating_given
    FROM reviews 
    WHERE is_approved = 1
    GROUP BY user_id
) user_reviews ON u.id = user_reviews.user_id;

-- ================================================================
-- TRIGGERS POUR LA GESTION AUTOMATIQUE
-- ================================================================

-- Trigger: Mettre à jour la quantité disponible lors d'un emprunt
DELIMITER //
CREATE TRIGGER update_book_quantity_on_borrow
    AFTER INSERT ON borrowings
    FOR EACH ROW
BEGIN
    UPDATE books 
    SET available_quantity = available_quantity - 1
    WHERE id = NEW.book_id AND available_quantity > 0;
END //
DELIMITER ;

-- Trigger: Mettre à jour la quantité disponible lors d'un retour
DELIMITER //
CREATE TRIGGER update_book_quantity_on_return
    AFTER UPDATE ON borrowings
    FOR EACH ROW
BEGIN
    -- Si le statut passe à 'returned' et qu'il n'était pas 'returned' avant
    IF NEW.status = 'returned' AND OLD.status != 'returned' THEN
        UPDATE books 
        SET available_quantity = available_quantity + 1
        WHERE id = NEW.book_id;
    END IF;
    
    -- Si le statut était 'returned' et ne l'est plus (cas de ré-emprunt)
    IF OLD.status = 'returned' AND NEW.status != 'returned' THEN
        UPDATE books 
        SET available_quantity = available_quantity - 1
        WHERE id = NEW.book_id AND available_quantity > 0;
    END IF;
END //
DELIMITER ;

-- Trigger: Mettre à jour le statut des emprunts en retard
DELIMITER //
CREATE TRIGGER update_overdue_status
    BEFORE UPDATE ON borrowings
    FOR EACH ROW
BEGIN
    -- Marquer comme en retard si la date limite est dépassée et le livre n'est pas rendu
    IF NEW.due_date < NOW() AND NEW.status = 'active' THEN
        SET NEW.status = 'overdue';
    END IF;
END //
DELIMITER ;

-- ================================================================
-- DONNÉES INITIALES
-- ================================================================

-- Insérer les catégories de base
INSERT INTO book_categories (name, description) VALUES
('Informatique', 'Livres sur la programmation, les algorithmes et les technologies'),
('Mathématiques', 'Livres de mathématiques, analyse, algèbre, etc.'),
('Littérature', 'Romans, nouvelles, poésie et œuvres littéraires'),
('Sciences', 'Livres scientifiques (physique, chimie, biologie, etc.)'),
('Histoire', 'Livres d\'histoire et de géographie'),
('Économie', 'Livres d\'économie, finance et gestion'),
('Philosophie', 'Ouvrages philosophiques et de réflexion'),
('Langues', 'Livres pour l\'apprentissage des langues étrangères');

-- ================================================================
-- PROCÉDURES STOCKÉES UTILES
-- ================================================================

-- Procédure: Nettoyer les emprunts expirés
DELIMITER //
CREATE PROCEDURE CleanExpiredBorrowings()
BEGIN
    -- Marquer les emprunts actifs dépassés comme en retard
    UPDATE borrowings 
    SET status = 'overdue' 
    WHERE status = 'active' 
    AND due_date < NOW();
    
    -- Retourner le nombre d'emprunts marqués en retard
    SELECT ROW_COUNT() as updated_count;
END //
DELIMITER ;

-- Procédure: Obtenir les statistiques générales
DELIMITER //
CREATE PROCEDURE GetLibraryStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM books) as total_books,
        (SELECT COUNT(*) FROM users WHERE is_active = 1) as active_users,
        (SELECT COUNT(*) FROM borrowings WHERE status = 'active') as active_borrowings,
        (SELECT COUNT(*) FROM borrowings WHERE status = 'overdue') as overdue_borrowings,
        (SELECT COUNT(*) FROM reviews) as total_reviews,
        (SELECT AVG(rating) FROM reviews WHERE is_approved = 1) as average_rating;
END //
DELIMITER ;

-- ================================================================
-- INDEX POUR LES PERFORMANCES
-- ================================================================

-- Index composés pour les requêtes fréquentes
CREATE INDEX idx_borrowings_user_status ON borrowings(user_id, status);
CREATE INDEX idx_borrowings_book_status ON borrowings(book_id, status);
CREATE INDEX idx_reviews_book_approved ON reviews(book_id, is_approved);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ================================================================
-- COMMENTAIRES SUR LES CONTRAINTES
-- ================================================================

/*
CONTRAINTES ET RÈGLES MÉTIER:

1. UTILISATEURS:
   - Email unique pour chaque utilisateur
   - student_id unique si fourni
   - Rôle par défaut: 'student'
   - Détection automatique du rôle basée sur l'email (admin.* = admin)

2. LIVRES:
   - ISBN unique si fourni
   - available_quantity <= total_quantity (géré par triggers)
   - Quantités mises à jour automatiquement lors des emprunts/retours

3. EMPRUNTS:
   - Un utilisateur peut emprunter le même livre plusieurs fois (pas en même temps)
   - Statut mis à jour automatiquement (overdue si date dépassée)
   - Renouvellement limité (renewal_count)

4. AVIS:
   - Un seul avis par utilisateur par livre
   - Rating entre 1 et 5
   - Modération possible (is_approved)

5. NOTIFICATIONS:
   - Expiration automatique possible (expires_at)
   - Types: reminder, overdue, approval, general

6. VUES:
   - Pré-calcul des statistiques pour les performances
   - Simplification des requêtes complexes

7. TRIGGERS:
   - Gestion automatique des quantités de livres
   - Mise à jour des statuts d'emprunt
*/

-- ================================================================
-- FIN DU SCHÉMA
-- ================================================================
