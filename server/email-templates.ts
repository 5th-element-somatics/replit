// Professional email templates with Fifth Element Somatics branding
export const createBrandedEmailTemplate = (content: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fifth Element Somatics</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #2a2a2a;
            background-color: #faf9f7;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #4a2c5a 0%, #2a1a3d 100%) !important;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
            /* Force light content in email clients */
            color-scheme: light;
            -webkit-color-scheme: light;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(199,125,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(199,125,255,0.15)"/><circle cx="40" cy="80" r="1" fill="rgba(199,125,255,0.1)"/><circle cx="90" cy="90" r="2.5" fill="rgba(199,125,255,0.08)"/></svg>') repeat;
            opacity: 0.3;
        }
        
        .logo {
            position: relative;
            z-index: 2;
        }
        
        .tiger-icon {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .tiger-icon svg {
            width: 32px;
            height: 32px;
            fill: white;
        }
        
        .brand-name {
            font-family: 'Crimson Text', Georgia, 'Times New Roman', serif;
            font-size: 28px;
            font-weight: 700;
            color: #ffffff !important;
            letter-spacing: 2px;
            margin: 0;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7), 1px 1px 0px rgba(0,0,0,1);
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
        }
        
        .tagline {
            font-family: 'Inter', Arial, Helvetica, sans-serif;
            font-size: 16px;
            color: #ffffff !important;
            margin-top: 12px;
            font-weight: 500;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6);
            letter-spacing: 0.5px;
            -webkit-font-smoothing: antialiased;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .content h1 {
            font-family: 'Crimson Text', serif;
            font-size: 28px;
            color: #2a1a3d;
            margin-bottom: 24px;
            line-height: 1.3;
        }
        
        .content h2 {
            font-family: 'Crimson Text', serif;
            font-size: 24px;
            color: #2a1a3d;
            margin: 32px 0 16px;
            line-height: 1.3;
        }
        
        .content h3 {
            font-size: 18px;
            font-weight: 600;
            color: #4a2c5a;
            margin: 24px 0 12px;
        }
        
        .content p {
            margin-bottom: 20px;
            color: #444;
            font-size: 16px;
            line-height: 1.7;
        }
        
        .content em {
            font-style: italic;
            color: #6b4c7a;
            background: linear-gradient(135deg, rgba(199, 125, 255, 0.1) 0%, rgba(157, 78, 221, 0.05) 100%);
            padding: 2px 6px;
            border-radius: 4px;
        }
        
        .archetype-badge {
            display: inline-block;
            background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin: 16px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(199, 125, 255, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(199, 125, 255, 0.4);
        }
        
        .quote-section {
            background: linear-gradient(135deg, rgba(199, 125, 255, 0.05) 0%, rgba(157, 78, 221, 0.02) 100%);
            border-left: 4px solid #C77DFF;
            padding: 24px 30px;
            margin: 32px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .practice-box {
            background: #f8f6ff;
            border: 1px solid rgba(199, 125, 255, 0.2);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }
        
        .practice-box h3 {
            color: #4a2c5a;
            margin-top: 0;
        }
        
        .signature {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #e9e6f0;
            color: #6b4c7a;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .signature-name {
            font-family: 'Crimson Text', serif;
            font-size: 18px;
            font-weight: 600;
            color: #4a2c5a;
            margin-top: 8px;
        }
        
        .footer {
            background: #2a1a3d;
            color: rgba(255, 255, 255, 0.8);
            padding: 40px 30px;
            text-align: center;
        }
        
        .footer p {
            margin: 8px 0;
            font-size: 14px;
        }
        
        .footer-links {
            margin: 20px 0;
        }
        
        .footer-links a {
            color: #C77DFF;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            width: 36px;
            height: 36px;
            background: rgba(199, 125, 255, 0.1);
            border-radius: 50%;
            margin: 0 8px;
            text-align: center;
            line-height: 36px;
            color: #C77DFF;
            text-decoration: none;
        }
        
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #C77DFF 50%, transparent 100%);
            margin: 32px 0;
            border: none;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                box-shadow: none;
            }
            
            .header, .content, .footer {
                padding-left: 20px;
                padding-right: 20px;
            }
            
            .content h1 {
                font-size: 24px;
            }
            
            .content h2 {
                font-size: 20px;
            }
            
            .brand-name {
                font-size: 20px;
            }
            
            .cta-button {
                display: block;
                text-align: center;
                width: fit-content;
                margin: 24px auto;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="tiger-icon">
                    <span style="font-size: 24px; color: #4a2c5a;">🐅</span>
                </div>
                <h1 class="brand-name" style="color: #ffffff !important; text-shadow: 3px 3px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7), 1px 1px 0px rgba(0,0,0,1); font-family: 'Crimson Text', Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 700; letter-spacing: 2px; margin: 0; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;">FIFTH ELEMENT SOMATICS</h1>
                <p class="tagline" style="color: #ffffff !important; text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6); font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 16px; margin-top: 12px; font-weight: 500; letter-spacing: 0.5px; -webkit-font-smoothing: antialiased;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
            </div>
        </div>
        
        <!-- Content -->
        <div class="content">
            ${content}
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="https://fifthelementsomatics.com">Visit Website</a>
                <a href="https://fifthelementsomatics.com/masterclass">Masterclass</a>
                <a href="https://fifthelementsomatics.com/about">About Saint</a>
            </div>
            
            <div class="social-links">
                <a href="https://instagram.com/fifthelementsomatics" title="Instagram">📷</a>
                <a href="mailto:hello@fifthelementsomatics.com" title="Email">✉️</a>
            </div>
            
            <p>© ${new Date().getFullYear()} Fifth Element Somatics. All rights reserved.</p>
            <p style="font-size: 12px; opacity: 0.7;">
                You're receiving this because you joined our community.<br>
                <a href="#" style="color: #C77DFF;">Unsubscribe</a> | 
                <a href="#" style="color: #C77DFF;">Update preferences</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

// Specific email template generators
export const createArchetypeEmailTemplate = (archetype: string, name: string, content: string) => {
  const archetypeColors = {
    'People-Pleaser': { primary: '#e91e63', secondary: '#fce4ec' },
    'Perfectionist': { primary: '#3f51b5', secondary: '#e8eaf6' },
    'Awakened Rebel': { primary: '#ff5722', secondary: '#fff3e0' }
  };
  
  const colors = archetypeColors[archetype as keyof typeof archetypeColors] || 
                 { primary: '#C77DFF', secondary: '#f8f6ff' };

  const archetypeBadge = `<div class="archetype-badge" style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}dd 100%);">${archetype}</div>`;
  
  return createBrandedEmailTemplate(`
    <h1>Hello ${name},</h1>
    ${archetypeBadge}
    ${content}
  `);
};

export const createWelcomeEmailTemplate = (name: string, content: string) => {
  return createBrandedEmailTemplate(`
    <h1>Welcome to the reclamation journey, ${name}</h1>
    <div class="quote-section">
      <p><em>"Your body is not your enemy. It's your oldest, wisest teacher."</em></p>
    </div>
    ${content}
  `);
};

export const createMeditationEmailTemplate = (name: string, content: string) => {
  return createBrandedEmailTemplate(`
    <h1>${name}, how was your first grounding experience?</h1>
    <div class="practice-box">
      <h3>🧘‍♀️ Your Meditation Journey</h3>
      <p>Every meditation is a conversation with your nervous system. Sometimes it whispers, sometimes it shouts.</p>
    </div>
    ${content}
  `);
};