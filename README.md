# Work Profile

Interactive portfolio for Prince Chakusa, built entirely in Python with [Reflex](https://reflex.dev).

## Run it

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\reflex run      # http://localhost:3000
```

## Layout

- `work_profile/data.py` - all content (experience, projects, skills). Edit here.
- `work_profile/work_profile.py` - page sections and interactive state (project filter, expandable roles).
- `assets/motion.css` - theme and animations (pure CSS: aurora glow, count-up stats, scroll reveals, skill bars).
- `legacy-html/` - the previous static HTML site, kept for reference.
- `PORTFOLIO_AND_ROADMAP.md` - GitHub profile audit and 90-day plan.
