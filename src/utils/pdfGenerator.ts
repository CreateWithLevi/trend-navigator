import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { GlobalEvent, CATEGORY_CONFIG } from '@/types/event';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateEventReport = (event: GlobalEvent, userDomain: string): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Colors
  const primaryColor: [number, number, number] = [0, 200, 200]; // Cyan
  const darkColor: [number, number, number] = [30, 35, 45];
  const textColor: [number, number, number] = [60, 65, 75];

  // Helper to add section header
  const addSectionHeader = (title: string) => {
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - margin * 2, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 4, yPos + 5.5);
    yPos += 14;
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
  };

  // Header with branding
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Opportunity Radar', margin, 18);
  
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Global Event Intelligence Report', margin, 28);
  
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, 35);

  yPos = 50;

  // Event Title
  doc.setTextColor(...darkColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(event.title, pageWidth - margin * 2);
  doc.text(titleLines, margin, yPos);
  yPos += titleLines.length * 8 + 4;

  // Category Badge
  const categoryConfig = CATEGORY_CONFIG[event.category];
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, yPos, 40, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(categoryConfig.label.toUpperCase(), margin + 4, yPos + 5);
  
  // Domain context
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Domain: ${userDomain}`, margin + 50, yPos + 5);
  yPos += 16;

  // Summary Section
  addSectionHeader('EXECUTIVE SUMMARY');
  doc.setFontSize(10);
  const summaryLines = doc.splitTextToSize(event.summary, pageWidth - margin * 2);
  doc.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 10;

  // Heat Metrics Section
  addSectionHeader('HEAT METRICS');
  
  const metricsData = [
    ['Metric', 'Score', 'Level'],
    ['News Volume', event.metrics.news.toString(), event.metrics.news >= 70 ? 'High' : event.metrics.news >= 40 ? 'Medium' : 'Low'],
    ['Reddit Activity', event.metrics.reddit.toString(), event.metrics.reddit >= 70 ? 'High' : event.metrics.reddit >= 40 ? 'Medium' : 'Low'],
    ['X/Twitter Buzz', event.metrics.twitter.toString(), event.metrics.twitter >= 70 ? 'High' : event.metrics.twitter >= 40 ? 'Medium' : 'Low'],
    ['Google Trend', event.metrics.googleTrend.toString(), event.metrics.googleTrend >= 70 ? 'High' : event.metrics.googleTrend >= 40 ? 'Medium' : 'Low'],
  ];

  doc.autoTable({
    startY: yPos,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    margin: { left: margin, right: margin },
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: { 
      fontSize: 9,
      textColor: textColor
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 8;

  // Combined Heat Score Box
  doc.setFillColor(240, 255, 255);
  doc.setDrawColor(...primaryColor);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 20, 3, 3, 'FD');
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Combined Heat Score:', margin + 8, yPos + 12);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(20);
  doc.text(event.heat.toString(), pageWidth - margin - 30, yPos + 14);
  doc.setFontSize(10);
  doc.text('/100', pageWidth - margin - 15, yPos + 14);
  yPos += 30;

  // Timeline Section
  if (event.timeline.length > 0) {
    addSectionHeader('EVENT TIMELINE');
    
    event.timeline.forEach((item, index) => {
      doc.setFillColor(...primaryColor);
      doc.circle(margin + 3, yPos + 2, 2, 'F');
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(item.date, margin + 10, yPos);
      
      doc.setTextColor(...darkColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(item.title, margin + 10, yPos + 6);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      doc.setFontSize(9);
      const descLines = doc.splitTextToSize(item.description, pageWidth - margin * 2 - 15);
      doc.text(descLines, margin + 10, yPos + 12);
      
      yPos += 18 + (descLines.length - 1) * 4;
      
      if (index < event.timeline.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin + 3, yPos - 12, margin + 3, yPos);
      }
    });
    yPos += 6;
  }

  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  // Related Entities Section
  addSectionHeader('RELATED ENTITIES');
  
  const entityTypes: Record<string, string> = {
    organization: '🏢',
    location: '📍',
    person: '👤',
    technology: '⚙️'
  };
  
  let entityX = margin;
  event.related.forEach((entity) => {
    const entityText = `${entity.name}`;
    const textWidth = doc.getTextWidth(entityText) + 12;
    
    if (entityX + textWidth > pageWidth - margin) {
      entityX = margin;
      yPos += 10;
    }
    
    doc.setFillColor(235, 240, 245);
    doc.roundedRect(entityX, yPos - 4, textWidth, 8, 2, 2, 'F');
    doc.setTextColor(...textColor);
    doc.setFontSize(8);
    doc.text(entityText, entityX + 4, yPos + 1);
    
    entityX += textWidth + 4;
  });
  yPos += 14;

  // Impact Assessment Section
  addSectionHeader('IMPACT ASSESSMENT');
  
  const impactColors: Record<string, [number, number, number]> = {
    high: [220, 53, 69],
    medium: [255, 193, 7],
    low: [40, 167, 69]
  };
  
  event.impact.forEach((item) => {
    doc.setFillColor(...(impactColors[item.level] || [100, 100, 100]));
    doc.roundedRect(margin, yPos, 6, 6, 1, 1, 'F');
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(item.area, margin + 10, yPos + 4);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`(${item.level.toUpperCase()})`, margin + 10 + doc.getTextWidth(item.area) + 4, yPos + 4);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    const impactLines = doc.splitTextToSize(item.description, pageWidth - margin * 2 - 10);
    doc.text(impactLines, margin + 10, yPos + 10);
    
    yPos += 16 + (impactLines.length - 1) * 4;
  });
  yPos += 6;

  // Relevance Score
  doc.setFillColor(240, 255, 255);
  doc.setDrawColor(...primaryColor);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 16, 3, 3, 'FD');
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Relevance to Your Domain:', margin + 8, yPos + 10);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${event.relevanceToUserDomain}%`, pageWidth - margin - 25, yPos + 11);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Opportunity Radar - Global Event Intelligence Platform', margin, footerY);
  doc.text(`Event ID: ${event.id}`, pageWidth - margin - 30, footerY);

  // Save the PDF
  const fileName = `opportunity-radar-${event.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}-${Date.now()}.pdf`;
  doc.save(fileName);
};

export const generateMultiEventReport = (events: GlobalEvent[], userDomain: string): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  const primaryColor: [number, number, number] = [0, 200, 200];
  const darkColor: [number, number, number] = [30, 35, 45];

  // Header
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Opportunity Radar', margin, 20);
  
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(12);
  doc.text(`Multi-Event Report: ${userDomain}`, margin, 32);
  
  doc.setFontSize(9);
  doc.text(`${events.length} events • Generated: ${new Date().toLocaleDateString()}`, margin, 40);

  yPos = 55;

  // Events summary table
  const tableData = events.map(event => [
    event.title.slice(0, 35) + (event.title.length > 35 ? '...' : ''),
    CATEGORY_CONFIG[event.category].label,
    event.heat.toString(),
    `${event.relevanceToUserDomain}%`
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Event', 'Category', 'Heat', 'Relevance']],
    body: tableData,
    margin: { left: margin, right: margin },
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  doc.save(`opportunity-radar-report-${Date.now()}.pdf`);
};
