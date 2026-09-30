"""Prince Chakusa - interactive portfolio, written entirely in Python with Reflex."""

import reflex as rx

from . import data

FONTS = (
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400"
    "&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap"
)


class State(rx.State):
    """Interactive state: project filter and expandable experience cards."""

    project_filter: str = "All"
    open_role: int = 0

    @rx.event
    def set_filter(self, value: str):
        self.project_filter = value

    @rx.event
    def toggle_role(self, index: int):
        self.open_role = -1 if self.open_role == index else index


def div(*children, **props) -> rx.Component:
    return rx.el.div(*children, **props)


def section(id_: str, eyebrow: str, title: str, *children) -> rx.Component:
    return rx.el.section(
        div(
            rx.el.p(eyebrow, class_name="mono reveal", style={"color": "var(--gold)", "letterSpacing": ".18em", "textTransform": "uppercase", "fontSize": "12px"}),
            rx.el.h2(title, class_name="serif reveal", style={"fontSize": "clamp(32px,5vw,52px)", "margin": "8px 0 36px", "lineHeight": "1.1"}),
            *children,
            style={"maxWidth": "1100px", "margin": "0 auto", "padding": "0 24px"},
        ),
        id=id_,
        style={"padding": "96px 0"},
    )


def nav() -> rx.Component:
    links = [("About", "about"), ("Experience", "experience"), ("Projects", "projects"), ("Skills", "skills"), ("Education", "education")]
    return rx.el.nav(
        rx.el.a("Prince", rx.el.span(".", style={"color": "var(--gold)"}), href="#top", class_name="serif brand"),
        div(
            *[rx.el.a(label, href=f"#{anchor}") for label, anchor in links],
            rx.el.a("Hire me", href="#contact", class_name="btn btn-gold", style={"padding": "8px 18px", "marginLeft": "22px"}),
            class_name="links",
            style={"display": "flex", "alignItems": "center"},
        ),
        class_name="nav",
    )


def hero() -> rx.Component:
    return rx.el.header(
        div(
            rx.el.p(
                "Dubai - ",
                rx.el.span(rx.el.span(*[rx.el.span(r) for r in data.ROLES]), class_name="roles"),
                class_name="mono rise d1",
                style={"color": "var(--gold)", "letterSpacing": ".16em", "textTransform": "uppercase", "fontSize": "13px"},
            ),
            rx.el.h1(
                rx.el.span(data.HERO_LINES[0], class_name="rise d2", style={"display": "block"}),
                rx.el.span(data.HERO_LINES[1], class_name="rise d3", style={"display": "block"}),
                rx.el.span(rx.el.span(data.HERO_LINES[2], class_name="gold-text"), class_name="rise d4", style={"display": "block", "fontStyle": "italic"}),
                class_name="serif",
                style={"fontSize": "clamp(44px,8vw,96px)", "lineHeight": "1.05", "margin": "18px 0 24px"},
            ),
            rx.el.p(data.HERO_SUB, class_name="rise d5", style={"maxWidth": "560px", "fontSize": "19px", "color": "var(--muted)", "lineHeight": "1.6"}),
            div(
                rx.el.a("See my work", href="#projects", class_name="btn btn-gold"),
                rx.el.a("Get in touch", href="#contact", class_name="btn btn-ghost"),
                class_name="rise d5",
                style={"display": "flex", "gap": "14px", "marginTop": "34px", "flexWrap": "wrap"},
            ),
            style={"maxWidth": "1100px", "margin": "0 auto", "padding": "0 24px"},
        ),
        rx.el.a("scroll", href="#stats", class_name="cue mono", style={"position": "absolute", "bottom": "28px", "left": "50%", "color": "var(--muted)", "fontSize": "12px"}),
        id="top",
        style={"minHeight": "100vh", "display": "flex", "alignItems": "center", "position": "relative", "paddingTop": "80px"},
    )


def stats() -> rx.Component:
    return rx.el.section(
        div(
            *[
                div(
                    div(
                        rx.el.span(s["prefix"]),
                        rx.el.span(class_name="count", style={"--to": str(s["value"])}),
                        rx.el.span(s["suffix"]),
                        class_name="serif gold-text",
                        style={"fontSize": "clamp(36px,5vw,56px)"},
                    ),
                    rx.el.p(s["label"], style={"color": "var(--muted)", "fontSize": "14px", "marginTop": "4px"}),
                    class_name="card reveal",
                    style={"padding": "28px", "textAlign": "center"},
                )
                for s in data.STATS
            ],
            style={"maxWidth": "1100px", "margin": "0 auto", "padding": "0 24px", "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(200px,1fr))", "gap": "18px"},
        ),
        id="stats",
        style={"padding": "24px 0 0"},
    )


