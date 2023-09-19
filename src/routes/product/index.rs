use leptos::*;
use leptos_dom::IntoView;

use crate::components::ProductHeader;

#[component]
pub fn Index() -> impl IntoView {
    view! {
        <ProductHeader />
        <div class="tw-dark dark bg-black bg-opacity-60 bg-[url('/hero-background.jpg')] bg-cover bg-center pt-48 text-center bg-blend-darken pb-96">
            <h1 class="mx-auto !max-w-[410px] pt-6 px-6 pb-10 !mb-0 !text-4xl !leading-snug sm:!leading-snug sm:!max-w-[600px] sm:!text-5xl">
                Building our <span class="rounded bg-gradient-to-r from-pink-600 to-yellow-600 px-1.5 -mx-1">future</span> one <span class="rounded bg-brand-gradient px-1.5 -mx-1">bit</span> at a time
            </h1>
            // <div class="flex items-center justify-center gap-8">
            //     <Button color=ButtonColor::None size=ButtonSize::Xl class="bg-brand-gradient text-white shadow-md hover:bg-brand-gradient-dark active:bg-brand-gradient-darker">Projects</Button>
            //     <Button color=ButtonColor::Stone size=ButtonSize::Xl>Contact</Button>
            // </div>
        </div>
    }
}
