package com.orayve.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.orayve.entity.Order;
import com.orayve.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    public byte[] generateInvoicePdf(Order order) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, out);
            document.open();

            // Brand Colors
            Color inkColor = new Color(0x1C, 0x1B, 0x29);
            Color brassColor = new Color(0xB8, 0x90, 0x5C);

            // Fonts
            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, inkColor);
            Font taglineFont = FontFactory.getFont(FontFactory.HELVETICA, 10, brassColor);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, inkColor);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, inkColor);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);

            // Header Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);

            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.addElement(new Paragraph("ORAYVE", brandFont));
            leftCell.addElement(new Paragraph("Small Details. Big Presence.", taglineFont));
            headerTable.addCell(leftCell);

            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph invTitle = new Paragraph("TAX INVOICE", titleFont);
            invTitle.setAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(invTitle);
            Paragraph invNum = new Paragraph("Invoice #: " + order.getInvoiceNumber(), boldFont);
            invNum.setAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(invNum);
            Paragraph invDate = new Paragraph("Date: " + order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), normalFont);
            invDate.setAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(invDate);
            headerTable.addCell(rightCell);

            document.add(headerTable);
            document.add(new Paragraph(" "));

            // Order Details
            Paragraph orderInfo = new Paragraph("Order Number: " + order.getOrderNumber() + " | Payment Method: " + order.getPaymentMethod(), normalFont);
            document.add(orderInfo);
            document.add(new Paragraph(" "));

            // Items Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{40, 20, 15, 10, 15});

            String[] headers = {"Item", "SKU", "Price", "Qty", "Total"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
                cell.setBackgroundColor(new Color(0xEE, 0xEA, 0xE2));
                cell.setPadding(6);
                table.addCell(cell);
            }

            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    table.addCell(new Phrase(item.getProductTitle() + " (" + item.getColorName() + ")", normalFont));
                    table.addCell(new Phrase(item.getSku(), normalFont));
                    table.addCell(new Phrase("₹" + item.getUnitPrice(), normalFont));
                    table.addCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                    table.addCell(new Phrase("₹" + item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())), normalFont));
                }
            }

            document.add(table);
            document.add(new Paragraph(" "));

            // Totals
            Paragraph totals = new Paragraph();
            totals.setAlignment(Element.ALIGN_RIGHT);
            totals.add(new Chunk("Subtotal: ₹" + order.getSubtotalAmount() + "\n", normalFont));
            totals.add(new Chunk("Discount: ₹" + order.getDiscountAmount() + "\n", normalFont));
            totals.add(new Chunk("Grand Total: ₹" + order.getFinalAmount() + "\n", boldFont));
            document.add(totals);

            document.add(new Paragraph(" "));
            Paragraph footer = new Paragraph("Thank you for choosing ORAYVE. Small Details. Big Presence.\nsupport@orayve.in | www.orayve.in", normalFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF: " + e.getMessage(), e);
        }
    }
}