def about() -> rx.Component:
    return section(
        "about", "About", "I run operations and build software.",
        div(
            div(
                rx.image(src="/profile.jpg", alt="Prince Chakusa", style={"width": "100%", "borderRadius": "18px", "objectFit": "cover", "aspectRatio": "4/5"}),
                class_name="card reveal",
                style={"padding": "10px", "alignSelf": "start"},
            ),
            div(
                *[rx.el.p(p, class_name="reveal", style={"color": "var(--muted)", "lineHeight": "1.75", "fontSize": "17px", "marginBottom": "16px"}) for p in data.ABOUT],
                div(
                    *[
                        div(rx.el.h4(t, style={"color": "var(--gold)", "marginBottom": "6px"}), rx.el.p(d, style={"color": "var(--muted)", "fontSize": "14px"}), class_name="card reveal", style={"padding": "18px"})
                        for t, d in data.DIFFERENTIATORS
                    ],
                    style={"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(220px,1fr))", "gap": "14px", "marginTop": "24px"},
                ),
            ),
            style={"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(280px,1fr))", "gap": "40px"},
        ),
    )


def role_card(i: int, r: dict) -> rx.Component:
    return div(
        div(class_name="dot live" if r["current"] else "dot"),
        div(
            div(
                div(
                    rx.el.h3(r["role"], class_name="serif", style={"fontSize": "24px"}),
                    rx.el.p(r["company"], style={"color": "var(--gold)", "fontSize": "14px"}),
                ),
                rx.el.span(r["dates"], class_name="mono", style={"color": "var(--muted)", "fontSize": "12px"}),
                style={"display": "flex", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap"},
            ),
            rx.el.p(r["summary"], style={"color": "var(--muted)", "margin": "14px 0", "lineHeight": "1.7"}),
            rx.cond(
                State.open_role == i,
                rx.el.p(r["detail"], class_name="rise", style={"color": "var(--cream)", "lineHeight": "1.7", "marginBottom": "14px", "animationDelay": "0s"}),
            ),
            div(*[rx.el.span(c, class_name="chip chip-gold" if j < 2 else "chip") for j, c in enumerate(r["chips"])], style={"display": "flex", "gap": "8px", "flexWrap": "wrap"}),
            rx.el.p(rx.cond(State.open_role == i, "Show less -", "Read more +"), class_name="mono", style={"color": "var(--gold)", "fontSize": "12px", "marginTop": "14px"}),
            class_name="card",
            style={"padding": "26px", "cursor": "pointer"},
            on_click=State.toggle_role(i),
        ),
        class_name="reveal",
        style={"position": "relative", "marginBottom": "26px"},
    )


def experience() -> rx.Component:
    return section(
        "experience", "Work history", "Three roles. Every number is real.",
        div(*[role_card(i, r) for i, r in enumerate(data.EXPERIENCE)], class_name="timeline"),
    )


def project_card(p: dict) -> rx.Component:
    small = {"padding": "8px 18px", "fontSize": "14px"}
    card = div(
        div(rx.image(src=p["image"], alt=p["name"], style={"width": "100%", "height": "100%", "objectFit": "cover", "objectPosition": "center"}), style={"minHeight": "320px", "height": "100%", "overflow": "hidden"}),
        div(
            rx.el.span(p["kind"], class_name="mono", style={"color": "var(--gold)", "fontSize": "11px", "textTransform": "uppercase", "letterSpacing": ".14em"}),
            rx.el.h3(p["name"], class_name="serif", style={"fontSize": "26px", "margin": "6px 0"}),
            rx.el.p(p["tagline"], style={"fontWeight": "600", "marginBottom": "10px"}),
            rx.el.p(p["story"], style={"color": "var(--muted)", "fontSize": "14px", "lineHeight": "1.65"}),
            div(*[rx.el.span(t, class_name="chip") for t in p["tags"]], style={"display": "flex", "gap": "8px", "flexWrap": "wrap", "margin": "16px 0"}),
            div(
                *([rx.el.a("Visit website", href=p["live"], target="_blank", class_name="btn btn-gold", style=small)] if p.get("live") else []),
                *([rx.el.a("App Store", href=p["ios"], target="_blank", class_name="btn btn-ghost", style=small)] if p.get("ios") else []),
                *([rx.el.a("Google Play", href=p["android"], target="_blank", class_name="btn btn-ghost", style=small)] if p.get("android") else []),
                rx.el.a("GitHub", href=p["repo"], target="_blank", class_name="btn btn-ghost", style=small),
                style={"display": "flex", "gap": "10px", "flexWrap": "wrap"},
            ),
            style={"padding": "22px"},
        ),
        class_name="card",
        style={"overflow": "hidden", "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(300px,1fr))"},
    )
    return rx.cond((State.project_filter == "All") | (State.project_filter == p["kind"]), card, rx.fragment())


def projects() -> rx.Component:
    kinds = ["All"] + sorted({p["kind"] for p in data.PROJECTS})
    filters = div(
        *[
            rx.el.button(
                k,
                on_click=State.set_filter(k),
                class_name="btn",
                style={
                    "padding": "8px 18px", "fontSize": "14px", "border": "1px solid var(--line)",
                    "background": rx.cond(State.project_filter == k, "var(--gold)", "transparent"),
                    "color": rx.cond(State.project_filter == k, "var(--espresso)", "var(--cream)"),
                },
            )
            for k in kinds
        ],
        style={"display": "flex", "gap": "10px", "flexWrap": "wrap", "marginBottom": "30px"},
    )
    return section(
        "projects", "Selected work", "Things I've built.",
        *([filters] if len(kinds) > 2 else []),
        div(*[project_card(p) for p in data.PROJECTS], style={"display": "grid", "gridTemplateColumns": "1fr", "gap": "22px"}),
    )


def skill_group(title: str, items: list) -> rx.Component:
    return div(
        rx.el.h3(title, class_name="serif", style={"fontSize": "24px", "marginBottom": "18px"}),
        *[
            div(
                div(rx.el.span(name), rx.el.span(f"{lvl}%", class_name="mono", style={"color": "var(--gold)", "fontSize": "12px"}), style={"display": "flex", "justifyContent": "space-between", "marginBottom": "6px", "fontSize": "14px"}),
                div(div(class_name="bar-fill", style={"--w": f"{lvl}%"}), style={"height": "8px", "background": "var(--line)", "borderRadius": "999px", "overflow": "hidden"}),
                style={"marginBottom": "16px"},
            )
            for name, lvl in items
        ],
        class_name="card reveal",
        style={"padding": "26px"},
    )


def skills() -> rx.Component:
    return section(
        "skills", "What I work with", "Skills & tools.",
        div(*[skill_group(t, i) for t, i in data.SKILLS.items()], style={"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(300px,1fr))", "gap": "22px"}),
        div(*[rx.el.span(t, class_name="chip") for t in data.TOOLS], class_name="reveal", style={"display": "flex", "gap": "10px", "flexWrap": "wrap", "marginTop": "28px"}),
    )


def education() -> rx.Component:
    return section(
        "education", "Credentials", "Education.",
        div(
            *[
                div(
                    rx.el.span(tag, class_name="mono", style={"color": "var(--gold)", "fontSize": "12px"}),
                    rx.el.h3(title, class_name="serif", style={"fontSize": "20px", "margin": "8px 0"}),
                    rx.el.p(sub, style={"color": "var(--muted)", "fontSize": "14px"}),
                    class_name="card reveal",
                    style={"padding": "24px"},
                )
                for title, sub, tag in data.EDUCATION
            ],
            style={"display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(240px,1fr))", "gap": "18px"},
        ),
    )


def contact() -> rx.Component:
    return section(
        "contact", "Get in touch", "Let's talk.",
        div(
            rx.el.p(
                "I'm based in Dubai and open to a role where operations depth and technical ability "
                "both matter. Email is best. I check it and I respond.",
                style={"color": "var(--muted)", "fontSize": "18px", "lineHeight": "1.7", "maxWidth": "620px"},
            ),
            div(*[rx.el.span(r, class_name="chip chip-gold") for r in data.OPEN_TO], style={"display": "flex", "gap": "10px", "flexWrap": "wrap", "margin": "24px 0"}),
            rx.el.p(f"Markets: {data.MARKETS}", class_name="mono", style={"color": "var(--muted)", "fontSize": "13px"}),
            div(
                rx.el.a("Send an email", href=f"mailto:{data.EMAIL}", class_name="btn btn-gold"),
                rx.el.a("LinkedIn", href=data.LINKEDIN, target="_blank", class_name="btn btn-ghost"),
                rx.el.a("GitHub", href=data.GITHUB, target="_blank", class_name="btn btn-ghost"),
                style={"display": "flex", "gap": "14px", "flexWrap": "wrap", "marginTop": "28px"},
            ),
            class_name="card reveal",
            style={"padding": "40px"},
        ),
    )


def footer() -> rx.Component:
    return rx.el.footer(
        rx.el.p(f"(c) {data.NAME}. Built in Python with Reflex.", style={"color": "var(--muted)", "fontSize": "13px"}),
        style={"textAlign": "center", "padding": "40px 24px", "borderTop": "1px solid var(--line)"},
    )


def index() -> rx.Component:
    return div(
        div(class_name="aurora"),
        div(class_name="progress"),
        nav(),
        hero(),
        stats(),
        about(),
        experience(),
        projects(),
        skills(),
        education(),
        contact(),
        footer(),
    )


app = rx.App(stylesheets=[FONTS, "/motion.css"])
app.add_page(
    index,
    route="/",
    title="Prince Chakusa - Operations Leader & PropTech Builder",
    description="Interactive portfolio of Prince Chakusa: 5 years running 350+ Dubai holiday homes, now building the software they need.",
)
