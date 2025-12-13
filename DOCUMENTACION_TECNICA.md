# Documentación Técnica - Nereida Joyas

## Resumen Ejecutivo

Este documento explica la arquitectura técnica del sitio web de Nereida Joyas, un e-commerce de joyería masculina en Uruguay, diseñado para maximizar el rendimiento SEO y simular un entorno real de ventas.

## Componentes Tecnológicos

### 1. Dominio (Netuy)

**Rol**: Netuy actúa como registrador del dominio `nereidajoyas.uy`.

**Configuración Requerida**:
- Los servidores de nombres (NS) deben delegarse hacia una gestión externa (Cloudflare)
- Esto permite que Cloudflare maneje el DNS y el CDN sin depender de las limitaciones del registrador

**Beneficios**:
- Mayor control sobre la configuración DNS
- Acceso a funciones avanzadas de Cloudflare
- Mejor rendimiento global

### 2. Infraestructura DNS y CDN (Cloudflare)

**Rol**: Cloudflare actúa como intermediario entre Netuy y GitHub Pages, proporcionando DNS, CDN y seguridad.

#### Configuraciones Clave:

**CNAME Flattening para Dominio Raíz**:
- Permite usar un CNAME en el dominio raíz (apex domain) `nereidajoyas.uy`
- GitHub Pages normalmente requiere registros A/AAAA, pero Cloudflare resuelve esto automáticamente
- Beneficio: Flexibilidad y facilidad de migración

**Modo SSL/TLS "Full (Strict)"**:
- Encriptación end-to-end entre el cliente y Cloudflare, y entre Cloudflare y GitHub Pages
- Evita bucles de redirección que pueden ocurrir con modos menos estrictos
- Certificados SSL automáticos y renovación automática

**Reglas de Página (Page Rules)**:
- **Canonicalización**: Redirección 301 de `www.nereidajoyas.uy` → `nereidajoyas.uy`
- Esto evita contenido duplicado y mejora el SEO
- Google indexa solo la versión canónica

**Configuración de Cache**:
- Cacheo agresivo de recursos estáticos (CSS, JS, imágenes)
- Headers Cache-Control optimizados
- Reducción de carga en GitHub Pages y mejora de Core Web Vitals

### 3. Hosting (GitHub Pages)

**Rol**: Alojamiento de contenido estático generado por Jekyll.

**Características**:
- Build automático en cada push al repositorio
- Integración nativa con Jekyll
- HTTPS automático (cuando está disponible)
- Sin costo para repositorios públicos

**Limitaciones**:
- Solo contenido estático (HTML, CSS, JS)
- No hay backend ni base de datos
- Por eso se usa YAML para simular datos

### 4. Desarrollo (Jekyll & YAML)

**Jekyll como Generador de Sitios Estáticos**:
- Compila archivos Markdown, HTML y Liquid templates
- Genera sitio estático optimizado
- Plugins: `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-feed`

**YAML como Base de Datos Simulada**:
- Archivos en `_data/` contienen la información estructurada
- `productos.yml`: Catálogo de productos (anillos, cadenas, pulseras)
- `empresa.yml`: Datos del negocio para Schema.org
- Ventajas: Versionado, fácil de editar, no requiere base de datos

**Generación de Slugs Optimizados**:
- Cada producto tiene un `slug` SEO-friendly
- Ejemplo: `anillo-dragon-elfico` en lugar de `anillo-001`
- Mejora la legibilidad de URLs y el SEO

### 5. Simulación de E-commerce (Vanilla JS)

**Carrito de Compras**:
- Implementado con JavaScript puro (ES6)
- Sin dependencias externas (no jQuery, no frameworks)
- Clase `CarritoCompras` para encapsulación

**Persistencia con localStorage**:
- Los productos se guardan en `localStorage` del navegador
- Persiste entre sesiones
- Clave: `nereidajoyasCarrito`

**Checkout Simulado**:
- Al finalizar compra, redirección a WhatsApp
- Mensaje pre-formateado con productos y total
- Sin backend: simulación completa de e-commerce

