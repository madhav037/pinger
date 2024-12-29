use actix_web::{web, App, HttpServer, Responder};
use std::env;
use dotenv::dotenv;

async fn greet() -> impl Responder {
    "Hello, world!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok(); // Load .env file

    // Get the host and port from the environment variables
    let host = env::var("HOST").unwrap_or_else(|_| String::from("0.0.0.0"));
    let port = env::var("PORT").unwrap_or_else(|_| String::from("8080"));

    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(greet)) // Define a route for the root path
    })
    .bind(format!("{}:{}", host, port))? // Bind to the host and port
    .run()
    .await
}
