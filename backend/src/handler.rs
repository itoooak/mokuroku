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

pub async fn get_item_list<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
) -> impl IntoResponse {
    match db.get_list().await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, ErasedJson::new("error")),
    }
}

pub async fn get_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match db.get(&id).await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(db::Error::NotFound) => (StatusCode::NOT_FOUND, ErasedJson::new("not found")),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, ErasedJson::new("error")),
    }
}

pub async fn create_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Garde(Json(book)): Garde<Json<Book>>,
) -> impl IntoResponse {
    match db.create(book).await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, ErasedJson::new("error")),
    }
}

pub async fn update_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Path(id): Path<String>,
    Garde(Json(book)): Garde<Json<Book>>,
) -> impl IntoResponse {
    match db.update(&id, book).await {
        Ok(v) => (StatusCode::OK, ErasedJson::pretty(v)),
        Err(db::Error::NotFound) => (StatusCode::NOT_FOUND, ErasedJson::new("not found")),
        Err(db::Error::ParamInvalid(s)) => (StatusCode::BAD_REQUEST, ErasedJson::new(s)),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, ErasedJson::new("error")),
    }
}

pub async fn delete_item<T: BooksDB>(
    State(AppState(db)): State<AppState<T>>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match db.delete(&id).await {
        Ok(_) => (StatusCode::OK, ErasedJson::pretty(())),
        Err(db::Error::NotFound) => (StatusCode::NOT_FOUND, ErasedJson::new("not found")),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, ErasedJson::new("error")),
    }
}
