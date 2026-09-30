import reflex as rx

config = rx.Config(
    app_name="work_profile",
    plugins=[
        rx.plugins.SitemapPlugin(),
        rx.plugins.TailwindV4Plugin(),
        rx.plugins.RadixThemesPlugin(theme=rx.theme(appearance="dark", accent_color="amber")),
    ]
)