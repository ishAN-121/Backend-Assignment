DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `cookies`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `requests`;


CREATE TABLE `users` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `admin` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX secondary ON users (username);
CREATE TABLE `books` (
  `id` int(12) AUTO_INCREMENT NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `count` int(11)  DEFAULT 1,
  `totalcount` int(11) DEFAULT 1,
  PRIMARY KEY (`id`)
  )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cookies` (
  `id` int(11) AUTO_INCREMENT,
  `sessionId` varchar(255),
  `userId` int(12),
  `username` varchar(255),
  PRIMARY KEY (`id`),
  CONSTRAINT `cookies_ibfk_1` FOREIGN KEY (userId) REFERENCES users(id),
  CONSTRAINT `cookies_ibfk_2` FOREIGN KEY (username) REFERENCES users(username)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `requests` (
  `id` int(12) AUTO_INCREMENT PRIMARY KEY,
  `bookId` int(12),
  `userId` int(12),
  `status` ENUM('owned', 'requested','checkin','returned'),
  FOREIGN KEY (bookId) REFERENCES books(id),
  FOREIGN KEY (userId) REFERENCES users(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

