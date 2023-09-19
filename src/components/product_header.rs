use leptos::*;
use leptos_dom::IntoView;
use leptos_router::*;
use leptos_tabler_icons::*;
use mrvillage_ui::*;

use crate::components::Logo;

#[component]
pub fn ProductHeader() -> impl IntoView {
    view! {
        <div class="top-0 sticky mu-more-b px-6 py-3 flex justify-between gap-4 bg-opacity-50 bg-stone-800 -mb-[60px] w-[calc(100vw - 48px)]">
            <div class="flex">
                <A href="" class="rounded mu-button-transparent flex gap-1 items-center no-underline">
                    <Logo size=36 class="text-white rounded" />
                </A>
            </div>
            <div class="gap-1 flex">
                <A href="projects" class="mu-button mu-button-transparent mu-button-lg flex gap-1 items-center no-underline">
                    <Icon icon=IconCode />
                    <span class="hidden sm:inline">
                        Projects
                    </span>
                </A>
                <A href="contact" class="mu-button mu-button-transparent mu-button-lg flex gap-1 items-center no-underline">
                    <Icon icon=IconAddressBook />
                    <span class="hidden sm:inline">
                        Contact
                    </span>
                </A>
                <A href="about" class="mu-button mu-button-transparent mu-button-lg flex gap-1 items-center no-underline">
                    <Icon icon=IconInfoCircle />
                    <span class="hidden sm:inline">
                        About
                    </span>
                </A>
            </div>
            <div class="flex items-center">
                <Button size=ButtonSize::Lg class="flex gap-1 bg-brand-gradient text-white shadow-md hover:bg-brand-gradient-dark active:bg-brand-gradient-darker items-center">
                    Login
                </Button>
            </div>
        </div>
    }
}
