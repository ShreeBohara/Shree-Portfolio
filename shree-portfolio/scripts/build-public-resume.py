"""Render the approved public résumé JSON to a one-column PDF and semantic HTML.

Requires reportlab. Run scripts/export-public-resume.ts first. This script never
imports career dossiers, environment files, private records or provider clients.
"""
from datetime import datetime
from hashlib import sha256
from html import escape
from pathlib import Path
import json

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, KeepTogether

APP = Path(__file__).resolve().parent.parent
raw = (APP / 'docs/public-resume.json').read_bytes()
data = json.loads(raw)
fingerprint = sha256(raw).hexdigest()
pdf = APP / 'public/Shree_Bohara_Resume.pdf'
temporary_pdf = pdf.with_suffix('.pdf.tmp')
html = APP / 'public/resume.html'


def plain(value):
    return str(value).replace('–', '-').replace('—', '-').replace('’', "'").replace('·', '|')


def text(value):
    return escape(plain(value))


def date(value):
    return datetime.strptime(value, '%Y-%m').strftime('%b %Y') if value else 'Present'


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='ResumeName', fontName='Helvetica-Bold', fontSize=22, leading=25, spaceAfter=5))
styles.add(ParagraphStyle(name='ResumeTitle', fontName='Helvetica', fontSize=10, leading=13, textColor=colors.HexColor('#333333'), spaceAfter=4))
styles.add(ParagraphStyle(name='ResumeContact', fontName='Helvetica', fontSize=9, leading=12, spaceAfter=7))
styles.add(ParagraphStyle(name='ResumeHeading', fontName='Helvetica-Bold', fontSize=11, leading=14, spaceBefore=6, spaceAfter=3, textColor=colors.HexColor('#16334d')))
styles.add(ParagraphStyle(name='ResumeItem', fontName='Helvetica-Bold', fontSize=10, leading=13, spaceBefore=4, spaceAfter=2))
styles.add(ParagraphStyle(name='ResumeBody', fontName='Helvetica', fontSize=9.5, leading=12.2, alignment=TA_LEFT, spaceAfter=2))
styles.add(ParagraphStyle(name='ResumeBullet', parent=styles['ResumeBody'], leftIndent=9, firstLineIndent=-9))
styles.add(ParagraphStyle(name='ResumeFooter', fontName='Helvetica', fontSize=8, leading=10, spaceBefore=7, textColor=colors.HexColor('#555555')))

blocks = []
web = []


def paragraph(value, style='ResumeBody'):
    return Paragraph(value, styles[style])


def heading(value):
    blocks.append(paragraph(text(value), 'ResumeHeading'))
    web.append(f'<h2>{escape(value)}</h2>')


blocks.append(paragraph(text(data['name']), 'ResumeName'))
blocks.append(paragraph(f"{text(data['title'])} | {text(data['location'])}", 'ResumeTitle'))
contacts = ' | '.join(f'<a href="{escape(c["url"], quote=True)}" color="#16334d">{text(c["text"])}</a>' for c in data['contacts'])
blocks.append(paragraph(contacts, 'ResumeContact'))
blocks.append(paragraph(text(data['summary'])))
web.extend([f'<h1>{escape(data["name"])}</h1>', f'<p>{escape(data["title"])} · {escape(data["location"])}</p>', f'<nav aria-label="Contact links">{contacts.replace(" color=\"#16334d\"", "")}</nav>', f'<p>{escape(data["summary"])}</p>'])

heading('Experience')
for item in data['experiences']:
    period = f'{date(item["start"])} - {date(item["end"])}'
    title = f'{text(item["company"])} | {text(item["role"])}'
    group = [paragraph(title, 'ResumeItem'), paragraph(f'{text(period)} | {text(item["location"])}')]
    group += [paragraph(f'- {text(line)}', 'ResumeBullet') for line in item['highlights']]
    blocks.append(KeepTogether(group))
    web.append(f'<section><h3>{escape(item["company"])} — {escape(item["role"])}</h3><p>{escape(period)} · {escape(item["location"])}</p><ul>' + ''.join(f'<li>{escape(line)}</li>' for line in item['highlights']) + '</ul></section>')

heading('Selected Projects')
for item in data['projects']:
    title = f'<a href="{escape(item["url"], quote=True)}" color="#16334d">{text(item["title"])}</a>'
    blocks.append(KeepTogether([paragraph(f'{title} | {text(item["duration"])}', 'ResumeItem'), paragraph(text(item['summary']))]))
    web.append(f'<section><h3><a href="{escape(item["url"], quote=True)}">{escape(item["title"])}</a></h3><p>{escape(item["duration"])}</p><p>{escape(item["summary"])}</p></section>')

heading('Education')
for item in data['education']:
    blocks.append(paragraph(f'<b>{text(item["institution"])}</b> | {text(item["degree"])}'))
    blocks.append(paragraph(text(item['completion'])))
    web.append(f'<p><strong>{escape(item["institution"])}</strong> — {escape(item["degree"])}<br>{escape(item["completion"])}</p>')

heading('Selected Skills')
for group in data['skills']:
    skills = ', '.join(group['items'])
    blocks.append(paragraph(f'<b>{text(group["category"])}:</b> {text(skills)}'))
    web.append(f'<p><strong>{escape(group["category"])}</strong>: {escape(skills)}</p>')

if data['awards']:
    heading('Selected Awards')
    blocks.append(paragraph(text(data['awards'])))
    web.append(f'<p>{escape(data["awards"])}</p>')

blocks.append(paragraph('Project details and team / AI contributions: <a href="https://shreebohara.com/browse" color="#16334d">shreebohara.com/browse</a>', 'ResumeFooter'))
doc = SimpleDocTemplate(str(temporary_pdf), pagesize=letter, leftMargin=38, rightMargin=38, topMargin=30, bottomMargin=30, title='Shree Bohara - Public Resume', author=data['name'], subject=f'Public portfolio content SHA-256: {fingerprint}')
page_count = [0]


def count_page(canvas, document):
    page_count[0] += 1


doc.build(blocks, onFirstPage=count_page, onLaterPages=count_page)
if page_count[0] != 1:
    temporary_pdf.unlink(missing_ok=True)
    raise ValueError(f'Public résumé overflowed to {page_count[0]} pages. Condense the curated content or review the layout before replacing the valid PDF.')
temporary_pdf.replace(pdf)

css = 'body{font:16px/1.55 system-ui,sans-serif;color:#17202a;max-width:760px;margin:2rem auto;padding:0 1.25rem}h1{margin-bottom:0}h2{border-bottom:1px solid #ccd2d8;padding-bottom:.2rem;margin-top:1.5rem}h3{margin-bottom:.25rem}p{margin:.3rem 0 .75rem}a{color:#16334d}nav{margin:.7rem 0}li{margin:.25rem 0}.actions{margin:1rem 0}@media print{.actions{display:none}body{font-size:10pt;margin:0}section{break-inside:avoid}}'
html.write_text(f'<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="portfolio-content-sha256" content="{fingerprint}"><title>Shree Bohara — Public résumé</title><style>{css}</style></head><body><main><p class="actions"><a href="/about">Portfolio</a> · <a href="/Shree_Bohara_Resume.pdf">Download PDF</a></p>' + '\n'.join(web) + '</main></body></html>\n', encoding='utf-8')
print(f'Built {pdf} and {html}; source SHA-256 {fingerprint}')
