// ========== CV FUTBOLÍSTICO - INTERACTIVIDAD ==========

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. ANIMACIÓN DE BARRAS DE HABILIDADES (efecto de carga al hacer scroll)
    const skillBars = document.querySelectorAll('.skill-bar__fill');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const width = bar.style.width;
                bar.style.width = '0%';
                bar.classList.add('animated');
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    }
    
    
    
    // 2. TOOLTIP EN ICONOS DE CONTACTO (efecto al pasar el ratón)
    const contactItems = document.querySelectorAll('.cv-header__contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const text = item.innerText.trim();
            const tooltip = document.createElement('span');
            tooltip.className = 'custom-tooltip';
            tooltip.innerText = text.split(' ')[0] === '📞' ? 'Llamar' : 
                                 (text.split(' ')[0] === '✉️' ? 'Enviar email' : 'Copiar');
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#0a2e1c';
            tooltip.style.color = '#ffd700';
            tooltip.style.padding = '4px 8px';
            tooltip.style.borderRadius = '8px';
            tooltip.style.fontSize = '0.7rem';
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            item.style.position = 'relative';
            item.appendChild(tooltip);
            
            item.addEventListener('mouseleave', () => {
                tooltip.remove();
            });
        });
    });
    
    // 3. BOTÓN PARA COPIAR EMAIL O TELÉFONO AL PORTAPAPELES
    contactItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            let textToCopy = item.innerText.trim();
            textToCopy = textToCopy.replace(/[📞✉️]/g, '').trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`✅ ¡Copiado! ${textToCopy}`);
            }).catch(() => {
                showToast('❌ No se pudo copiar');
            });
        });
    });
    
    // 4. SISTEMA DE TOAST (notificaciones flotantes)
    function showToast(message) {
        let toast = document.querySelector('.cv-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'cv-toast';
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.right = '20px';
            toast.style.backgroundColor = '#0a2e1c';
            toast.style.color = '#ffd700';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '30px';
            toast.style.fontSize = '0.9rem';
            toast.style.fontWeight = 'bold';
            toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            toast.style.zIndex = '9999';
            toast.style.borderLeft = '4px solid #ffd700';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(toast);
        }
        
        toast.innerText = message;
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }
    
    // 5. FILTRADO DE PROYECTOS POR TECNOLOGÍA (si hay proyectos)
    const projectCards = document.querySelectorAll('.proj-card');
    if (projectCards.length > 0) {
        // Crear filtro de tecnologías
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filter';
        filterContainer.style.marginBottom = '1rem';
        filterContainer.style.display = 'flex';
        filterContainer.style.gap = '0.5rem';
        filterContainer.style.flexWrap = 'wrap';
        
        const technologies = new Set();
        projectCards.forEach(card => {
            const tech = card.querySelector('.proj-card__tech');
            if (tech) {
                const techs = tech.innerText.replace('🛠 ', '').split(',').map(t => t.trim());
                techs.forEach(t => technologies.add(t));
            }
        });
        
        if (technologies.size > 0) {
            const allBtn = document.createElement('button');
            allBtn.innerText = 'Todos';
            allBtn.className = 'filter-btn active';
            allBtn.style.background = '#ffd700';
            allBtn.style.color = '#0a2e1c';
            allBtn.style.border = 'none';
            allBtn.style.padding = '5px 12px';
            allBtn.style.borderRadius = '20px';
            allBtn.style.cursor = 'pointer';
            allBtn.style.fontWeight = 'bold';
            filterContainer.appendChild(allBtn);
            
            technologies.forEach(tech => {
                const btn = document.createElement('button');
                btn.innerText = tech;
                btn.className = 'filter-btn';
                btn.style.background = '#e0dcc8';
                btn.style.color = '#1a3a2a';
                btn.style.border = 'none';
                btn.style.padding = '5px 12px';
                btn.style.borderRadius = '20px';
                btn.style.cursor = 'pointer';
                filterContainer.appendChild(btn);
                
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.filter-btn').forEach(b => {
                        b.style.background = '#e0dcc8';
                        b.style.color = '#1a3a2a';
                    });
                    btn.style.background = '#ffd700';
                    btn.style.color = '#0a2e1c';
                    
                    projectCards.forEach(card => {
                        const techElement = card.querySelector('.proj-card__tech');
                        if (techElement && techElement.innerText.includes(tech)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
            
            allBtn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.style.background = '#e0dcc8';
                    b.style.color = '#1a3a2a';
                });
                allBtn.style.background = '#ffd700';
                allBtn.style.color = '#0a2e1c';
                projectCards.forEach(card => {
                    card.style.display = 'block';
                });
            });
            
            const mainSection = document.querySelector('.main-section');
            if (mainSection && mainSection.querySelector('.proj-grid')) {
                mainSection.insertBefore(filterContainer, mainSection.querySelector('.proj-grid'));
            }
        }
    }

    // 6. EFECTO DE "TARJETA DE JUGADOR" AL PASAR EL RATÓN POR EXPERIENCIAS
    const entries = document.querySelectorAll('.entry');
    entries.forEach(entry => {
        entry.addEventListener('mouseenter', () => {
            entry.style.transform = 'translateX(8px)';
            entry.style.transition = 'transform 0.2s ease';
        });
        entry.addEventListener('mouseleave', () => {
            entry.style.transform = 'translateX(0)';
        });
    });
    
    // 7. CONTADOR DE HABILIDADES (mostrar nivel numérico al hacer hover)
    const skillItems = document.querySelectorAll('.skill-bar-item');
    skillItems.forEach(item => {
        const barFill = item.querySelector('.skill-bar__fill');
        if (barFill) {
            const width = barFill.style.width;
            const level = parseInt(width);
            const nameSpan = item.querySelector('.skill-bar-item__name');
            
            item.addEventListener('mouseenter', () => {
                const levelValue = level / 10;
                const indicator = document.createElement('span');
                indicator.className = 'skill-level-indicator';
                indicator.innerText = ` ${levelValue}/10`;
                indicator.style.fontSize = '0.7rem';
                indicator.style.color = '#ffb347';
                indicator.style.marginLeft = '8px';
                if (nameSpan && !nameSpan.querySelector('.skill-level-indicator')) {
                    nameSpan.appendChild(indicator);
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const indicator = item.querySelector('.skill-level-indicator');
                if (indicator) indicator.remove();
            });
        }
    });
    
    // 8. ANIMACIÓN DE ENTRADA AL HACER SCROLL
    const animatedElements = document.querySelectorAll('.entry, .training-card, .proj-card, .achievement-item');
    
    function checkScroll() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 50;
            if (isVisible && !el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    }
    
    // Inicializar estilos para animación
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Ejecutar al cargar
    animateSkillBars();
    window.addEventListener('scroll', animateSkillBars);
    
    
    // 9. EFECTO DE SONIDO MENTAL (solo visual) al hacer clic en habilidades
    const skillTags = document.querySelectorAll('.skill-tag-sm, .interest-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tag.style.transform = '';
            }, 150);
            showToast(`✨ ${tag.innerText} ✨`);
        });
    });
    
    // 10. BOTÓN PARA IMPRIMIR MEJORADO
    const printLinks = document.querySelectorAll('.cv-toolbar a[href*="print"]');
    printLinks.forEach(link => {
        if (!link.getAttribute('data-print-enhanced')) {
            link.setAttribute('data-print-enhanced', 'true');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.print();
            });
        }
    });
    
    console.log('⚽ CV Futbolístico cargado con éxito! ⚽');
});