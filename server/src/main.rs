use actix_web::{web, middleware::Logger, App, HttpServer};
use sqlx::PgPool;
use tokio::sync::OnceCell;

mod utils;
mod routes;
mod db;
mod models;

static DB_POOL: OnceCell<PgPool> = OnceCell::const_new();

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }    

    dotenv::dotenv().ok();
    env_logger::init();

    let port = (*utils::constants::PORT).clone();
    let address = (*utils::constants::ADDRESS).clone();
    let pool = db::pool::init_db().await;
    DB_POOL.set(pool.clone()).expect("Failed to set DB_POOL");

    HttpServer::new(move || {
        App::new()
        .app_data(web::Data::new(pool.clone()))
        .wrap(Logger::default())
        .configure(routes::user::config)
    })
    .bind((address, port))?
    .run()
    .await
}
