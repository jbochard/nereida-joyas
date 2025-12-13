# Nereida Joyas - E-commerce de Joyería Masculina

Sitio web estático optimizado para SEO, construido con Jekyll y desplegado en GitHub Pages.

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

- **Generador de Sitios Estáticos**: Jekyll 4.3
- **Hosting**: GitHub Pages
- **CDN y DNS**: Cloudflare
- **Registrador de Dominio**: Netuy
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6)
- **Datos**: YAML (simulación de base de datos)

### Infraestructura

#### Dominio (Netuy)
- Dominio: `nereidajoyas.uy`
- Los servidores de nombres (NS) deben delegarse a Cloudflare para gestión externa

#### DNS y CDN (Cloudflare)
- **CNAME Flattening**: Configurado para el dominio raíz (apex domain)
- **SSL/TLS**: Modo "Full (Strict)" para evitar bucles de redirección
- **Reglas de Página**: Canonicalización www vs non-www (redirección 301)

#### Hosting (GitHub Pages)
- Alojamiento de contenido estático
- Integración automática con el repositorio
- Build automático en cada push

### Estructura del Proyecto

```
nereida-joyas-seo/
├── _config.yml          # Configuración Jekyll y SEO
├── _data/
│   ├── productos.yml    # Base de datos de productos (YAML)
│   └── empresa.yml      # Datos del negocio para Schema.org
├── _includes/
│   ├── header.html      # Header del sitio
│   ├── footer.html      # Footer del sitio
│   └── carrito.html     # Componente del carrito
├── _layouts/
│   └── default.html     # Layout principal con Schema.org
├── assets/
│   ├── css/
│   │   └── main.css     # Estilos principales
│   ├── js/
│   │   ├── carrito.js   # Lógica del carrito (localStorage)
│   │   └── main.js      # Scripts principales
│   └── images/          # Imágenes del sitio
├── index.html           # Página principal
├── 404.html            # Página de error
├── robots.txt          # Directivas para crawlers
├── CNAME               # Configuración de dominio personalizado
└── Gemfile             # Dependencias Ruby/Jekyll
```

## 🚀 Desarrollo Local

### Requisitos Previos

- Ruby 2.7 o superior
- Bundler gem

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd nereida-joyas-seo

# Instalar dependencias
bundle install

# Ejecutar servidor local
bundle exec jekyll serve

# El sitio estará disponible en http://localhost:4000
```

## 🛒 Funcionalidades

### Carrito de Compras
- Implementado con Vanilla JavaScript (ES6)
- Persistencia de datos con `localStorage`
- Sin backend - simulación completa de e-commerce
- Checkout mediante redirección a WhatsApp

### Gestión de Productos
- Productos definidos en `_data/productos.yml`
- Categorías: Anillos, Cadenas, Pulseras
- Cada producto incluye: ID, nombre, descripción, precio, imagen, categoría

## 🔍 Optimización SEO

### Meta Tags
- Implementado con `jekyll-seo-tag`
- Open Graph para redes sociales
- Twitter Cards
- Canonical URLs

### Schema.org Markup
- **LocalBusiness**: Datos del negocio (sin dirección física pública)
- **Product**: Marcado estructurado para cada producto
- **Offer**: Información de precios y disponibilidad

### Core Web Vitals
- Lazy loading de imágenes
- CSS optimizado y comprimido
- JavaScript modular y defer
- Preconnect a recursos externos
- Fonts optimizados con display=swap

### Headers HTTP
- Configurados en Cloudflare:
  - Cache-Control
  - Security headers
  - Compression (gzip/brotli)

## 📝 Configuración de Cloudflare

### SSL/TLS
- Modo: **Full (Strict)**
- Certificado SSL automático
- Redirección HTTP → HTTPS

### Page Rules
1. **Canonicalización**: Redirigir `www.nereidajoyas.uy` → `nereidajoyas.uy` (301)
2. **Cache**: Cachear recursos estáticos (CSS, JS, imágenes)

### DNS
- **CNAME Flattening**: Habilitado para dominio raíz
- Registros A/AAAA apuntando a GitHub Pages IPs

## ⚠️ Nota sobre HTTPS en GitHub Pages

El checkbox "Enforce HTTPS" en GitHub Pages puede no estar disponible cuando:
- El dominio pasa por Cloudflare como proxy
- GitHub no puede validar directamente la configuración DNS
- El dominio está en proceso de verificación

**Solución**: Cloudflare maneja el SSL/TLS con modo "Full (Strict)", por lo que el tráfico está encriptado end-to-end. GitHub Pages puede usar HTTP internamente sin afectar la seguridad.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 1024px
- Touch-friendly en dispositivos móviles
- Imágenes adaptativas

## 🔧 Personalización

### Agregar Productos
Editar `_data/productos.yml` y agregar productos en las categorías correspondientes.

### Modificar Datos de la Empresa
Editar `_data/empresa.yml` con la información actualizada.

### Cambiar Estilos
Modificar `assets/css/main.css` - variables CSS en `:root` para personalización rápida.

## 📄 Licencia

Este es un proyecto de práctica/portafolio.

## 🤝 Contribuciones

Este es un proyecto de práctica. Las contribuciones son bienvenidas para mejoras de SEO y performance.
