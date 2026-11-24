package com.orayve.controller;

import com.orayve.entity.Order;
import com.orayve.service.InvoiceService;
import com.orayve.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Tag(name = "Invoices", description = "PDF invoice generation")
public class InvoiceController {

    private final OrderService orderService;
    private final InvoiceService invoiceService;

    public InvoiceController(OrderService orderService, InvoiceService invoiceService) {
        this.orderService = orderService;
        this.invoiceService = invoiceService;
    }

    @GetMapping("/api/orders/{id}/invoice")
    @Operation(summary = "Download official branded PDF tax invoice for order")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable String id) {
        Order order;
        try {
            order = orderService.getOrderById(UUID.fromString(id));
        } catch (IllegalArgumentException e) {
            order = orderService.getOrderByNumber(id);
        }

        byte[] pdfBytes = invoiceService.generateInvoicePdf(order);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ORAYVE_Invoice_" + order.getInvoiceNumber() + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
