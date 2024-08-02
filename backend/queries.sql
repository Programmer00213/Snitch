CREATE TABLE users(
id SERIAL PRIMARY KEY,
email VARCHAR(150) NOT NULL UNIQUE,
password VARCHAR(100)
)

CREATE TABLE post(
	id SERIAL PRIMARY KEY,
	title VARCHAR(100),
	content VARCHAR(5000),
	author VARCHAR(50),
	date DATE,
	likeCount INTEGER,
	commentCount INTEGER,
	userId INTEGER REFERENCES users(id)
)

SELECT post.*, users.email FROM post INNER JOIN users WHERE post.userid = users.id;