use crate::{
    db::{self, BooksDB},
    AppState, Book,
};

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_extra::response::ErasedJson;
use axum_valid::Garde;

#[tracing::instrument(skip(db))]
pub async fn get_item_list<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
) -> impl IntoResponse {
    match db.get_list().await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(e) => handle_error(e),
    }
}

#[tracing::instrument(skip(db))]
pub async fn get_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match db.get(&id).await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(e) => handle_error(e),
    }
}

#[tracing::instrument(skip(db))]
pub async fn create_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Garde(Json(book)): Garde<Json<Book>>,
) -> impl IntoResponse {
    match db.create(book).await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(e) => handle_error(e),
    }
}

#[tracing::instrument(skip(db))]
pub async fn update_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Path(id): Path<String>,
    Garde(Json(book)): Garde<Json<Book>>,
) -> impl IntoResponse {
    match db.update(&id, book).await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(e) => handle_error(e),
    }
}

#[tracing::instrument(skip(db))]
pub async fn delete_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match db.delete(&id).await {
        Ok(()) => (StatusCode::OK, ErasedJson::pretty(())),
        Err(e) => handle_error(e),
    }
}

fn handle_error(e: db::Error) -> (axum::http::StatusCode, ErasedJson) {
    match e {
        db::Error::NotFound => (StatusCode::NOT_FOUND, ErasedJson::new("item not found")),
        db::Error::ParamInvalid(s) => (StatusCode::BAD_REQUEST, ErasedJson::new(s)),
        db::Error::Sqlx(e) => {
            tracing::error!("error in sqlx: {e:?}");
            (StatusCode::INTERNAL_SERVER_ERROR, ErasedJson::new(()))
        }
    }
}
