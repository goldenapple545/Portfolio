const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  info: {
    Title: 'Egor Vikturov - CV',
    Author: 'Egor Vikturov',
    Subject: 'Curriculum Vitae'
  }
});

const outputPath = path.join(dataDir, 'Egor_Vikturov_CV.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Helper functions
const pageWidth = doc.page.width - 100;

function drawHeader() {
  // Name
  doc.fontSize(28).font('Helvetica-Bold').fillColor('#1a1a2e').text('Egor Vikturov', { align: 'left' });
  
  // Title
  doc.fontSize(14).font('Helvetica').fillColor('#e8833a').text('VR Developer & Game Designer', { align: 'left' });
  
  // Divider
  doc.moveDown(0.5);
  doc.moveTo(0, doc.y).lineTo(pageWidth, doc.y).strokeColor('#e8833a').lineWidth(2).stroke();
  doc.moveDown(0.5);
  
  // Contact info
  doc.fontSize(10).font('Helvetica').fillColor('#555');
  doc.text('Email: your@email.com  |  Telegram: @your_username  |  GitHub: github.com/YOUR_USERNAME');
  doc.text('Location: Moscow, Russia  |  Open to remote/relocation');
  doc.moveDown(1);
}

function drawSection(title, contentFn) {
  // Section header
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a1a2e').text(title.toUpperCase(), { underline: true });
  doc.moveDown(0.3);
  
  contentFn();
  doc.moveDown(0.5);
}

function drawBullet(text, indent = 20) {
  const bulletText = '• ' + text;
  doc.fontSize(10).font('Helvetica').fillColor('#333').text(bulletText, {
    indent: indent,
    lineGap: 2,
    width: pageWidth,
    align: 'left'
  });
}

function drawSkillTag(text, x, y, isPrimary = true) {
  const tagWidth = doc.widthOfString(text, { fontSize: 9 }) + 16;
  
  if (x + tagWidth > pageWidth) {
    return { x: 20, y: y + 20, newLine: true };
  }
  
  doc.save();
  if (isPrimary) {
    doc.rect(x, y - 2, tagWidth, 18).fillAndStroke('#e8833a', '#e8833a');
    doc.fillColor('#fff');
  } else {
    doc.rect(x, y - 2, tagWidth, 18).fillAndStroke('#f0f0f0', '#ccc');
    doc.fillColor('#333');
  }
  doc.fontSize(9).font('Helvetica').text(text, x + 8, y, { width: tagWidth - 16 });
  doc.restore();
  
  return { x: x + tagWidth + 5, y, newLine: false };
}

// ============ BUILD CV ============

drawHeader();

// Summary
drawSection('Professional Summary', () => {
  doc.fontSize(10).font('Helvetica').fillColor('#333').text(
    'VR Developer and Game Designer with 5+ years of experience in immersive game development. ' +
    'Specialized in Unity, XR Interaction Toolkit, and C# programming. Proven track record of shipping ' +
    'VR projects from concept to deployment, including military training simulators and commercial VR experiences. ' +
    'Unique ability to create original music and soundtracks for games. Strong communicator with a passion ' +
    'for immersive storytelling and innovative gameplay mechanics.',
    { width: pageWidth, lineGap: 3 }
  );
});

// Core Competencies
drawSection('Core Competencies', () => {
  const skills = [
    { text: 'Unity 3D', primary: true },
    { text: 'C#', primary: true },
    { text: 'XR Interaction Toolkit', primary: true },
    { text: 'VR Development', primary: true },
    { text: 'Game Design', primary: true },
    { text: 'Blender', primary: false },
    { text: 'Git', primary: false },
    { text: 'Fishnet (Networking)', primary: false },
    { text: 'Zenject (DI)', primary: false },
    { text: 'UniTask', primary: false },
    { text: 'Soundtrack Creation', primary: false },
    { text: '3D Modeling', primary: false }
  ];
  
  let x = 20;
  let y = doc.y;
  
  skills.forEach(skill => {
    const result = drawSkillTag(skill.text, x, y, skill.primary);
    x = result.x;
    y = result.y;
    if (result.newLine) {
      x = 20;
      y = result.y;
    }
  });
  
  doc.moveDown(2);
});

// Experience
drawSection('Experience', () => {
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#1a1a2e').text('VR Developer');
  doc.fontSize(10).font('Helvetica').fillColor('#666').text('2023 – Present');
  doc.moveDown(0.2);
  
  drawBullet('Developed VR Weapon System — modular weapon framework for Unity with realistic physics and interactions');
  drawBullet('Created Quest Island VR — immersive adventure game with original soundtrack and puzzle mechanics');
  drawBullet('Built КиберСапёр (CyberSapper) — military training simulator for educational centers, developed under guidance of active sappers for safe mine-clearing training');
  drawBullet('Contributed to Fly Academy — aviation training VR experience');
  drawBullet('Developed Z-Uchebka — educational VR platform');
  drawBullet('Composed original music and soundtracks for all personal VR projects');
  drawBullet('Collaborated with teams using Git, Fishnet for multiplayer, and Zenject for dependency injection');
});

// Education
drawSection('Education', () => {
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#1a1a2e').text('MIREA — Russian Technological University (MIET)');
  doc.fontSize(10).font('Helvetica').fillColor('#666').text('Engineering Automation | 2021 – 2025 | Zelenograd');
  doc.moveDown(0.3);
  
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e').text('Unity Certifications:');
  doc.moveDown(0.2);
  drawBullet('Unity Junior Programmer');
  drawBullet('Unity VR Development');
  drawBullet('Unity Mobile AR Development');
  drawBullet('Unity Creative Core');
});

// Projects
drawSection('Key Projects', () => {
  const projects = [
    {
      name: 'Quest Island VR',
      desc: 'Immersive VR adventure game set on a mysterious island. Features: original soundtrack, environmental puzzles, exploration mechanics. Built with Unity + XR Interaction Toolkit.'
    },
    {
      name: 'VR Weapon System',
      desc: 'Modular weapon framework for VR with realistic physics, reload mechanics, and attachment system. Published as Unity Asset.'
    },
    {
      name: 'КиберСапёр (CyberSapper)',
      desc: 'Military training simulator for educational institutions. Digital twins of mines and metal detectors. Developed with input from active military sappers.'
    },
    {
      name: 'Fly Academy',
      desc: 'Aviation training VR experience with flight simulation mechanics and educational modules.'
    }
  ];
  
  projects.forEach(project => {
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e').text(project.name);
    doc.fontSize(9).font('Helvetica').fillColor('#555').text(project.desc, { width: pageWidth, lineGap: 2 });
    doc.moveDown(0.3);
  });
});

// Languages
drawSection('Languages', () => {
  doc.fontSize(10).font('Helvetica').fillColor('#333').text('Russian — Native');
  doc.fontSize(10).font('Helvetica').fillColor('#333').text('English — Professional Working Proficiency');
});

// Additional Info
drawSection('Additional Information', () => {
  drawBullet('Active member of VR/GameDev community');
  drawBullet('Experienced in solo and team-based development');
  drawBullet('Multi-instrumentalist: guitar, music production for games');
  drawBullet('Strong problem-solving skills with a focus on player immersion');
});

// Footer
doc.moveDown(1);
doc.fontSize(8).font('Helvetica').fillColor('#999').text(
  'References available upon request  |  Last updated: July 2026',
  { align: 'center', width: pageWidth }
);

doc.end();

console.log(`CV generated: ${outputPath}`);
