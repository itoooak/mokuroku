use crate::Book;

use sqlx::PgPool;

#[derive(Debug)]
pub enum Error {
    SqlxError(sqlx::Error),
    ParamInvalidError(String),
    NotFoundError,
}

pub trait BooksDB {
    async fn get_list(&self) -> Result<Vec<Book>, Error>;
    async fn get(&self, id: &str) -> Result<Book, Error>;
    async fn create(&self, book: Book) -> Result<Book, Error>;
    async fn update(&self, id: &str, book: Book) -> Result<Book, Error>;
    async fn delete(&self, id: &str) -> Result<(), Error>;
}

pub struct PgBooksDB {
    pool: PgPool,
}

impl PgBooksDB {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

impl BooksDB for PgBooksDB {
    async fn get_list(&self) -> Result<Vec<Book>, Error> {
        match sqlx::query_as("SELECT * FROM Books")
            .fetch_all(&self.pool)
            .await
        {
            Ok(v) => Ok(v),
            Err(e) => Err(Error::SqlxError(e)),
        }
    }

    async fn get(&self, id: &str) -> Result<Book, Error> {
        match sqlx::query_as("SELECT * FROM Books WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
        {
            Ok(v) => Ok(v),
            Err(sqlx::Error::RowNotFound) => Err(Error::NotFoundError),
            Err(e) => Err(Error::SqlxError(e)),
        }
    }

    async fn create(&self, book: Book) -> Result<Book, Error> {
        match sqlx::query_as("INSERT INTO Books(id, title) VALUES ($1, $2) RETURNING *")
            .bind(book.id)
            .bind(book.title)
            .fetch_one(&self.pool)
            .await
        {
            Ok(v) => Ok(v),
            Err(e) => Err(Error::SqlxError(e)),
        }
    }

    async fn update(&self, id: &str, book: Book) -> Result<Book, Error> {
        if id != book.id {
            return Err(Error::ParamInvalidError(
                "id and book.id not match".to_string(),
            ));
        }

        match sqlx::query_as("UPDATE Books SET title = $2 WHERE id = $1 RETURNING *")
            .bind(id)
            .bind(book.title)
            .fetch_one(&self.pool)
            .await
        {
            Ok(v) => Ok(v),
            Err(sqlx::Error::RowNotFound) => Err(Error::NotFoundError),
            Err(e) => Err(Error::SqlxError(e)),
        }
    }

    async fn delete(&self, id: &str) -> Result<(), Error> {
        match sqlx::query("DELETE FROM Books WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
        {
            Ok(_) => Ok(()),
            Err(sqlx::Error::RowNotFound) => Err(Error::NotFoundError),
            Err(e) => Err(Error::SqlxError(e)),
        }
    }
}
