use actix_web::web;

mod project;
mod item;
mod user;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    println!("Initializing routes...");
    cfg.service(
        web::scope("/api")
            .service(user::init_routes())
    );
}