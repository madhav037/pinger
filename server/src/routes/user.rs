use actix_web::web;

use super::handlers;

pub fn config(config: &mut web::ServiceConfig) {
    config
    .service(web::scope("/user")
        .service(handlers::user_handler::login)
        .service(handlers::user_handler::register)
        .service(handlers::user_handler::logout)
        .service(handlers::user_handler::update)
        .service(handlers::user_handler::delete)
        .service(handlers::user_handler::get)
        .service(handlers::user_handler::user_test)
    );
}


// pub fn init_routes() -> Scope {
//     web::scope("/user")
//         .service(user_test)
// }