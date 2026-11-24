package com.orayve.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI orayveOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ORAYVE Luxury E-Commerce API")
                        .description("Enterprise REST APIs for ORAYVE: Small Details. Big Presence.")
                        .version("1.0.0")
                        .contact(new Contact().name("ORAYVE Engineering").email("support@orayve.in"))
                        .license(new License().name("Proprietary").url("https://orayve.in")))
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("BearerAuth", new SecurityScheme()
                                .name("BearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
