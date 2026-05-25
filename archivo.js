
let colaboradores = [];

/**
 * Valida que un campo de texto no esté vacío
 * @param {string} valor 
 * @param {string} nombreCampo 
 * @returns {object}
 */
function validarCampoObligatorio(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return {
            valido: false,
            mensaje: `El campo ${nombreCampo} es obligatorio.`
        };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida que el nombre contiene solo letras y espacios
 * @param {string} nombre - El nombre a validar
 * @returns {object} - {valido: boolean, mensaje: string}
 */
function validarNombre(nombre) {
    const validacion = validarCampoObligatorio(nombre, 'Nombre');
    if (!validacion.valido) return validacion;

    const expresion = /^[a-záéíóúñ\s]+$/i;
    if (!expresion.test(nombre)) {
        return {
            valido: false,
            mensaje: 'El nombre solo debe contener letras y espacios.'
        };
    }

    if (nombre.trim().length < 2) {
        return {
            valido: false,
            mensaje: 'El nombre debe tener al menos 2 caracteres.'
        };
    }

    return { valido: true, mensaje: '' };
}

/**
 * Valida que el apellido contiene solo letras y espacios
 * @param {string} apellido - El apellido a validar
 * @returns {object} - {valido: boolean, mensaje: string}
 */
function validarApellido(apellido) {
    const validacion = validarCampoObligatorio(apellido, 'Apellido');
    if (!validacion.valido) return validacion;

    const expresion = /^[a-záéíóúñ\s]+$/i;
    if (!expresion.test(apellido)) {
        return {
            valido: false,
            mensaje: 'El apellido solo debe contener letras y espacios.'
        };
    }

    if (apellido.trim().length < 2) {
        return {
            valido: false,
            mensaje: 'El apellido debe tener al menos 2 caracteres.'
        };
    }

    return { valido: true, mensaje: '' };
}

/**
 * Valida que el cargo no esté vacío
 * @param {string} cargo - El cargo a validar
 * @returns {object} - {valido: boolean, mensaje: string}
 */
function validarCargo(cargo) {
    const validacion = validarCampoObligatorio(cargo, 'Cargo');
    if (!validacion.valido) return validacion;

    if (cargo.trim().length < 3) {
        return {
            valido: false,
            mensaje: 'El cargo debe tener al menos 3 caracteres.'
        };
    }

    return { valido: true, mensaje: '' };
}

/**
 * Valida el correo electrónico con dominio @empresa.cl
 * @param {string} email - El email a validar
 * @returns {object} - {valido: boolean, mensaje: string}
 */
function validarEmail(email) {
    const validacion = validarCampoObligatorio(email, 'Correo electrónico');
    if (!validacion.valido) return validacion;

    // Expresión regular para validar email con dominio @empresa.cl
    const expresion = /^[^\s@]+@empresa\.cl$/i;

    if (!expresion.test(email)) {
        return {
            valido: false,
            mensaje: 'El correo debe tener formato válido y dominio @empresa.cl (ej: usuario@empresa.cl)'
        };
    }

    return { valido: true, mensaje: '' };
}

/**
 * Valida todos los campos del formulario
 * @param {object} datos - Objeto con nombre, apellido, cargo y email
 * @returns {object} - {valido: boolean, errores: object}
 */
function validarFormulario(datos) {
    const errores = {};

    const validaciones = {
        nombre: validarNombre(datos.nombre),
        apellido: validarApellido(datos.apellido),
        cargo: validarCargo(datos.cargo),
        email: validarEmail(datos.email)
    };

    for (const campo in validaciones) {
        if (!validaciones[campo].valido) {
            errores[campo] = validaciones[campo].mensaje;
        }
    }

    return {
        valido: Object.keys(errores).length === 0,
        errores: errores
    };
}


/**
 * Limpia los mensajes de error del formulario
 */
function limpiarMensajesError() {
    const campos = ['nombre', 'apellido', 'cargo', 'email'];
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        const error = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);

        if (input) {
            input.classList.remove('input-error');
        }
        if (error) {
            error.textContent = '';
        }
    });
}

/**
 * Muestra los mensajes de error en el formulario
 * @param {object} errores - Objeto con los errores
 */
function mostrarErrores(errores) {
    limpiarMensajesError();

    for (const campo in errores) {
        const input = document.getElementById(campo);
        const error = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);

        if (input) {
            input.classList.add('input-error');
        }
        if (error) {
            error.textContent = errores[campo];
        }
    }
}

/**
 * Obtiene los valores del formulario
 * @returns {object} - Objeto con los valores
 */
function obtenerValoresFormulario() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        cargo: document.getElementById('cargo').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase()
    };
}

/**
 * Limpia el formulario
 */
function limpiarFormulario() {
    document.getElementById('formRegistro').reset();
    limpiarMensajesError();
}

/**
 * Muestra mensaje de éxito
 * @param {string} mensaje - El mensaje a mostrar
 */
function mostrarExito(mensaje) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = mensaje;
    successDiv.classList.add('show');

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 3000);
}

/**
 * Registra un nuevo colaborador
 * Valida los datos, agrega a array y actualiza la tabla
 */
