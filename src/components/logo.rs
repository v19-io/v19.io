use leptos::*;
use leptos_dom::IntoView;
use leptos_tabler_icons::*;
use mrvillage_ui::*;

#[component]
pub fn Logo(
    #[prop(into, default = MaybeSignal::Static("".into()))] class: MaybeSignal<String>,
    #[prop(into, default = MaybeSignal::Static(24))] size: MaybeSignal<u16>,
    #[prop(into, default = MaybeSignal::Static(2))] stroke_width: MaybeSignal<u16>,
    #[prop(into, default = MaybeSignal::Static("currentColor".into()))] stroke: MaybeSignal<String>,
    #[prop(into, default = MaybeSignal::Static("none".into()))] fill: MaybeSignal<String>,
    #[prop(into, default = MaybeSignal::Static("round".into()))] stroke_linecap: MaybeSignal<String>,
    #[prop(into, default = MaybeSignal::Static("round".into()))] stroke_linejoin: MaybeSignal<String>,
) -> impl IntoView {
    view! {
        <Icon icon=IconGitCherryPick class=class size=size stroke_width=stroke_width stroke=stroke fill=fill stroke_linecap=stroke_linecap stroke_linejoin=stroke_linejoin />
    }
}
