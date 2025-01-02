mod routes;
mod config;

use actix_web::{App, HttpServer};
use dotenv::dotenv;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok(); // Load the env variables

    let port = env::var("PORT").unwrap_or_else(|_| "8000".to_string()); // |_| is called a closure,
    /*
    its like there is a value but you dont care what it is.
        full code is like : 
        let result = env::var("PORT").unwrap_or_else(|err| {        // here there can be any number of values |arg1, arg2, ...|
            eprintln!("Error reading PORT: {}", err);
            "8000".to_string()
        });
    */

    println!("server is listening on 127.0.0.1:{}",port);

    HttpServer::new(|| {
      App::new().configure(routes::init_routes)  
    }).bind(format!("127.0.0.1:{}",port))?
    .run()
    .await
    /*
    The ? checks if the .bind call was successful:
    If it succeeds, the value inside Result::Ok is used, and the program continues.
    If it fails, the error inside Result::Err is returned to the caller, effectively exiting the current function.
     */
}