function registrarColaborador() {
    const valores = obtenerValoresFormulario();
    const validacion = validarFormulario(valores);

    if (!validacion.valido) {
        mostrarErrores(validacion.errores);
        return;
    }

    // Crear objeto del colaborador
    const nuevoColaborador = {
        id: Date.now(), // ID único basado en timestamp
        nombre: valores.nombre,
        apellido: valores.apellido,
        nombreCompleto: `${valores.nombre} ${valores.apellido}`,
        cargo: valores.cargo,
        email: valores.email
    };

    // Agregar al array
    colaboradores.push(nuevoColaborador);

    // Limpiar formulario
    limpiarFormulario();

    // Mostrar mensaje de éxito
    mostrarExito(`✓ ¡${nuevoColaborador.nombreCompleto} ha sido registrado exitosamente!`);

    // Renderizar tabla
    renderizarTabla(colaboradores);

    // Actualizar contador
    actualizarContador();
}

/**
 * Elimina un colaborador del arreglo por su ID
 * @param {number} id - ID del colaborador a eliminar
 */
function eliminarColaborador(id) {
    const indice = colaboradores.findIndex(col => col.id === id);
    
    if (indice !== -1) {
        const nombreEliminado = colaboradores[indice].nombreCompleto;
        colaboradores.splice(indice, 1);
        
        // Mostrar mensaje de eliminación
        mostrarExito(`✓ ¡${nombreEliminado} ha sido eliminado exitosamente!`);
        
        // Obtener término de búsqueda actual
        const inputBusqueda = document.getElementById('busqueda');
        const termino = inputBusqueda.value;
        
        // Renderizar tabla con filtro actual
        const resultados = filtrarColaboradores(termino);
        renderizarTabla(resultados);
        
        // Actualizar contador
        actualizarContador();
    }
}

/**
 * Renderiza la tabla de colaboradores
 * @param {array} datos - Array de colaboradores a mostrar
 */
function renderizarTabla(datos) {
    const tbody = document.getElementById('tablaBody');
    const sinResultados = document.getElementById('sinResultados');

    // Limpiar tabla
    tbody.innerHTML = '';

    if (datos.length === 0) {
        sinResultados.style.display = 'block';
        return;
    }

    sinResultados.style.display = 'none';

    // Crear filas para cada colaborador
    datos.forEach((colaborador) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${colaborador.nombreCompleto}</td>
            <td>${colaborador.cargo}</td>
            <td>${colaborador.email}</td>
            <td><button class="btn-eliminar" data-id="${colaborador.id}">Eliminar</button></td>
        `;
        tbody.appendChild(fila);
        
        // Agregar event listener al botón eliminar
        const btnEliminar = fila.querySelector('.btn-eliminar');
        btnEliminar.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            eliminarColaborador(id);
        });
    });
}

/**
 * Filtra los colaboradores por nombre o cargo
 * @param {string} termino - Término de búsqueda
 * @returns {array} - Array filtrado de colaboradores
 */
function filtrarColaboradores(termino) {
    if (!termino || termino.trim() === '') {
        return colaboradores;
    }

    const terminoLower = termino.toLowerCase();

    return colaboradores.filter(colaborador => {
        return (
            colaborador.nombreCompleto.toLowerCase().includes(terminoLower) ||
            colaborador.cargo.toLowerCase().includes(terminoLower)
        );
    });
}

/**
 * Actualiza el contador de colaboradores
 */
function actualizarContador() {
    const totalElement = document.getElementById('totalColaboradores');
    totalElement.textContent = colaboradores.length;
}


document.addEventListener('DOMContentLoaded', function() {
    // Botón de envío del formulario
    const formulario = document.getElementById('formRegistro');
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarColaborador();
    });

    // Campo de búsqueda con filtrado en tiempo real
    const inputBusqueda = document.getElementById('busqueda');
    inputBusqueda.addEventListener('input', function(e) {
        const termino = e.target.value;
        const resultados = filtrarColaboradores(termino);
        renderizarTabla(resultados);
    });

    // Validación en tiempo real (opcional - al perder el foco)
    const campos = ['nombre', 'apellido', 'cargo', 'email'];
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input) {
            input.addEventListener('blur', function() {
                const valor = this.value.trim();
                if (valor) {
                    let validacion;
                    switch(campo) {
                        case 'nombre':
                            validacion = validarNombre(valor);
                            break;
                        case 'apellido':
                            validacion = validarApellido(valor);
                            break;
                        case 'cargo':
                            validacion = validarCargo(valor);
                            break;
                        case 'email':
                            validacion = validarEmail(valor);
                            break;
                    }

                    if (validacion && !validacion.valido) {
                        const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
                        this.classList.add('input-error');
                        if (errorElement) {
                            errorElement.textContent = validacion.mensaje;
                        }
                    } else {
                        this.classList.remove('input-error');
                        const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
                        if (errorElement) {
                            errorElement.textContent = '';
                        }
                    }
                }
            });

            // Limpiar error al escribir
            input.addEventListener('input', function() {
                this.classList.remove('input-error');
                const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        }
    });

    // Inicializar tabla vacía
    renderizarTabla(colaboradores);
    actualizarContador();
});