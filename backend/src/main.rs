use axum::{extract::State, response::IntoResponse, routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::sync::{Arc, RwLock};

#[derive(Serialize, Deserialize)]
struct BookData {
    id: String,
    title: String,
}

async fn get_item_list(list: State<Arc<RwLock<Vec<BookData>>>>) -> impl IntoResponse {
    Json(json!(*list.read().unwrap()))
}

async fn create_item(
    list: State<Arc<RwLock<Vec<BookData>>>>,
    Json(payload): Json<BookData>,
) -> impl IntoResponse {
    list.write().unwrap().push(payload);
    Json(json!({ "created": list.read().unwrap().last() }))
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/books", get(get_item_list).post(create_item))
        .with_state(Arc::new(RwLock::new(Vec::<BookData>::new())));

    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
