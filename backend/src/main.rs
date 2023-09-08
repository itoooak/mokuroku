use axum::{extract::State, response::IntoResponse, routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{
    fs::{self, File},
    io::Read,
    sync::{Arc, RwLock},
};

const DATA_PATH: &str = "../data/data.json";

#[derive(Serialize, Deserialize)]
struct BookData {
    id: String,
    title: String,
}

fn init_data() -> Vec<BookData> {
    if let Ok(mut file) = File::open(DATA_PATH) {
        let mut serialized = String::new();
        file.read_to_string(&mut serialized)
            .expect("failed to read data from file");
        let data: Vec<BookData> = serde_json::from_str(&serialized).expect("cannot parse file");
        data
    } else {
        Vec::<BookData>::new()
    }
}

async fn get_item_list(list: State<Arc<RwLock<Vec<BookData>>>>) -> impl IntoResponse {
    let items = list.read().unwrap();
    let content = serde_json::to_vec_pretty(&*items).unwrap();
    fs::write(DATA_PATH, content).expect("failed to save data to file");
    Json(json!(*items))
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
        .with_state(Arc::new(RwLock::new(init_data())));

    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
