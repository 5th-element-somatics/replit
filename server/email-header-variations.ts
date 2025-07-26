// Email header variations for testing
export const createEmailHeaderVariations = () => {
  return {
    // Version 1: Clean White Background
    version1: `
      <div style="background: #ffffff; padding: 40px 30px; text-align: center; border-bottom: 3px solid #C77DFF;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px; color: white;">🐅</span>
        </div>
        <h1 style="font-family: 'Crimson Text', serif; font-size: 24px; color: #2a1a3d; margin: 0; letter-spacing: 1px;">FIFTH ELEMENT SOMATICS</h1>
        <p style="font-size: 14px; color: #6b4c7a; margin-top: 8px;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
      </div>
    `,
    
    // Version 2: Subtle Purple Gradient
    version2: `
      <div style="background: linear-gradient(135deg, #f8f6ff 0%, #ede7ff 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #C77DFF;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(199, 125, 255, 0.3);">
          <span style="font-size: 24px; color: white;">🐅</span>
        </div>
        <h1 style="font-family: 'Crimson Text', serif; font-size: 24px; color: #2a1a3d; margin: 0; letter-spacing: 1px;">FIFTH ELEMENT SOMATICS</h1>
        <p style="font-size: 14px; color: #4a2c5a; margin-top: 8px; font-weight: 500;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
      </div>
    `,
    
    // Version 3: Minimal with Bottom Border
    version3: `
      <div style="background: #fefefe; padding: 30px 30px 20px; text-align: center;">
        <div style="width: 50px; height: 50px; background: #C77DFF; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
          <span style="font-size: 20px; color: white;">🐅</span>
        </div>
        <h1 style="font-family: 'Crimson Text', serif; font-size: 22px; color: #2a1a3d; margin: 0;">FIFTH ELEMENT SOMATICS</h1>
        <p style="font-size: 13px; color: #6b4c7a; margin: 8px 0 0;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
        <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #C77DFF 0%, #9d4edd 100%); margin: 20px auto 0; border-radius: 2px;"></div>
      </div>
    `,
    
    // Version 4: Bold Purple with White Text (Fixed Contrast)
    version4: `
      <div style="background: linear-gradient(135deg, #4a2c5a 0%, #2a1a3d 100%); padding: 40px 30px; text-align: center;">
        <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.9); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px; color: #4a2c5a;">🐅</span>
        </div>
        <h1 style="font-family: 'Crimson Text', serif; font-size: 24px; color: #ffffff; margin: 0; letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">FIFTH ELEMENT SOMATICS</h1>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin-top: 8px; font-weight: 300;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
      </div>
    `,
    
    // Version 5: Elegant with Side Borders
    version5: `
      <div style="background: #ffffff; padding: 35px 30px; text-align: center; border-left: 5px solid #C77DFF; border-right: 5px solid #C77DFF;">
        <div style="width: 55px; height: 55px; background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px; border: 3px solid #f8f6ff;">
          <span style="font-size: 22px; color: white;">🐅</span>
        </div>
        <h1 style="font-family: 'Crimson Text', serif; font-size: 23px; color: #2a1a3d; margin: 0; letter-spacing: 0.8px;">FIFTH ELEMENT SOMATICS</h1>
        <p style="font-size: 13px; color: #6b4c7a; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
      </div>
    `
  };
};

export const createTestEmail = (headerVersion: string, recipientName: string = "Test User") => {
  const variations = createEmailHeaderVariations();
  const selectedHeader = variations[headerVersion as keyof typeof variations] || variations.version1;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fifth Element Somatics - Header Test</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #2a2a2a; background-color: #faf9f7; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
        .content { padding: 40px 30px; }
        .content h1 { font-family: 'Crimson Text', serif; font-size: 28px; color: #2a1a3d; margin-bottom: 24px; }
        .content p { margin-bottom: 20px; color: #444; font-size: 16px; line-height: 1.7; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%); color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: 600; margin: 24px 0; }
    </style>
</head>
<body>
    <div class="email-container">
        ${selectedHeader}
        
        <div class="content">
            <h1>Hello ${recipientName},</h1>
            
            <p>This is a test email to show you the new branded header design. We've fixed the contrast issues to ensure perfect readability.</p>
            
            <p>The header now features:</p>
            <ul style="margin: 20px 0; padding-left: 20px;">
                <li>High contrast text that's easy to read</li>
                <li>Professional Fifth Element Somatics branding</li>
                <li>Tiger logo with proper visual hierarchy</li>
                <li>Clean, modern design that works on all devices</li>
            </ul>
            
            <p>This email template will be used for all your AI-powered email campaigns, ensuring consistent branding across your entire marketing funnel.</p>
            
            <a href="https://fifthelementsomatics.com" class="cta-button">Visit Website</a>
            
            <p style="margin-top: 30px; color: #6b4c7a; font-size: 15px;">
                In solidarity with your becoming,<br>
                <strong>Saint</strong>
            </p>
        </div>
    </div>
</body>
</html>
  `;
};