use axum::{
    extract::{Path, State},
    http::{HeaderValue, StatusCode},
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use axum_extra::response::ErasedJson;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{
    collections::HashMap,
    fs::{self, File},
    io::Read,
    sync::{Arc, RwLock},
};
use tower_http::cors::{Any, CorsLayer};

type ID = String;
type Index = HashMap<ID, BookData>;

const DATA_PATH: &str = "../data/data.json";

#[derive(Clone, PartialEq, Debug, Serialize, Deserialize)]
struct BookData {
    title: String,
}

fn init_data() -> Index {
    if let Ok(mut file) = File::open(DATA_PATH) {
        let mut serialized = String::new();
        file.read_to_string(&mut serialized)
            .expect("failed to read data from file");
        let data: Index = serde_json::from_str(&serialized).expect("cannot parse file");
        data
    } else {
        Index::new()
    }
}

async fn get_item_list(list: State<Arc<RwLock<Index>>>) -> impl IntoResponse {
    ErasedJson::pretty(json!(*list.read().unwrap()))
}

#[derive(Serialize, Deserialize)]
struct CreateRequest {
    id: ID,
    data: BookData,
}

async fn create_item(
    list: State<Arc<RwLock<Index>>>,
    Json(request): Json<CreateRequest>,
) -> impl IntoResponse {
    if (*list).read().unwrap().contains_key(&request.id) {
        StatusCode::BAD_REQUEST
    } else {
        let result = (*list).write().unwrap().insert(request.id, request.data);
        assert_eq!(result, None);

        let content = serde_json::to_vec_pretty(&*list.read().unwrap()).unwrap();
        fs::write(DATA_PATH, content).expect("failed to save data to file");

        StatusCode::OK
    }
}

#[derive(Serialize, Deserialize)]
struct UpdateRequest {
    data: BookData,
}

async fn update_item(
    list: State<Arc<RwLock<Index>>>,
    Path(id): Path<ID>,
    Json(request): Json<UpdateRequest>,
) -> impl IntoResponse {
    if !(*list).read().unwrap().contains_key(&id) {
        (StatusCode::NOT_FOUND, ErasedJson::pretty(json!({})))
    } else {
        let result = (*list)
            .write()
            .unwrap()
            .insert(id.clone(), request.data.clone());
        let body = match result {
            Some(old) => ErasedJson::pretty(json!({
                "id": id,
                "old": old,
                "new": request.data
            })),
            None => unreachable!(),
        };

        let content = serde_json::to_vec_pretty(&*list.read().unwrap()).unwrap();
        fs::write(DATA_PATH, content).expect("failed to save data to file");

        (StatusCode::OK, body)
    }
}

async fn delete_item(list: State<Arc<RwLock<Index>>>, Path(id): Path<ID>) -> impl IntoResponse {
    let result = (*list).write().unwrap().remove(&id);
    match result {
        Some(_) => {
            let content = serde_json::to_vec_pretty(&*list.read().unwrap()).unwrap();
            fs::write(DATA_PATH, content).expect("failed to save data to file");
            StatusCode::OK
        }
        None => StatusCode::NOT_FOUND,
    }
}

async fn get_item(list: State<Arc<RwLock<Index>>>, Path(id): Path<ID>) -> impl IntoResponse {
    match list.read().unwrap().get(&id) {
        Some(data) => (
            StatusCode::OK,
            ErasedJson::pretty(json!({ "id": id, "data": data })),
        ),
        None => (StatusCode::NOT_FOUND, ErasedJson::pretty(json!({}))),
    }
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/books", get(get_item_list).post(create_item))
        .route(
            "/books/:id",
            get(get_item).put(update_item).delete(delete_item),
        )
        .with_state(Arc::new(RwLock::new(init_data())))
        .layer(
            CorsLayer::new()
                .allow_origin("http://127.0.0.1:5173".parse::<HeaderValue>().unwrap())
                .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
                .allow_headers(Any)
                .allow_methods(Any),
        );

    let addr = "127.0.0.1:3000";
    println!("listening on http://{}", addr);

    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
