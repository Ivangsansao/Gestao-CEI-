/**
 * SIGEPS - Script Principal Otimizado
 * Gestão do Trabalho e Centro de Educação e Inovação em Saúde
 * Versão 2.0 - Performance e Acessibilidade
 */

(function() {
    'use strict';

    // ===== CONFIGURAÇÕES =====
    const CONFIG = {
        SCROLL_OFFSET: 100,
        MOBILE_BREAKPOINT: 768,
        ANIMATION_DURATION: 50, // frames para animação de números
        DEBOUNCE_DELAY: 250 // ms para eventos de resize
    };

    // ===== INICIALIZAÇÃO =====
    class SIGEPS {
        constructor() {
            // Elementos do DOM
            this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
            this.navMenu = document.getElementById('navMenu');
            this.header = document.querySelector('.header');
            this.sections = document.querySelectorAll('section[id]');
            this.navLinks = document.querySelectorAll('.nav-list a');
            
            this.init();
        }

        /**
         * Inicializa todas as funcionalidades
         */
        init() {
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.setupHeaderScroll();
            this.setupActiveMenuHighlight();
            this.setupStatsAnimation();
            this.setupImageHandling();
            this.setupAccessibility();
            this.setupResizeHandler();
            
            // Log de inicialização (apenas em desenvolvimento)
            if (window.location.hostname === 'localhost') {
                console.log('✅ SIGEPS inicializado com sucesso');
            }
        }

        // ===== MENU MOBILE =====
        setupMobileMenu() {
            if (!this.mobileMenuBtn || !this.navMenu) return;

            this.mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Fecha menu ao clicar em links
            this.navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Fecha menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!this.navMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            const isActive = this.navMenu.classList.toggle('active');
            this.mobileMenuBtn.setAttribute('aria-expanded', isActive);
            
            const icon = this.mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
            }
        }

        closeMobileMenu() {
            this.navMenu.classList.remove('active');
            this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = this.mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }

        // ===== SCROLL SUAVE =====
        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }

        // ===== HEADER TRANSPARENTE =====
        setupHeaderScroll() {
            if (!this.header) return;

            const updateHeader = () => {
                if (window.scrollY > 50) {
                    this.header.style.background = 'rgba(10, 42, 68, 0.98)';
                    this.header.style.boxShadow = 'var(--shadow-md)';
                } else {
                    this.header.style.background = 'rgba(10, 42, 68, 0.95)';
                    this.header.style.boxShadow = 'var(--shadow-sm)';
                }
            };

            // Otimização com requestAnimationFrame
            window.addEventListener('scroll', () => {
                requestAnimationFrame(updateHeader);
            });
        }

        // ===== DESTAQUE DO MENU ATIVO =====
        setupActiveMenuHighlight() {
            if (!this.sections.length || !this.navLinks.length) return;

            const updateActiveLink = () => {
                let current = '';
                const scrollPosition = window.scrollY + CONFIG.SCROLL_OFFSET;

                this.sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        current = section.getAttribute('id');
                    }
                });

                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            };

            window.addEventListener('scroll', () => {
                requestAnimationFrame(updateActiveLink);
            });
        }

        // ===== ANIMAÇÃO DE NÚMEROS =====
        setupStatsAnimation() {
            const statsSection = document.querySelector('.stats-section');
            if (!statsSection) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateNumbers();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(statsSection);
        }

        animateNumbers() {
            const stats = document.querySelectorAll('.stat-number');
            
            stats.forEach(stat => {
                const targetText = stat.innerText;
                const target = parseInt(targetText.replace(/[^0-9]/g, '')) || 0;
                if (target === 0) return;

                let current = 0;
                const increment = target / CONFIG.ANIMATION_DURATION;
                const hasPlus = targetText.includes('+');
                
                const updateNumber = () => {
                    if (current < target) {
                        current += increment;
                        if (current > target) current = target;
                        stat.innerText = Math.floor(current) + (hasPlus ? '+' : '');
                        requestAnimationFrame(updateNumber);
                    }
                };
                
                updateNumber();
            });
        }

        // ===== IMAGENS =====
        setupImageHandling() {
            // Lazy loading nativo (se suportado)
            if ('loading' in HTMLImageElement.prototype) {
                const images = document.querySelectorAll('img[loading="lazy"]');
                images.forEach(img => {
                    img.loading = 'lazy';
                });
            }

            // Fallback para imagens quebradas
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', () => {
                    this.handleImageError(img);
                }, { once: true });
            });
        }

        handleImageError(img) {
            img.src = 'https://via.placeholder.com/400x300?text=Imagem+indispon%C3%ADvel';
            img.alt = 'Imagem não disponível';
        }

        // ===== ACESSIBILIDADE =====
        setupAccessibility() {
            // Detecta navegação por teclado
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('user-is-tabbing');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('user-is-tabbing');
            });

            // Adiciona atributos ARIA onde necessário
            document.querySelectorAll('.quadro-card, .feature-card, .nucleo-card').forEach(card => {
                if (!card.hasAttribute('role')) {
                    card.setAttribute('role', 'article');
                }
            });
        }

        // ===== REDIMENSIONAMENTO =====
        setupResizeHandler() {
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT) {
                        this.closeMobileMenu();
                    }
                }, CONFIG.DEBOUNCE_DELAY);
            });
        }
    }

    // ===== FUNÇÕES GLOBAIS (para compatibilidade) =====
    
    /**
     * Função para mostrar detalhes de um núcleo específico
     * @param {string} id - ID do elemento do núcleo
     */
    window.showNucleo = function(id) {
        // Validação
        if (!id || typeof id !== 'string') {
            console.error('ID inválido fornecido para showNucleo');
            return;
        }

        // Esconder todos os núcleos com animação suave
        const nucleos = document.querySelectorAll('.nucleo-info');
        nucleos.forEach(n => {
            n.style.transition = 'opacity 0.3s ease';
            n.style.opacity = '0';
            setTimeout(() => {
                n.style.display = 'none';
            }, 300);
        });

        // Mostrar o núcleo selecionado
        const nucleo = document.getElementById(id);
        if (nucleo) {
            // Prepara para mostrar
            nucleo.style.display = 'block';
            nucleo.style.opacity = '0';
            
            // Força reflow para animação funcionar
            nucleo.offsetHeight;
            
            // Anima entrada
            nucleo.style.transition = 'opacity 0.3s ease';
            nucleo.style.opacity = '1';
            
            // Scroll suave até o núcleo
            nucleo.scrollIntoView({ 
                behavior: "smooth", 
                block: "center" 
            });
            
            // Anúncio para leitores de tela (acessibilidade)
            const anuncio = document.createElement('div');
            anuncio.setAttribute('aria-live', 'polite');
            anuncio.classList.add('sr-only');
            anuncio.textContent = `Núcleo ${id.replace('nucleo', '')} carregado`;
            document.body.appendChild(anuncio);
            
            // Remove o anúncio após ser lido
            setTimeout(() => anuncio.remove(), 1000);
        } else {
            console.warn(`Elemento com ID "${id}" não encontrado`);
        }
    };

    /**
     * Função para verificar carregamento de imagens (útil para debug)
     */
    window.checkImages = function() {
        const images = document.querySelectorAll('img');
        const loaded = [];
        const failed = [];

        images.forEach(img => {
            if (img.complete && img.naturalHeight > 0) {
                loaded.push(img.src.split('/').pop());
            } else if (img.complete && img.naturalHeight === 0) {
                failed.push(img.src.split('/').pop());
            }
        });

        console.log('✅ Imagens carregadas:', loaded);
        if (failed.length > 0) {
            console.warn('❌ Imagens com erro:', failed);
        }
        
        return { loaded, failed };
    };

    // ===== INICIALIZAÇÃO =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new SIGEPS());
    } else {
        // DOM já está carregado
        new SIGEPS();
    }

})();
