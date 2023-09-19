use leptos::*;
use leptos_dom::IntoView;
use leptos_router::*;

mod product;

#[component(transparent)]
pub fn Mod() -> impl IntoView {
    view! {
        // <Route path="/" view=move || view! { <Redirect path="/product" /> }>
        <Route path="/" view=move || () />
        <product::Mod />
    }
}
