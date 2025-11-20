
DROP TABLE IF EXISTS tags CASCADE;

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  tag_value TEXT NOT NULL,
  CONSTRAINT category_id_fk FOREIGN KEY (category_id) 
  REFERENCES directory_categories(id) 
  ON DELETE CASCADE
);

