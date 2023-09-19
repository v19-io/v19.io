use leptos::*;
use leptos_dom::IntoView;
use leptos_meta::{provide_meta_context, Stylesheet, Title};
use leptos_router::*;

use crate::routes::Mod;

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Stylesheet id="mrvillage-ui" href="/mrvillage-ui.css" />
        <Stylesheet id="leptos" href="/pkg/v19-io.css" />
        <Title text="v19" />
        <Router>
            <div class="tw-dark dark">
                <main class="text-center min-h-[1000vh] w-full !max-w-full mu-main-bg mu-prose">
                    <Routes>
                        <Mod />
                    </Routes>
                </main>
            </div>
        </Router>
    }
}
