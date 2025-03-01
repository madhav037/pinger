use actix_web::{get, post, web, HttpResponse, Responder};
use bcrypt::{hash, DEFAULT_COST};
use sqlx::PgPool;

use crate::models::model::{RegisterUser, UserResponse};

#[get("/test")]
async fn user_test() -> impl Responder {
    HttpResponse::Ok().body("User test route")
}


#[post("/login/{email}/{password}")]
async fn login(path: web::Path<(String, String)>) -> impl Responder {
    let (email, password) = path.into_inner();
    HttpResponse::Ok().body("User login route")
}


#[post("/register")]
async fn register(pool: web::Data<PgPool>, body: web::Json<RegisterUser>) -> impl Responder {
    let RegisterUser { name, email, password, .. } = body.into_inner();

    // Check if user already exists
    let existing_user = sqlx::query!("SELECT id FROM users WHERE email = $1", email)
        .fetch_optional(pool.get_ref())
        .await
        .expect("Failed to fetch user");

    if existing_user.is_some() {
        return HttpResponse::BadRequest().body("User already exists");
    }

    // Hash password
    let hashed_password = match hash(&password, DEFAULT_COST) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().body("Failed to hash password"),
    };

    // Insert user
    let result = sqlx::query_as!(
        UserResponse,
        "INSERT INTO users (name, email, password, project_ids) VALUES ($1, $2, $3, $4) RETURNING id, name, email, project_ids",
        name,   // Ensure schema and Rust field names match
        email,
        hashed_password,
        &Vec::<i32>::new()
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => HttpResponse::Created().json(user),
        Err(_) => HttpResponse::InternalServerError().body("Failed to create user"),
    }
}


#[post("/logout/{user_id}")]
async fn logout(_user_id : web::Path<i32>) -> impl Responder {
    HttpResponse::Ok().body("User logout route")
}

#[post("/update/{user_id}/{username}/{email}/{password}")]
async fn update(path: web::Path<(u128, String, String, String)>) -> impl Responder {
    let (user_id, username, email, password) = path.into_inner();
    HttpResponse::Ok().body("User update route")
}

#[post("/delete/{user_id}")]
async fn delete(user_id : web::Path<u128>) -> impl Responder {
    HttpResponse::Ok().body("User delete route")
}

#[get("/get/{user_id}")]
async fn get(user_id : web::Path<u128>) -> impl Responder {
    HttpResponse::Ok().body("User get route")
}

