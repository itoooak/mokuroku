pub mod db;
pub mod handler;

#[derive(Debug, Clone, PartialEq, sqlx::FromRow, serde::Serialize, serde::Deserialize)]
pub struct Book {
    pub id: String,
    pub title: String,
}
