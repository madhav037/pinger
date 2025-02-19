// #[derive(Ser)]
pub struct User {
    pub id : String,
    pub name: String,
    pub email: String,
    pub password: String,
    pub created_at: chrono::NaiveDateTime
}