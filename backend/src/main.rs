mod db;
mod handler;
use db::BooksDB;
use handler::*;

use axum::{extract::FromRef, http::HeaderValue, routing::get, Router};
use chrono::{DateTime, Utc};
use sqlx::postgres::PgPoolOptions;
use std::{env, sync::Arc};
use tower_http::cors::{Any, CorsLayer};

#[derive(
    Debug, Clone, PartialEq, sqlx::FromRow, serde::Serialize, serde::Deserialize, garde::Validate,
)]
pub struct Book {
    #[garde(length(min = 1))]
    pub id: String,
    #[garde(length(min = 1))]
    pub title: String,
    #[garde(skip)]
    pub obtained: Option<DateTime<Utc>>,
    #[garde(skip)]
    pub finished: Option<DateTime<Utc>>,
    #[garde(url)]
    pub memo_link: Option<String>,
}

struct AppState<T: BooksDB>(pub Arc<T>);

impl<T: BooksDB> Clone for AppState<T> {
    fn clone(&self) -> Self {
        Self(self.0.clone())
    }
}

impl<T: BooksDB> FromRef<AppState<T>> for () {
    fn from_ref(_: &AppState<T>) -> Self {}
}

#[tokio::main]
async fn main() {
    let db_addr = env::var("DATABASE_ADDR").expect("address of database not provided");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_addr)
        .await
        .unwrap();

    let db = db::PgBooksDB::new(pool);

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/books", get(get_item_list).post(create_item))
        .route(
            "/books/:id",
            get(get_item).put(update_item).delete(delete_item),
        )
        .with_state(AppState(Arc::new(db)))
        .layer(
            CorsLayer::new()
                .allow_origin(
                    env::var("FRONTEND_ADDR")
                        .unwrap()
                        .parse::<HeaderValue>()
                        .expect("address of frontend server not provided"),
                )
                .allow_headers(Any)
                .allow_methods(Any),
        );

    let addr = format!(
        "0.0.0.0:{}",
        env::var("BACKEND_PORT").expect("port number not provided")
    );
    println!("listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
