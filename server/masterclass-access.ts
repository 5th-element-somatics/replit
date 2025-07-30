// Masterclass video access configuration
// These would typically be secure, direct download links or streaming URLs

export const MASTERCLASS_CONTENT = {
  // Main masterclass video - replace with your actual video hosting solution
  mainVideo: {
    title: "The Good Girl Paradox - Full Masterclass",
    duration: "90+ minutes",
    // For Google Drive, you'd need to make files publicly accessible and use direct links
    // Format: https://drive.google.com/uc?export=download&id=FILE_ID
    streamUrl: "https://drive.google.com/file/d/YOUR_VIDEO_FILE_ID/view",
    downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_VIDEO_FILE_ID",
    description: "Transform your relationship with pleasure, power, and authenticity through somatic practices."
  },
  
  // Integration guide PDF
  integrationGuide: {
    title: "Integration Guide & Journal Prompts",
    downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_PDF_FILE_ID",
    description: "Reflection questions and practices to deepen your masterclass experience."
  },

  // Return to Body addon content (only for users who purchased the addon)
  returnToBodyAddon: {
    boundaryTapping: {
      title: "Boundary Tapping Ritual",
      downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_AUDIO_FILE_ID_1",
      duration: "15 minutes"
    },
    erosActivation: {
      title: "Eros Energy Activation",
      downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_AUDIO_FILE_ID_2", 
      duration: "20 minutes"
    },
    sovereigntyRitual: {
      title: "Sovereignty Ritual",
      downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_AUDIO_FILE_ID_3",
      duration: "18 minutes"
    }
  }
};

// Function to generate access email content
export function generateAccessEmail(email: string, hasReturnToBodyAddon: boolean) {
  const baseContent = `
    <h2>🎉 Welcome to The Good Girl Paradox Masterclass!</h2>
    
    <p>Thank you for your purchase. Your transformational journey begins now.</p>
    
    <h3>📹 Your Masterclass Access:</h3>
    <p><strong>${MASTERCLASS_CONTENT.mainVideo.title}</strong></p>
    <p>Duration: ${MASTERCLASS_CONTENT.mainVideo.duration}</p>
    <p>
      <a href="${MASTERCLASS_CONTENT.mainVideo.streamUrl}" target="_blank" style="background: linear-gradient(135deg, #C77DFF, #FF6B9D); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        🎬 Watch Now
      </a>
      &nbsp;&nbsp;
      <a href="${MASTERCLASS_CONTENT.mainVideo.downloadUrl}" target="_blank" style="background: #4A5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        ⬇️ Download
      </a>
    </p>
    
    <h3>📖 Integration Resources:</h3>
    <p>
      <a href="${MASTERCLASS_CONTENT.integrationGuide.downloadUrl}" target="_blank" style="color: #C77DFF; text-decoration: none;">
        📄 Download Integration Guide & Journal Prompts
      </a>
    </p>
  `;

  const addonContent = hasReturnToBodyAddon ? `
    <h3>🌟 Return to Body Bonus Content:</h3>
    <p>As a bonus, you also have access to these guided audio rituals:</p>
    <ul>
      <li><a href="${MASTERCLASS_CONTENT.returnToBodyAddon.boundaryTapping.downloadUrl}" target="_blank">🌬️ ${MASTERCLASS_CONTENT.returnToBodyAddon.boundaryTapping.title}</a> (${MASTERCLASS_CONTENT.returnToBodyAddon.boundaryTapping.duration})</li>
      <li><a href="${MASTERCLASS_CONTENT.returnToBodyAddon.erosActivation.downloadUrl}" target="_blank">🔥 ${MASTERCLASS_CONTENT.returnToBodyAddon.erosActivation.title}</a> (${MASTERCLASS_CONTENT.returnToBodyAddon.erosActivation.duration})</li>
      <li><a href="${MASTERCLASS_CONTENT.returnToBodyAddon.sovereigntyRitual.downloadUrl}" target="_blank">👑 ${MASTERCLASS_CONTENT.returnToBodyAddon.sovereigntyRitual.title}</a> (${MASTERCLASS_CONTENT.returnToBodyAddon.sovereigntyRitual.duration})</li>
    </ul>
  ` : '';

  return baseContent + addonContent + `
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #E2E8F0;">
    
    <p><strong>Need help?</strong> Reply to this email or contact us at hello@fifthelementsomatics.com</p>
    
    <p style="color: #718096; font-size: 14px;">
      This email contains your personal access links. Please don't share these links as they are tied to your purchase.
    </p>
  `;
}