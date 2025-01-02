use sqlx::{PgPool, Pool, Postgres};
use std::env;

pub async fn establish_connection(){
    let database_url = env::var("DATABASE_URL").expect("DATABASE URL MUST BE SET");
    PgPool::connect(&database_url)
    .await
    .expect("Failed to connect to database");
}