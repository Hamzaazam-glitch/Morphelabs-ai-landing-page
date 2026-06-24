from reportlab.lib.pagesizes import LETTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, ListFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib import colors

output_path = "MorpheLabs_Project_Report.pdf"
doc = SimpleDocTemplate(output_path, pagesize=LETTER, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleStyle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=24, leading=28, alignment=TA_CENTER, textColor=colors.HexColor('#071A2D')))
styles.add(ParagraphStyle(name='HeadingStyle', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=13, leading=16, textColor=colors.HexColor('#0D3B66'), spaceBefore=10, spaceAfter=6))
styles.add(ParagraphStyle(name='BodyStyle', parent=styles['BodyText'], fontName='Helvetica', fontSize=10.5, leading=14.5, textColor=colors.HexColor('#23313F')))
styles.add(ParagraphStyle(name='SubtleStyle', parent=styles['BodyText'], fontName='Helvetica-Oblique', fontSize=9.5, leading=12.5, textColor=colors.HexColor('#5A6B7A')))
styles.add(ParagraphStyle(name='BulletStyle', parent=styles['BodyText'], fontName='Helvetica', fontSize=10.2, leading=13.5, leftIndent=14, bulletIndent=0, spaceAfter=3, textColor=colors.HexColor('#23313F')))
styles.add(ParagraphStyle(name='ListStyle', parent=styles['BodyText'], fontName='Helvetica', fontSize=10.2, leading=13.5, leftIndent=14, bulletIndent=0, spaceAfter=3, textColor=colors.HexColor('#23313F')))

content = []
content.append(Paragraph("MorpheLabs Website Redesign Project Report", styles['TitleStyle']))
content.append(Paragraph("A cinematic, luxury AI-led digital experience for a modern brand", styles['SubtleStyle']))
content.append(Spacer(1, 18))

sections = [
    ("Project Overview", "MorpheLabs is a digital studio focused on building intelligent AI systems that support modern businesses through voice automation, chat experiences, and workflow intelligence. The purpose of this redesign project was to create a more compelling and premium online presence for the brand. I aimed to transform the website from a conventional landing page into an experience that feels cinematic, refined, and aligned with the sophistication of the services offered. My primary objective was to strengthen the company’s visual identity while improving clarity, storytelling, and conversion potential."),
    ("Design Research", "I based my design research on a mix of visual inspiration platforms, including Pinterest, Dribbble, and Behance. These sources were valuable because they expose how premium digital brands structure atmosphere, motion, typography, and visual hierarchy. I selected them because they provided a strong balance between artistic experimentation and practical UI thinking. From these references, I focused on design patterns that emphasized minimalism, layered depth, luminous gradients, glass surfaces, and smooth transitions."),
    ("My Approach", "I began by analyzing the existing website structure and identifying where the experience could be more persuasive. I reviewed the layout, messaging, content hierarchy, CTA positioning, and overall visual consistency. This analysis helped me see that the original experience could be improved through stronger storytelling and a more immersive first impression. I then identified opportunities to elevate the website by creating a clearer narrative flow, improving content organization, and introducing richer visual motion. I chose a cinematic and luxury AI design direction because it matches how MorpheLabs positions itself: intelligent, modern, and premium."),
    ("Design Process", "I planned the user journey to guide visitors from first impression to action. I structured the experience so that users could quickly understand the brand, explore services, review proof points, and reach the contact call-to-action without friction. Next, I focused on the content structure. I organized the page into clear sections that introduced the brand, presented services, showcased case studies, and reinforced credibility through performance-focused storytelling. I then designed the hero section to create immediate impact with a bold headline, strong visual atmosphere, and a confident call to action. I built the service sections to present the offerings in a polished and structured way, followed by case study content that communicated the value of the platform through concrete outcomes. I also created CTA sections intended to encourage conversion while preserving the premium tone of the website. Throughout the process, I paid careful attention to mobile responsiveness so the experience would remain smooth and readable across smaller screens."),
    ("Technologies Used", "I implemented the redesigned website using HTML, CSS, and JavaScript to create a responsive and interactive experience. I also used AI-assisted development tools to help accelerate the workflow, refine structure, and improve implementation efficiency. These tools supported layout ideation, content refinement, and component organization without replacing the thoughtful design decisions behind the project."),
    ("Key Features Implemented", ["Immersive hero section designed to create a memorable first impression.", "Glassmorphism effects that add depth and sophistication.", "Smooth animations that support the premium feel of the brand.", "Interactive elements that make the experience feel dynamic and responsive.", "Scroll-based storytelling that guides users through the narrative flow.", "Premium visual design that aligns strongly with the MorpheLabs identity."]),
    ("Challenges and Solutions", ["Creating a unique experience instead of a generic landing page by focusing on atmosphere, motion, and narrative structure.", "Balancing animation with performance through lightweight, purposeful motion and optimized interaction design.", "Maintaining responsiveness across devices by testing structure and layout behavior throughout the build." ]),
    ("Final Outcome", "The final result is a polished and professional redesign that presents MorpheLabs as a sophisticated AI brand. The website now offers a more immersive experience, clearer content flow, stronger visual identity, and a more compelling path toward engagement. Compared with the original website, the redesign delivers better storytelling, stronger visual impact, and a more premium user experience. These enhancements make the platform feel more credible, modern, and persuasive."),
    ("Conclusion", "This project taught me the value of combining strategy, visual storytelling, and interaction design into a single product experience. I learned that strong branding is not only about aesthetics; it is also about clarity, pacing, and creating a meaningful user journey. For future improvements, I would like to expand the case study section, add more motion-driven storytelling, and further refine the experience with more personalized content and stronger conversion paths."),
]

for title, body in sections:
    content.append(Paragraph(title, styles['HeadingStyle']))
    if isinstance(body, list):
        bullet_items = [Paragraph(item, styles['BulletStyle']) for item in body]
        content.append(ListFlowable(bullet_items, bulletType='bullet', start='•'))
    else:
        content.append(Paragraph(body, styles['BodyStyle']))
    content.append(Spacer(1, 8))

# Add a final page break to keep the content comfortably distributed across multiple pages
content.append(PageBreak())
content.append(Paragraph("Project Summary", styles['HeadingStyle']))
content.append(Paragraph("The redesigned MorpheLabs website now communicates the brand as confident, premium, and future-facing. It balances artistic visual language with functional storytelling, making the experience both memorable and effective. I view this project as a strong foundation for future growth, expansion, and continued refinement.", styles['BodyStyle']))

doc.build(content)
print(f"Created {output_path}")
