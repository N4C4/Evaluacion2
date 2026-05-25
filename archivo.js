
let colaboradores = [];

function validarCampoObligatorio(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio.` };
    }
    return { valido: true, mensaje: '' };
}

function validarNombre(nombre) {
    const validacion = validarCampoObligatorio(nombre, 'Nombre');
    if (!validacion.valido) return validacion;
    const expresion = /^[a-záéíóúñ\s]+$/i;
    if (!expresion.test(nombre)) {
        return { valido: false, mensaje: 'El nombre solo debe contener letras y espacios.' };
    }
    if (nombre.trim().length < 2) {
        return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres.' };
    }
    return { valido: true, mensaje: '' };
}

function validarApellido(apellido) {
    const validacion = validarCampoObligatorio(apellido, 'Apellido');
    if (!validacion.valido) return validacion;
    const expresion = /^[a-záéíóúñ\s]+$/i;
    if (!expresion.test(apellido)) {
        return { valido: false, mensaje: 'El apellido solo debe contener letras y espacios.' };
    }
    if (apellido.trim().length < 2) {
        return { valido: false, mensaje: 'El apellido debe tener al menos 2 caracteres.' };
    }
    return { valido: true, mensaje: '' };
}

function validarCargo(cargo) {
    const validacion = validarCampoObligatorio(cargo, 'Cargo');
    if (!validacion.valido) return validacion;
    if (cargo.trim().length < 3) {
        return { valido: false, mensaje: 'El cargo debe tener al menos 3 caracteres.' };
    }
    return { valido: true, mensaje: '' };
}

function validarEmail(email) {
    const validacion = validarCampoObligatorio(email, 'Correo electrónico');
    if (!validacion.valido) return validacion;
    const expresion = /^[^\s@]+@empresa\.cl$/i;
    if (!expresion.test(email)) {
        return { valido: false, mensaje: 'El correo debe tener formato válido y dominio @empresa.cl (ej: usuario@empresa.cl)' };
    }
    return { valido: true, mensaje: '' };
}

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
    return { valido: Object.keys(errores).length === 0, errores: errores };
}

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

function obtenerValoresFormulario() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        cargo: document.getElementById('cargo').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase()
    };
}

function limpiarFormulario() {
    document.getElementById('formRegistro').reset();
    limpiarMensajesError();
}

function mostrarExito(mensaje) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = mensaje;
    successDiv.classList.add('show');
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 3000);
}

function registrarColaborador() {
    const valores = obtenerValoresFormulario();
    const validacion = validarFormulario(valores);
    if (!validacion.valido) {
        mostrarErrores(validacion.errores);
        return;
    }
    const nuevoColaborador = {
        id: Date.now(),
        nombre: valores.nombre,
        apellido: valores.apellido,
        nombreCompleto: `${valores.nombre} ${valores.apellido}`,
        cargo: valores.cargo,
        email: valores.email
    };
    colaboradores.push(nuevoColaborador);
    limpiarFormulario();
    mostrarExito(`✓ ¡${nuevoColaborador.nombreCompleto} ha sido registrado exitosamente!`);
    renderizarTabla(colaboradores);
    actualizarContador();
}

function eliminarColaborador(id) {
    const indice = colaboradores.findIndex(col => col.id === id);
    if (indice !== -1) {
        const nombreEliminado = colaboradores[indice].nombreCompleto;
        colaboradores.splice(indice, 1);
        mostrarExito(`✓ ¡${nombreEliminado} ha sido eliminado exitosamente!`);
        const inputBusqueda = document.getElementById('busqueda');
        const termino = inputBusqueda.value;
        const resultados = filtrarColaboradores(termino);
        renderizarTabla(resultados);
        actualizarContador();
    }
}

function renderizarTabla(datos) {
    const tbody = document.getElementById('tablaBody');
    const sinResultados = document.getElementById('sinResultados');
    tbody.innerHTML = '';
    if (datos.length === 0) {
        sinResultados.style.display = 'block';
        return;
    }
    sinResultados.style.display = 'none';
    datos.forEach((colaborador) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${colaborador.nombreCompleto}</td>
            <td>${colaborador.cargo}</td>
            <td>${colaborador.email}</td>
            <td><button class="btn-eliminar" data-id="${colaborador.id}">Eliminar</button></td>
        `;
        tbody.appendChild(fila);
        const btnEliminar = fila.querySelector('.btn-eliminar');
        btnEliminar.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            eliminarColaborador(id);
        });
    });
}

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

function actualizarContador() {
    const totalElement = document.getElementById('totalColaboradores');
    totalElement.textContent = colaboradores.length;
}

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formRegistro');
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        registrarColaborador();
    });
    const inputBusqueda = document.getElementById('busqueda');
    inputBusqueda.addEventListener('input', function(e) {
        const termino = e.target.value;
        const resultados = filtrarColaboradores(termino);
        renderizarTabla(resultados);
    });
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
            input.addEventListener('input', function() {
                this.classList.remove('input-error');
                const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        }
    });
    renderizarTabla(colaboradores);
    actualizarContador();
});