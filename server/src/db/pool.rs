use sqlx::PgPool;
use crate::utils;
use dotenv::dotenv;

pub async fn init_db() -> PgPool {
    dotenv().ok(); // Load environment variables from .env
    let database_url = (*utils::constants::DATABASE_URL).clone();

    PgPool::connect(&database_url).await.expect("Failed to connect to database")
}
