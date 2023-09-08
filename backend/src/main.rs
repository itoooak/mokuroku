use axum::{extract::State, response::IntoResponse, routing::get, Json, Router};
use axum_extra::response::ErasedJson;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{
    collections::HashMap,
    fs::{self, File},
    io::Read,
    sync::{Arc, RwLock},
};

type ID = String;
type Index = HashMap<ID, BookData>;

const DATA_PATH: &str = "../data/data.json";

#[derive(Clone, Serialize, Deserialize)]
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
struct UpsertRequest {
    id: ID,
    data: BookData,
}

async fn upsert_item(
    list: State<Arc<RwLock<Index>>>,
    Json(request): Json<UpsertRequest>,
) -> impl IntoResponse {
    let result = (*list)
        .write()
        .unwrap()
        .insert(request.id.clone(), request.data.clone());

    let content = serde_json::to_vec_pretty(&*list.read().unwrap()).unwrap();
    fs::write(DATA_PATH, content).expect("failed to save data to file");

    match result {
        Some(old) => ErasedJson::pretty(json!({
            "updated": request.id,
            "old": old,
            "new": request.data
        })),
        None => ErasedJson::pretty(json!({
            "created": request.id,
            "data": request.data
        })),
    }
}

#[derive(Serialize, Deserialize)]
struct DeleteRequest {
    id: ID,
}

async fn delete_item(
    list: State<Arc<RwLock<Index>>>,
    Json(request): Json<DeleteRequest>,
) -> impl IntoResponse {
    let result = (*list).write().unwrap().remove(&request.id);
    match result {
        Some(data) => {
            let content = serde_json::to_vec_pretty(&*list.read().unwrap()).unwrap();
            fs::write(DATA_PATH, content).expect("failed to save data to file");
            ErasedJson::pretty(json!({
                "deleted": request.id,
                "data": data,
            }))
        }
        None => ErasedJson::pretty(json!({ "not exists": request.id })),
    }
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route(
            "/books",
            get(get_item_list).post(upsert_item).delete(delete_item),
        )
        .with_state(Arc::new(RwLock::new(init_data())));

    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
