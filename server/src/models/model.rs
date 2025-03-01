use serde::{Deserialize, Serialize};

#[derive(Serialize, sqlx::FromRow)]
pub struct Project {
    pub id: i32,
    pub name: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateProject {
    pub name: String,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Item {
    pub id: i32,
    pub project_id: i32,
    pub name: String,
    pub url: String,
    pub frequency: i32,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateItem {
    pub project_id: i32,
    pub name: String,
    pub url: String,
    pub frequency: i32,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password: String,
    pub project_ids: Vec<i32>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct RegisterUser {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct UserResponse {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub project_ids: Option<Vec<i32>>,
}
