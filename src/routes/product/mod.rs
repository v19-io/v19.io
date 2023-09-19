use leptos::*;
use leptos_dom::IntoView;
use leptos_router::*;

mod index;
use index::*;

#[component(transparent)]
pub fn Mod() -> impl IntoView {
    view! {
        <Route path="/product" view=Index />
    }
}
