"""Build Prince Chakusa's recruiter-ready CV PDF."""

from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf" / "Prince-Chakusa-CV.pdf"
PUBLIC = ROOT / "web" / "public" / "Prince-Chakusa-CV.pdf"

INK = colors.HexColor("#101116")
ORANGE = colors.HexColor("#E64A16")
MUTED = colors.HexColor("#5E6169")
PAPER = colors.HexColor("#F5F2EA")
LINE = colors.HexColor("#D6D1C7")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Name", fontName="Helvetica-Bold", fontSize=34, leading=34, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name="Role", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=ORANGE))
styles.add(ParagraphStyle(name="Contact", fontName="Helvetica", fontSize=8.4, leading=12, textColor=MUTED, alignment=TA_RIGHT))
styles.add(ParagraphStyle(name="Label", fontName="Helvetica-Bold", fontSize=7.3, leading=9, textColor=ORANGE, tracking=1.1, spaceAfter=6))
styles.add(ParagraphStyle(name="Section", fontName="Helvetica-Bold", fontSize=19, leading=21, textColor=INK, spaceBefore=10, spaceAfter=8))
styles.add(ParagraphStyle(name="Summary", fontName="Helvetica", fontSize=9.4, leading=13.2, textColor=INK))
styles.add(ParagraphStyle(name="Job", fontName="Helvetica-Bold", fontSize=10.2, leading=12, textColor=INK))
styles.add(ParagraphStyle(name="Company", fontName="Helvetica-Bold", fontSize=8.7, leading=11, textColor=ORANGE, spaceAfter=3))
styles.add(ParagraphStyle(name="Date", fontName="Helvetica-Bold", fontSize=7.5, leading=10, textColor=MUTED))
styles.add(ParagraphStyle(name="CvBullet", fontName="Helvetica", fontSize=8.25, leading=10.5, leftIndent=9, firstLineIndent=-7, textColor=INK, spaceAfter=2))
styles.add(ParagraphStyle(name="Small", fontName="Helvetica", fontSize=8.2, leading=11.2, textColor=MUTED))
styles.add(ParagraphStyle(name="SmallHead", fontName="Helvetica-Bold", fontSize=9.3, leading=11, textColor=INK, spaceAfter=3))
styles.add(ParagraphStyle(name="Stat", fontName="Helvetica-Bold", fontSize=18, leading=19, textColor=ORANGE, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="StatLabel", fontName="Helvetica", fontSize=6.8, leading=8.4, textColor=MUTED))


def rule():
    line = Table([[""]], colWidths=[190 * mm], rowHeights=[1])
    line.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.8, LINE)]))
    return line


def bullet(text):
    return Paragraph(f"- {text}", styles["CvBullet"])