**Funcionalidades**:
- Agregar productos al carrito
- Eliminar productos
- Actualizar cantidades
- Calcular totales
- Notificaciones visuales

### 6. Estrategia SEO

#### jekyll-seo-tag
- Plugin oficial de Jekyll para SEO
- Genera automáticamente:
  - Meta tags (description, keywords)
  - Open Graph (Facebook, LinkedIn)
  - Twitter Cards
  - Canonical URLs
  - JSON-LD estructurado

#### Schema.org Markup

**LocalBusiness** (sin dirección física pública):
```json
{
  "@type": "LocalBusiness",
  "name": "Nereida Joyas",
  "areaServed": "Uruguay",
  "openingHoursSpecification": [...]
}
```
- Indica que es un negocio local
- `areaServed` especifica el área de servicio sin dirección física
- Horarios de atención para Google My Business

**Product Schema**:
- Cada producto tiene marcado `itemscope itemtype="https://schema.org/Product"`
- Incluye: nombre, descripción, imagen, precio, oferta
- Permite fragmentos enriquecidos en Google

**Beneficios**:
- Rich snippets en resultados de búsqueda
- Mejor comprensión del contenido por parte de Google
- Mayor CTR en resultados de búsqueda

## Impacto en Core Web Vitals

### Largest Contentful Paint (LCP)
- **Optimizaciones**:
  - Lazy loading de imágenes
  - Preconnect a recursos externos
  - CSS crítico inline (opcional)
  - CDN de Cloudflare reduce latencia

### First Input Delay (FID)
- **Optimizaciones**:
  - JavaScript modular y defer
  - Sin bloqueo de renderizado
  - Event listeners eficientes

### Cumulative Layout Shift (CLS)
- **Optimizaciones**:
  - Dimensiones explícitas en imágenes (width/height)
  - Reserva de espacio para contenido dinámico
  - Fonts con display=swap

## Indexación en Google

### Sitemap.xml
- Generado automáticamente por `jekyll-sitemap`
- Incluye todas las páginas del sitio
- Referenciado en `robots.txt`

### Robots.txt
- Permite indexación completa
- Apunta al sitemap
- Ubicado en la raíz del sitio

### Meta Tags Esenciales
- `<title>`: Optimizado por página
- `<meta name="description">`: Descripción única por página
- `<link rel="canonical">`: URLs canónicas
- `<meta name="robots">`: Directivas de indexación

## Flujo de Datos

```
Usuario → Cloudflare (CDN/DNS) → GitHub Pages → Jekyll Build → HTML Estático
                                                                    ↓
                                                          YAML (_data/) → Productos
                                                                    ↓
                                                          JavaScript → Carrito (localStorage)
                                                                    ↓
                                                          WhatsApp (Checkout)
```

## Seguridad

- **HTTPS**: Forzado por Cloudflare (Full Strict)
- **Headers de Seguridad**: Configurados en Cloudflare
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
- **CSP**: Content Security Policy (opcional, configurable)

## Monitoreo y Analytics

### Recomendaciones:
- Google Search Console: Verificar propiedad del dominio
- Google Analytics: Implementar GA4
- Core Web Vitals: Monitorear en Search Console
- Cloudflare Analytics: Métricas de tráfico y performance

## Escalabilidad

### Limitaciones Actuales:
- Productos limitados por archivos YAML (prácticamente ilimitados)
- Sin backend: checkout manual vía WhatsApp
- Sin gestión de inventario en tiempo real

### Mejoras Futuras:
- Migración a base de datos (si se requiere backend)
- Integración con pasarela de pagos
- Panel de administración
- API REST para productos

## Conclusión

Esta arquitectura combina:
- **Simplicidad**: Sitio estático fácil de mantener
- **Performance**: Core Web Vitals optimizados
- **SEO**: Marcado estructurado y meta tags completos
- **Costo**: Hosting gratuito (GitHub Pages) + CDN gratuito (Cloudflare)
- **Escalabilidad**: Fácil migración a solución más robusta si es necesario

El sitio está optimizado para indexación rápida en Google y proporciona una experiencia de usuario excepcional, cumpliendo con los estándares modernos de desarrollo web.

