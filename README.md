<<<<<<< HEAD
# Luna

A simple task management system with user authentication and task tracking.  

## Setup  

### 1. Database Setup  
```sql
CREATE DATABASE luna;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  cycles INT DEFAULT 0
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date DATETIME NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Install & Run
```console
git clone https://github.com/amny36/Luna_backend.git  
cd Luna_backend 
npm install  
node server.js
```

=======
# luna_bc1
>>>>>>> 5430a9ec71d123a47390d2009ecf8c89ffb72857