def job(date, title, company, bullets):
    heading = Table(
        [[Paragraph(date, styles["Date"]), Paragraph(title, styles["Job"])]],
        colWidths=[34 * mm, 154 * mm],
        hAlign="LEFT",
    )
    heading.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    content = [heading, Table([["", Paragraph(company, styles["Company"])]], colWidths=[34 * mm, 154 * mm], style=[("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)])]
    content.extend(Table([["", bullet(item)]], colWidths=[34 * mm, 154 * mm], style=[("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("VALIGN", (0, 0), (-1, -1), "TOP")]) for item in bullets)
    content.extend([Spacer(1, 5), rule(), Spacer(1, 6)])
    return KeepTogether(content)


def page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.rect(0, A4[1] - 5 * mm, A4[0], 5 * mm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(12 * mm, 7 * mm, "PRINCE CHAKUSA - CV")
    canvas.drawRightString(A4[0] - 12 * mm, 7 * mm, f"PAGE {doc.page}")
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=11 * mm, rightMargin=11 * mm, topMargin=12 * mm, bottomMargin=13 * mm, title="Prince Chakusa CV", author="Prince Chakusa")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates(PageTemplate(id="cv", frames=[frame], onPage=page))
    story = []

    contact = "Abu Dhabi, UAE<br/>chakusaprince@gmail.com<br/>linkedin.com/in/princechakusa<br/>github.com/princechakusa"
    head = Table([[Paragraph("Prince Chakusa", styles["Name"]), Paragraph(contact, styles["Contact"])]], colWidths=[123 * mm, 65 * mm])
    head.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    story.extend([head, Paragraph("GUEST RELATIONS EXECUTIVE SUPERVISOR | PROPERTY OPERATIONS | SOFTWARE BUILDER", styles["Role"]), Spacer(1, 8), rule(), Spacer(1, 10)])
    story.extend([Paragraph("PROFILE", styles["Label"]), Paragraph("UAE holiday home professional with experience from guest check-in through team and portfolio leadership. Responsible for more than 350 units, experienced in leading teams of up to 12 people, and credited with a 25% increase in guest review scores. I also build software, including PaMarket and FixHub, to solve operational problems at the source.", styles["Summary"]), Spacer(1, 11)])

    stats = [("350+", "units under responsibility"), ("12", "people in largest team"), ("+25%", "guest review scores"), ("4", "UAE holiday home companies")]
    stat_table = Table([[Paragraph(n, styles["Stat"]) for n, _ in stats], [Paragraph(label, styles["StatLabel"]) for _, label in stats]], colWidths=[47 * mm] * 4)
    stat_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#ECE7DD")), ("BOX", (0, 0), (-1, -1), 0.6, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, 0), 6), ("BOTTOMPADDING", (0, 1), (-1, 1), 7)]))
    story.extend([stat_table, Paragraph("EXPERIENCE", styles["Section"])])
    story.append(job("APR 2026 - PRESENT", "Guest Relations Supervisor", "The Authors Holiday Homes", ["Supervise the guest relations team from arrival through departure.", "Handle escalated guest issues and coach the team to resolve problems the first time.", "Improved team systems, processes and shift management standards."]))
    story.append(job("JAN 2026 - MAR 2026", "Guest Experience Lead", "Luxury Homevy", ["Led guest experience across 40 properties with a team of five.", "Analysed more than 200 guest reviews to identify what guests value most.", "Tracked service levels and standard operating procedures across the portfolio."]))
    story.append(job("NOV 2024 - DEC 2025", "Customer Care Agent, promoted to Team Leader of Property Operations", "Stonetree", ["Managed operations for more than 350 units and led a team of 12.", "Coordinated concierge, maintenance and housekeeping teams.", "Maintained DTCM compliance, SOPs, vendor SLAs and management reporting."]))
    story.append(job("JAN 2023 - OCT 2024", "Guest Relations Officer", "Daniels Holiday Homes", ["Increased guest review scores by 25% and guest satisfaction by 20%.", "Reduced front desk workload by 40% through digital concierge tools.", "Reduced onboarding time by 20% while supporting guests throughout their stay."]))

    story.append(PageBreak())
    story.append(Paragraph("SELECTED PROJECTS", styles["Section"]))
    story.extend([Paragraph("PaMarket", styles["SmallHead"]), Paragraph("A marketplace built for Zimbabwe where people can buy, sell, find work and discover trusted businesses. Live on the web, App Store and Google Play. pamarketzw.com", styles["Small"]), Spacer(1, 9), Paragraph("FixHub", styles["SmallHead"]), Paragraph("A maintenance ticketing system for property managers to log, assign and track jobs until completion, built because requests were getting lost in group chats.", styles["Small"]), Spacer(1, 12), rule()])
    story.append(Paragraph("LEADERSHIP & OPERATING STRENGTHS", styles["Section"]))
    strength_rows = [
        [Paragraph("GUEST EXPERIENCE", styles["Label"]), Paragraph("Frontline knowledge from check-in through review, with a focus on resolving issues the first time.", styles["Small"]), Paragraph("TEAM LEADERSHIP", styles["Label"]), Paragraph("Led up to 12 people across concierge, maintenance and housekeeping.", styles["Small"])],
        [Paragraph("PORTFOLIO OPERATIONS", styles["Label"]), Paragraph("DTCM compliance, SOPs, vendor SLAs and reporting across 350+ units.", styles["Small"]), Paragraph("SYSTEMS THINKING", styles["Label"]), Paragraph("Builds software and improves processes instead of repeatedly working around the same problem.", styles["Small"])],
    ]
    strengths_table = Table(strength_rows, colWidths=[30 * mm, 62 * mm, 30 * mm, 66 * mm])
    strengths_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 9)]))
    story.extend([strengths_table, rule()])
    story.append(Paragraph("CORE SKILLS", styles["Section"]))
    skill_rows = [
        [Paragraph("OPERATIONS", styles["Label"]), Paragraph("Guest relations, check-in and guest support, team leadership and coaching, DTCM compliance, SOPs, vendor SLAs, reporting, review analysis", styles["Small"])],
        [Paragraph("TOOLS", styles["Label"]), Paragraph("Hostaway, WhatsApp for guest communication, digital concierge tools", styles["Small"])],
        [Paragraph("TECHNOLOGY", styles["Label"]), Paragraph("Software development, JavaScript, HTML and CSS, Supabase, PostgreSQL, IT support (CompTIA A+)", styles["Small"])],
    ]
    skills_table = Table(skill_rows, colWidths=[35 * mm, 153 * mm], rowHeights=None)
    skills_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
    story.extend([skills_table, rule(), Paragraph("EDUCATION & CERTIFICATIONS", styles["Section"])])
    education = [
        ("Associate of Science in Computer Science", "Completed 2026", "Programming, systems and software development."),
        ("Business Management Diploma", "Completed", "Planning, organising people and running operations."),
        ("CompTIA A+", "Completed", "Hardware, software, networks and IT troubleshooting."),
        ("Bachelor of Business Administration", "In progress", "Leadership, finance, strategy and management."),
        ("AML-CFT Certificate", "In progress", "Anti-money laundering and countering the financing of terrorism."),
    ]
    for name, status, detail in education:
        row = Table([[Paragraph(name, styles["SmallHead"]), Paragraph(status.upper(), styles["Date"]), Paragraph(detail, styles["Small"])]], colWidths=[75 * mm, 30 * mm, 83 * mm])
        row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 6), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6), ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE)]))
        story.append(row)
    story.extend([Spacer(1, 15), Paragraph("OPEN TO ROLES IN THE UAE, THE GCC AND REMOTE", styles["Label"]), Paragraph("Email: chakusaprince@gmail.com", styles["SmallHead"])])
    doc.build(story)
    shutil.copyfile(OUTPUT, PUBLIC)
    print(OUTPUT)


if __name__ == "__main__":
    build()
