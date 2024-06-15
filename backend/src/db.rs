use crate::Book;

use sqlx::PgPool;

#[derive(Debug)]
pub enum Error {
    Sqlx(sqlx::Error),
    ParamInvalid(String),
    NotFound,
}

impl From<sqlx::Error> for Error {
    fn from(value: sqlx::Error) -> Self {
        match value {
            sqlx::Error::RowNotFound => Error::NotFound,
            e => Error::Sqlx(e),
        }
    }
}

#[allow(async_fn_in_trait)]
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
        let v = sqlx::query_as("SELECT * FROM Books")
            .fetch_all(&self.pool)
            .await?;
        Ok(v)
    }

    async fn get(&self, id: &str) -> Result<Book, Error> {
        let v = sqlx::query_as("SELECT * FROM Books WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await?;
        Ok(v)
    }

    async fn create(&self, book: Book) -> Result<Book, Error> {
        let v = sqlx::query_as(
            "INSERT INTO Books(id, title, obtained, finished, memo_link) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        )
        .bind(book.id)
        .bind(book.title)
        .bind(book.obtained)
        .bind(book.finished)
        .bind(book.memo_link)
        .fetch_one(&self.pool)
        .await?;
        Ok(v)
    }

    async fn update(&self, id: &str, book: Book) -> Result<Book, Error> {
        if id != book.id {
            return Err(Error::ParamInvalid("id and book.id not match".to_string()));
        }

        let v = sqlx::query_as(
            "UPDATE Books SET title = $2, obtained = $3, finished = $4, memo_link = $5 WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(book.title)
        .bind(book.obtained)
        .bind(book.finished)
        .bind(book.memo_link)
        .fetch_one(&self.pool)
        .await?;
        Ok(v)
    }

    async fn delete(&self, id: &str) -> Result<(), Error> {
        sqlx::query("DELETE FROM Books WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
