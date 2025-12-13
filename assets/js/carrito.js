/**
 * Sistema de Carrito de Compras
 * Vanilla JavaScript con localStorage para persistencia
 * Simulación de e-commerce sin backend
 */

class CarritoCompras {
  constructor() {
    this.carrito = this.cargarCarrito();
    this.init();
  }

  init() {
    // Elementos del DOM
    this.cartToggle = document.getElementById('cart-toggle');
    this.cartSidebar = document.getElementById('cart-sidebar');
    this.cartOverlay = document.getElementById('cart-overlay');
    this.cartClose = document.getElementById('cart-close');
    this.cartItems = document.getElementById('cart-items');
    this.cartCount = document.getElementById('cart-count');
    this.cartTotal = document.getElementById('cart-total');
    this.btnCheckout = document.getElementById('btn-checkout');

    // Event listeners
    this.cartToggle?.addEventListener('click', () => this.abrirCarrito());
    this.cartClose?.addEventListener('click', () => this.cerrarCarrito());
    this.cartOverlay?.addEventListener('click', () => this.cerrarCarrito());
    this.btnCheckout?.addEventListener('click', () => this.finalizarCompra());

    // Botones de agregar al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const producto = {
          id: btn.dataset.productoId,
          nombre: btn.dataset.productoNombre,
          precio: parseInt(btn.dataset.productoPrecio),
          imagen: btn.dataset.productoImagen
        };
        this.agregarProducto(producto);
      });
    });

    // Renderizar carrito inicial
    this.renderizarCarrito();
  }

  cargarCarrito() {
    try {
      const carritoGuardado = localStorage.getItem('nereidajoyasCarrito');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      return [];
    }
  }

  guardarCarrito() {
    try {
      localStorage.setItem('nereidajoyasCarrito', JSON.stringify(this.carrito));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }

  agregarProducto(producto) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = this.carrito.find(item => item.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      this.carrito.push({
        ...producto,
        cantidad: 1
      });
    }

    this.guardarCarrito();
    this.renderizarCarrito();
    this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
  }

  eliminarProducto(id) {
    this.carrito = this.carrito.filter(item => item.id !== id);
    this.guardarCarrito();
    this.renderizarCarrito();
  }

  actualizarCantidad(id, cantidad) {
    const producto = this.carrito.find(item => item.id === id);
    if (producto) {
      if (cantidad <= 0) {
        this.eliminarProducto(id);
      } else {
        producto.cantidad = cantidad;
        this.guardarCarrito();
        this.renderizarCarrito();
      }
    }
  }

  calcularTotal() {
    return this.carrito.reduce((total, item) => {
      return total + (item.precio * item.cantidad);
    }, 0);
  }

  renderizarCarrito() {
    // Actualizar contador
    const totalItems = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (this.cartCount) {
      this.cartCount.textContent = totalItems;
      this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Renderizar items
    if (this.cartItems) {
      if (this.carrito.length === 0) {
        this.cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        if (this.btnCheckout) {
          this.btnCheckout.disabled = true;
        }
      } else {
        this.cartItems.innerHTML = this.carrito.map(item => `
          <div class="cart-item">
            <img src="${item.imagen || '/assets/images/placeholder.jpg'}" 
                 alt="${item.nombre}" 
                 class="cart-item-image"
                 loading="lazy">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.nombre}</div>
              <div class="cart-item-price">$${this.formatearPrecio(item.precio)} × ${item.cantidad}</div>
            </div>
            <button class="cart-item-remove" 
                    onclick="carrito.eliminarProducto('${item.id}')"
                    aria-label="Eliminar ${item.nombre}">
              ×
            </button>
          </div>
        `).join('');

        if (this.btnCheckout) {
          this.btnCheckout.disabled = false;
        }
      }
    }

    // Actualizar total
    const total = this.calcularTotal();
    if (this.cartTotal) {
      this.cartTotal.textContent = `$${this.formatearPrecio(total)}`;
    }
  }

  formatearPrecio(precio) {
    return new Intl.NumberFormat('es-UY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  }

  abrirCarrito() {
    if (this.cartSidebar) {
      this.cartSidebar.classList.add('active');
    }
    if (this.cartOverlay) {
      this.cartOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  cerrarCarrito() {
    if (this.cartSidebar) {
      this.cartSidebar.classList.remove('active');
    }
    if (this.cartOverlay) {
      this.cartOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  finalizarCompra() {
    if (this.carrito.length === 0) {
      return;
    }

    // Construir mensaje para WhatsApp
    const mensaje = this.construirMensajeWhatsApp();
    const numeroWhatsApp = '598XXXXXXXXX'; // Reemplazar con número real
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Redirigir a WhatsApp
    window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');

    // Limpiar carrito después de un delay (opcional)
    // setTimeout(() => {
    //   this.carrito = [];
    //   this.guardarCarrito();
    //   this.renderizarCarrito();
    //   this.cerrarCarrito();
    // }, 1000);
  }

  construirMensajeWhatsApp() {
    let mensaje = `¡Hola! Me interesa realizar la siguiente compra:\n\n`;
    
    this.carrito.forEach((item, index) => {
      mensaje += `${index + 1}. ${item.nombre}\n`;
      mensaje += `   Cantidad: ${item.cantidad}\n`;
      mensaje += `   Precio unitario: $${this.formatearPrecio(item.precio)}\n`;
      mensaje += `   Subtotal: $${this.formatearPrecio(item.precio * item.cantidad)}\n\n`;
    });

    mensaje += `💰 *Total: $${this.formatearPrecio(this.calcularTotal())}*\n\n`;
    mensaje += `Por favor, confírmame disponibilidad y forma de pago.`;

    return mensaje;
  }

  mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #d4af37;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notificacion);
      }, 300);
    }, 3000);
  }
}

// Inicializar carrito cuando el DOM esté listo
let carrito;
document.addEventListener('DOMContentLoaded', () => {
  carrito = new CarritoCompras();
  // Hacer carrito disponible globalmente para los botones onclick
  window.carrito = carrito;
});

