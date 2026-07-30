import { jsPDF } from 'jspdf';
import type { Investigation, TargetProfile, Evidence, Note, Finding, ReportSection } from '../types';
import { formatDate } from './utils';

export interface PDFExportData {
  reportTitle: string;
  classification: string;
  analystName: string;
  investigation?: Investigation;
  target?: TargetProfile;
  sections: ReportSection;
  evidenceList?: Evidence[];
  notesList?: Note[];
  findingsList?: Finding[];
}

export function generateReportPDF(data: PDFExportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner
  doc.setFillColor(10, 13, 20); // SOC Dark
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(6, 182, 212); // Cyan
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('UNIFIED RECONNAISSANCE DASHBOARD', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('ENTERPRISE OSINT & INVESTIGATION REPORT', 14, 22);

  doc.setFontSize(9);
  doc.setTextColor(239, 68, 68); // Red / Alert classification
  doc.text(`CLASSIFICATION: ${data.classification.toUpperCase()}`, pageWidth - 70, 15);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${formatDate(new Date().toISOString())}`, pageWidth - 70, 22);
  doc.text(`Analyst: ${data.analystName}`, pageWidth - 70, 28);

  y = 45;

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Report: ${data.reportTitle}`, 14, y);
  y += 10;

  // Metadata block
  if (data.investigation) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Investigation ID: ${data.investigation.id} | Priority: ${data.investigation.priority} | Status: ${data.investigation.status}`, 14, y);
    y += 8;
  }

  if (data.target) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Target Profile: ${data.target.fullName} (${data.target.company || 'N/A'}) - ${data.target.domain || data.target.email || 'N/A'}`, 14, y);
    y += 10;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  const sectionsToRender = [
    { title: '1. Executive Summary', text: data.sections.executiveSummary },
    { title: '2. Target Details', text: data.sections.targetDetails },
    { title: '3. Investigation Timeline', text: data.sections.timeline },
    { title: '4. Key OSINT Findings', text: data.sections.findings },
    { title: '5. Evidence Inventory', text: data.sections.evidenceList },
    { title: '6. Analyst Notes & Observation', text: data.sections.analystNotes },
    { title: '7. Recommendations', text: data.sections.recommendations },
    { title: '8. Conclusion', text: data.sections.conclusion },
  ];

  sectionsToRender.forEach((sec) => {
    if (!sec.text || !sec.text.trim()) return;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175); // Dark blue header
    doc.text(sec.title, 14, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const splitText = doc.splitTextToSize(sec.text, pageWidth - 28);
    doc.text(splitText, 14, y);
    y += splitText.length * 5 + 6;
  });

  // Footer on page
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Unified Reconnaissance Dashboard — Confidential Defensive OSINT Report — Page ${i} of ${pageCount}`, 14, 290);
  }

  doc.save(`${data.reportTitle.replace(/\s+/g, '_')}_Report.pdf`);
}
