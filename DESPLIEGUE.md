# Guía de Despliegue - Nereida Joyas

## Pasos para Desplegar el Sitio

### 1. Preparación del Repositorio

```bash
# Asegúrate de tener todos los archivos commitados
git add .
git commit -m "Sitio completo de Nereida Joyas"
git push origin main
```

### 2. Configuración en GitHub

1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
2. En **Source**, selecciona la rama `main` (o `master`)
3. En **Custom domain**, ingresa: `nereidajoyas.uy`
4. GitHub creará automáticamente el archivo `CNAME` si no existe

**Nota**: El checkbox "Enforce HTTPS" puede no estar disponible. Esto es normal cuando usas Cloudflare. Ver `HTTPS_GITHUB_PAGES.md` para más detalles.

### 3. Configuración en Cloudflare

#### 3.1 Agregar el Dominio

1. Inicia sesión en Cloudflare
2. Agrega el sitio `nereidajoyas.uy`
3. Cloudflare escaneará los registros DNS existentes

#### 3.2 Configurar DNS

**Opción A: Con CNAME Flattening (Recomendado)**

1. Crea un registro CNAME:
   - **Name**: `@` (o `nereidajoyas.uy`)
   - **Target**: `tu-usuario.github.io` (o `tu-organizacion.github.io`)
   - **Proxy status**: Proxied (nube naranja) ✅
   - **CNAME Flattening**: Automático

2. Para la versión www (opcional):
   - **Name**: `www`
   - **Target**: `nereidajoyas.uy`
   - **Proxy status**: Proxied ✅

**Opción B: Con Registros A/AAAA**

1. Obtén las IPs de GitHub Pages:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

2. Crea registros A:
   - **Name**: `@`
   - **IPv4 address**: (cada IP en un registro separado)
   - **Proxy status**: Proxied ✅

#### 3.3 Configurar SSL/TLS

1. Ve a **SSL/TLS** → **Overview**
2. Selecciona **Full (Strict)**
3. Esto garantiza encriptación end-to-end

#### 3.4 Configurar Page Rules

1. Ve a **Rules** → **Page Rules**
2. Crea una regla para canonicalización:

   **Rule 1: Redirigir www a non-www**
   - **URL**: `www.nereidajoyas.uy/*`
   - **Settings**:
     - Forwarding URL (301 Permanent Redirect) → `https://nereidajoyas.uy/$1`

   **Rule 2: Cachear recursos estáticos** (Opcional)
   - **URL**: `nereidajoyas.uy/assets/*`
   - **Settings**:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month

#### 3.5 Configurar Always Use HTTPS

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **Always Use HTTPS**
3. Esto redirige automáticamente HTTP → HTTPS

#### 3.6 Configurar Automatic HTTPS Rewrites

1. En **SSL/TLS** → **Edge Certificates**
2. Activa **Automatic HTTPS Rewrites**
3. Esto reemplaza enlaces HTTP por HTTPS

### 4. Configuración en Netuy (Registrador)

1. Inicia sesión en Netuy
2. Ve a la gestión de DNS del dominio `nereidajoyas.uy`
3. **Cambia los servidores de nombres (NS)** a los proporcionados por Cloudflare:
   ```
   ejemplo.ns.cloudflare.com
   ejemplo.ns.cloudflare.com
   ```
4. Guarda los cambios
5. La propagación DNS puede tomar de 24 a 48 horas

### 5. Verificación

#### 5.1 Verificar DNS

```bash
# Verificar que el dominio apunta a Cloudflare
dig nereidajoyas.uy NS

# Verificar que Cloudflare resuelve correctamente
dig nereidajoyas.uy A
```

#### 5.2 Verificar SSL

```bash
# Verificar certificado SSL
openssl s_client -connect nereidajoyas.uy:443 -servername nereidajoyas.uy
```

#### 5.3 Verificar el Sitio

1. Visita `https://nereidajoyas.uy`
2. Verifica que:
   - El sitio carga correctamente
   - El candado verde aparece (HTTPS)
   - No hay errores de contenido mixto
   - El carrito funciona
   - Los productos se muestran

### 6. Verificación en Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega la propiedad `nereidajoyas.uy`
3. Verifica la propiedad usando uno de estos métodos:
   - **HTML tag**: Agrega el meta tag en `_layouts/default.html`
   - **DNS**: Agrega un registro TXT en Cloudflare
   - **HTML file**: Sube el archivo HTML a la raíz del sitio
4. Una vez verificado, envía el sitemap: `https://nereidajoyas.uy/sitemap.xml`

### 7. Personalización

#### Actualizar Datos de Contacto

1. Edita `_data/empresa.yml`:
   - Actualiza el teléfono de WhatsApp
   - Actualiza el email
   - Actualiza las redes sociales

2. En `assets/js/carrito.js`, actualiza:
   ```javascript
   const numeroWhatsApp = '598XXXXXXXXX'; // Tu número real
   ```

#### Agregar Imágenes de Productos

1. Coloca las imágenes en `assets/images/productos/`
2. Actualiza las rutas en `_data/productos.yml`
3. Asegúrate de que las imágenes tengan:
   - Formato: JPG o WebP (optimizado)
   - Tamaño: Máximo 800x800px
   - Peso: Menos de 200KB cada una

#### Agregar Logo

1. Coloca el logo en `assets/images/logo.png`
2. Actualiza la ruta en `_config.yml` si es necesario

### 8. Monitoreo Post-Despliegue

#### Verificar Core Web Vitals

1. Usa [PageSpeed Insights](https://pagespeed.web.dev/)
2. Ingresa `https://nereidajoyas.uy`
3. Verifica:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

#### Verificar Indexación

1. En Google Search Console, verifica:
   - Páginas indexadas
   - Errores de rastreo
   - Sitemap procesado correctamente

#### Verificar Schema.org

1. Usa [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Ingresa `https://nereidajoyas.uy`
3. Verifica que detecte:
   - LocalBusiness
   - Product (para cada producto)

## Troubleshooting

### El sitio no carga

1. Verifica que GitHub Pages esté activado
2. Verifica que el dominio esté configurado en GitHub
3. Verifica que los DNS apunten correctamente
4. Espera hasta 48 horas para la propagación DNS

### Error de certificado SSL

1. Verifica que Cloudflare esté en modo "Full (Strict)"
2. Verifica que "Always Use HTTPS" esté activado
3. Espera unos minutos para que el certificado se genere

### El carrito no funciona

1. Verifica que `carrito.js` esté cargado (consola del navegador)
2. Verifica que no haya errores de JavaScript
3. Verifica que localStorage esté habilitado

### Los productos no se muestran

1. Verifica que `_data/productos.yml` tenga la sintaxis correcta
2. Verifica que Jekyll esté compilando correctamente
3. Revisa los logs de GitHub Pages en Settings → Pages

## Soporte

Para problemas técnicos, consulta:
- `DOCUMENTACION_TECNICA.md`: Arquitectura completa
- `HTTPS_GITHUB_PAGES.md`: Explicación sobre HTTPS
- `README.md`: Documentación general

