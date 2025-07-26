import { useState } from 'react';

const EmailHeaderTest = () => {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  // Email header variations
  const headerVariations = {
    1: {
      title: "VERSION 1: Clean & Professional",
      description: "Clean white background with high contrast text",
      html: `
        <div style="background: #ffffff; padding: 40px 30px; text-align: center; border-bottom: 3px solid #C77DFF;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="font-size: 24px; color: white;">🐅</span>
          </div>
          <h1 style="font-family: 'Crimson Text', serif; font-size: 24px; color: #2a1a3d; margin: 0; letter-spacing: 1px;">FIFTH ELEMENT SOMATICS</h1>
          <p style="font-size: 14px; color: #6b4c7a; margin-top: 8px;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
        </div>
      `
    },
    2: {
      title: "VERSION 2: Elegant & Soft",
      description: "Subtle purple gradient background with enhanced tiger logo",
      html: `
        <div style="background: linear-gradient(135deg, #f8f6ff 0%, #ede7ff 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #C77DFF;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(199, 125, 255, 0.3);">
            <span style="font-size: 24px; color: white;">🐅</span>
          </div>
          <h1 style="font-family: 'Crimson Text', serif; font-size: 24px; color: #2a1a3d; margin: 0; letter-spacing: 1px;">FIFTH ELEMENT SOMATICS</h1>
          <p style="font-size: 14px; color: #4a2c5a; margin-top: 8px; font-weight: 500;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
        </div>
      `
    },
    3: {
      title: "VERSION 3: Clean & Minimal",
      description: "Ultra-minimal design with decorative bottom accent",
      html: `
        <div style="background: #fefefe; padding: 30px 30px 20px; text-align: center;">
          <div style="width: 50px; height: 50px; background: #C77DFF; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            <span style="font-size: 20px; color: white;">🐅</span>
          </div>
          <h1 style="font-family: 'Crimson Text', serif; font-size: 22px; color: #2a1a3d; margin: 0;">FIFTH ELEMENT SOMATICS</h1>
          <p style="font-size: 13px; color: #6b4c7a; margin: 8px 0 0;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
          <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #C77DFF 0%, #9d4edd 100%); margin: 20px auto 0; border-radius: 2px;"></div>
        </div>
      `
    },
    4: {
      title: "VERSION 4: Bold & Dramatic",
      description: "Rich purple gradient with white text and proper contrast",
      html: `
        <div style="background: linear-gradient(135deg, #4a2c5a 0%, #2a1a3d 100%); padding: 40px 30px; text-align: center;">
          <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.9); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="font-size: 24px; color: #4a2c5a;">🐅</span>
          </div>
          <h1 style="font-family: 'Crimson Text', serif; font-size: 24px; color: #ffffff; margin: 0; letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">FIFTH ELEMENT SOMATICS</h1>
          <p style="font-size: 14px; color: rgba(255, 255, 255, 0.9); margin-top: 8px; font-weight: 300;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
        </div>
      `
    },
    5: {
      title: "VERSION 5: Sophisticated & Framed",
      description: "Clean white background with elegant purple side borders",
      html: `
        <div style="background: #ffffff; padding: 35px 30px; text-align: center; border-left: 5px solid #C77DFF; border-right: 5px solid #C77DFF;">
          <div style="width: 55px; height: 55px; background: linear-gradient(135deg, #C77DFF 0%, #9d4edd 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px; border: 3px solid #f8f6ff;">
            <span style="font-size: 22px; color: white;">🐅</span>
          </div>
          <h1 style="font-family: 'Crimson Text', serif; font-size: 23px; color: #2a1a3d; margin: 0; letter-spacing: 0.8px;">FIFTH ELEMENT SOMATICS</h1>
          <p style="font-size: 13px; color: #6b4c7a; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;">Embodied Wisdom • Somatic Healing • Sacred Transformation</p>
        </div>
      `
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            🎨 Email Header Test Variations
          </h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            Choose your favorite header style for the AI email marketing system. 
            Click on any version to see it highlighted.
          </p>
        </div>

        {/* Selection Guide */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4">
            How to Choose:
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-purple-700">
            <div>
              <h3 className="font-semibold mb-2">For Maximum Readability:</h3>
              <p>Choose Version 1 or 3 - clean white backgrounds with dark text</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Brand Presence:</h3>
              <p>Choose Version 2 or 5 - subtle branding with professional appeal</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Bold Statement:</h3>
              <p>Choose Version 4 - dramatic purple with fixed contrast</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Mobile-First:</h3>
              <p>Choose Version 3 - compact and space-efficient design</p>
            </div>
          </div>
        </div>

        {/* Header Variations */}
        <div className="space-y-8">
          {Object.entries(headerVariations).map(([version, data]) => (
            <div 
              key={version}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                selectedVersion === parseInt(version) ? 'ring-4 ring-purple-400 scale-[1.02]' : 'hover:shadow-xl'
              }`}
              onClick={() => setSelectedVersion(selectedVersion === parseInt(version) ? null : parseInt(version))}
            >
              {/* Version Info */}
              <div className="p-6 border-b border-purple-100">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  {data.title}
                </h3>
                <p className="text-purple-600">
                  {data.description}
                </p>
              </div>

              {/* Email Header Preview */}
              <div className="p-0">
                <div 
                  dangerouslySetInnerHTML={{ __html: data.html }}
                  style={{ fontFamily: '"Crimson Text", serif' }}
                />
              </div>

              {/* Sample Email Content */}
              <div className="p-6 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Hello Sarah,
                </h4>
                <p className="text-gray-700 mb-4">
                  Thank you for taking the Good Girl Archetype Quiz. Your result: <strong>Perfectionist</strong>
                </p>
                <p className="text-gray-600 text-sm">
                  This archetype reveals patterns that might feel uncomfortably familiar...
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Explore the Masterclass
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Action */}
        <div className="mt-12 text-center">
          <div className="bg-purple-100 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-purple-900 mb-4">
              Ready to Choose?
            </h3>
            <p className="text-purple-700 mb-6">
              Just tell me "I love Version X" and I'll update all your AI email templates immediately!
            </p>
            <div className="text-sm text-purple-600">
              All versions have perfect readability and mobile responsiveness
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailHeaderTest;