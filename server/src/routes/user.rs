use actix_web::{get, web, HttpResponse, Responder, Scope};

#[get("/test")]
async fn user_test() -> impl Responder {
    HttpResponse::Ok().body("User test route")
}

pub fn init_routes() -> Scope {
    web::scope("/user")
        .service(user_test)
}